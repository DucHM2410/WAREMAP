import type { DemoData, Product, Role, InboundCarton } from "../../app/model"
import { WAREHOUSE_PERMISSIONS } from "../../app/warehousePermissions"
import { storagePackageFor, storageUnits, validPackage } from "../builder/productSizing"

export type PutawayRequest = {
  locationCode: string
  cartonCode: string
  role: Role
  allowedBranches: string[]
  branchNames: string[]
  stacking: boolean
  layers: number
  confirmedPackaging: boolean
  unmeasuredAck: boolean
  separatedAck: boolean
  today: string
}
export function parseLocation(code: string, data: DemoData, branchNames: string[]) {
  const parts = code.trim().split(":")
  if(parts.length!==5||parts[0]!=="LOC"||!/^\d+$/.test(parts[1])||!/^\d+$/.test(parts[3])||!/^\d+$/.test(parts[4]))return null
  const branch=branchNames[Number(parts[1])], rack=data.racks[branch]?.find(r=>r.id===parts[2])
  const level=Number(parts[3]),bin=Number(parts[4])
  return rack&&level>=1&&level<=rack.levels&&bin>=1&&bin<=rack.bins ? {branch,rack:rack.id,level,bin} : null
}
const key=(p:Product)=>`${p.id}|${p.batch}|${p.branch}`
export function assessPutaway(data: DemoData, request: PutawayRequest) {
  const fail=(error:string)=>({error,product:null,carton:null,capacityNote:""})
  if(!WAREHOUSE_PERMISSIONS[request.role].putaway)return fail("Vai trò này không được nhập hàng lên kệ.")
  const location=parseLocation(request.locationCode,data,request.branchNames)
  if(!location||!request.allowedBranches.includes(location.branch))return fail("QR vị trí không hợp lệ hoặc nằm ngoài cơ sở được cấp quyền.")
  const carton=(data.inboundCartons||[]).find(c=>c.code===request.cartonCode.trim())
  if(!carton)return fail("Mã thùng chưa đăng ký. Tạo thùng chờ nhập và kiểm tra nội dung trước.")
  if(carton.status!=="pending")return fail("Thùng này đã nhập lên kệ. Không cộng tồn lần thứ hai.")
  if(carton.product.branch!==location.branch)return fail("Thùng dành cho cơ sở khác. Kiểm tra lại phiếu nhập.")
  const p=carton.product
  if(p.storage3d?.unitsPerContainer&&(!Number.isInteger(p.storage3d.unitsPerContainer)||p.storage3d.unitsPerContainer<1||!p.storage3d.containerPackage||!validPackage(p.storage3d.containerPackage)))return fail("Quy cách nguyên thùng hoặc kích thước vỏ thùng chưa hợp lệ.")
  if(!p.id.trim()||!p.name.trim()||!p.batch.trim()||!Number.isInteger(p.qty)||p.qty<=0||!/^\d{4}-\d{2}-\d{2}$/.test(p.expiry)||!Number.isFinite(Date.parse(p.expiry))||new Date(p.expiry).toISOString().slice(0,10)!==p.expiry||p.expiry<request.today)return fail("Thông tin thùng chưa hợp lệ hoặc lô đã hết hạn. Kiểm tra SKU, lô, số lượng và hạn dùng.")
  const same=data.products.find(item=>key(item)===key(p))
  if(same&&same.qty>0&&same.expiry!==p.expiry)return fail("Hạn dùng không khớp với lô đã có. Kiểm tra chứng từ trước khi nhập bổ sung.")
  if(same&&same.qty>0&&(same.storage3d?.unitsPerContainer!==p.storage3d?.unitsPerContainer||JSON.stringify(same.storage3d?.containerPackage)!==JSON.stringify(p.storage3d?.containerPackage)))return fail("Cách đóng gói của lô đã có khác thùng mới. Demo cần cùng quy cách lưu trong một lô/ô; đối chiếu trước khi nhập.")
  if(same&&same.qty>0&&(same.rack!==location.rack||same.level!==location.level||same.bin!==location.bin))return fail("Lô này đang ở vị trí khác. Nhập bổ sung vào cùng vị trí hoặc chuyển lô trước; demo chưa tách một lô ra nhiều vị trí.")
  if(!Number.isInteger(request.layers)||request.layers<1||request.layers>5)return fail("Chọn từ 1 đến 5 lớp xếp.")
  if(request.stacking&&!request.confirmedPackaging)return fail("Cần xác nhận bao bì cho phép xếp chồng và giới hạn lớp theo hướng dẫn đóng gói.")
  const product:Product={...p,...location,qty:(same?.qty||0)+p.qty,storage3d:{...p.storage3d,layers:request.stacking?request.layers:1,stackable:request.stacking}}
  if(request.stacking&&request.layers>storageUnits(product))return fail("Số lớp không được lớn hơn số đơn vị lưu trữ hoặc số thùng tại ô.")
  const rack=data.racks[location.branch].find(r=>r.id===location.rack)!
  const occupants=data.products.filter(item=>item.branch===location.branch&&item.rack===location.rack&&item.level===location.level&&item.bin===location.bin&&item.qty>0&&key(item)!==key(p))
  if(occupants.length&&!request.separatedAck)return fail("Ô đã có lô khác. Xác nhận tách khay/vùng và giữ nhãn từng lô trước khi nhập chung.")
  const items=[...occupants,product]
  const uncertain=items.some(item=>storagePackageFor(item).estimated)
  if(request.stacking&&uncertain)return fail("Để xếp chồng cần nhập kích thước bao bì thực tế cho tất cả hàng trong ô.")
  {
    // Conservative dedicated strips prevent different lots from occupying the same space.
    const widthCm=rack.width/rack.bins*100/items.length,depthCm=rack.depth*100,heightCm=rack.height/rack.levels*100-5.5
    for(const item of items){
      if(storagePackageFor(item).estimated)continue
      const size=storagePackageFor(item).value,layers=item.storage3d?.stackable?item.storage3d.layers:1
      const capacity=Math.floor((widthCm+1e-8)/size.widthCm)*Math.floor((depthCm+1e-8)/size.depthCm)*layers
      if(size.heightCm*layers>heightCm+1e-8||storageUnits(item)>capacity)return fail("Ô chưa đủ chỗ theo cách chia vùng bảo thủ và số lớp đã chọn. Chọn ô khác, giảm số hàng trong thùng hoặc đổi cấu hình kệ.")
    }
  }
  if(uncertain&&!request.unmeasuredAck)return fail("Ô có hàng chưa đo kích thước. Xác nhận đã kiểm tra chỗ trống thực tế; hệ thống chưa xác nhận sức chứa.")
  return {error:"",product,carton,capacityNote:uncertain?"Đã xác nhận kiểm tra chỗ trống bằng thực tế; chưa tính sức chứa.":"Ước tính theo kích thước, chia vùng riêng cho từng lô; không xác nhận tải trọng kệ."}
}
export function completePutaway(data: DemoData, request: PutawayRequest) {
  const result=assessPutaway(data,request)
  if(result.error||!result.product||!result.carton)return {data,...result}
  const product=result.product
  const exists=data.products.some(item=>key(item)===key(product))
  return {...result,data:{...data,products:exists?data.products.map(item=>key(item)===key(product)?product:item):[...data.products,product],inboundCartons:(data.inboundCartons||[]).map(c=>c.id===result.carton!.id?{...c,status:"stored" as const,storedAt:new Date().toISOString(),placement:{rack:product.rack,level:product.level,bin:product.bin}}:c)}}
}
export function validCarton(carton: InboundCarton, existing: InboundCarton[]) {
  return /^CTN:[A-Za-z0-9_-]{3,60}$/.test(carton.code)&&!existing.some(c=>c.code===carton.code)&&!!carton.product.id.trim()&&!!carton.product.name.trim()&&!!carton.product.batch.trim()&&Number.isInteger(carton.product.qty)&&carton.product.qty>0
}
