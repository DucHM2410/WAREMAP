import type { DemoData, Product, Role, InboundCarton } from "../../app/model"
import { WAREHOUSE_PERMISSIONS } from "../../app/warehousePermissions"
import { storagePackageFor, storageUnits, validPackage } from "../builder/productSizing"
import { slotLayout } from "../builder/slotLayout"

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
  if(!p.id.trim()||!p.name.trim()||!p.batch.trim()||!Number.isInteger(p.qty)||p.qty<=0||!/^\d{4}-\d{2}-\d{2}$/.test(p.expiry)||!Number.isFinite(Date.parse(p.expiry))||new Date(p.expiry).toISOString().slice(0,10)!==p.expiry||p.expiry<request.today)return fail("Thông tin thùng chưa hợp lệ hoặc lô đã hết hạn. Kiểm tra mã sản phẩm, mã lô, số lượng và hạn dùng.")
  const same=data.products.find(item=>key(item)===key(p))
  if(same&&same.qty>0&&same.expiry!==p.expiry)return fail("Hạn dùng không khớp với lô đã có. Kiểm tra chứng từ trước khi nhập bổ sung.")
  if(same&&same.qty>0&&(same.storage3d?.unitsPerContainer!==p.storage3d?.unitsPerContainer||JSON.stringify(same.storage3d?.containerPackage)!==JSON.stringify(p.storage3d?.containerPackage)))return fail("Cách đóng gói của lô đã có khác thùng mới. Trong demo, hàng cùng lô tại một ô phải cùng cách đóng gói. Kiểm tra lại trước khi nhập.")
  if(same&&same.qty>0&&(same.rack!==location.rack||same.level!==location.level||same.bin!==location.bin))return fail("Lô này đang ở vị trí khác. Nhập bổ sung vào cùng vị trí hoặc chuyển lô trước; demo chưa tách một lô ra nhiều vị trí.")
  if(!Number.isInteger(request.layers)||request.layers<1||request.layers>5)return fail("Chọn từ 1 đến 5 lớp xếp.")
  if(request.stacking&&!request.confirmedPackaging)return fail("Bạn đã chọn đặt nhiều lớp. Hãy xác nhận bao bì và kệ chịu được số lớp đó, hàng được đặt vững chắc.")
  const product:Product={...p,...location,package3d:p.package3d||same?.package3d,qty:(same?.qty||0)+p.qty,storage3d:{...same?.storage3d,...p.storage3d,placement:same?.storage3d?.placement||p.storage3d?.placement,layers:request.stacking?request.layers:same?.storage3d?.layers||1,stackable:request.stacking||!!same?.storage3d?.stackable}}
  if(request.stacking&&request.layers>storageUnits(product))return fail("Số lớp đang lớn hơn số sản phẩm hoặc số thùng có trong ô. Hãy chọn ít lớp hơn.")
  const rack=data.racks[location.branch].find(r=>r.id===location.rack)!
  const occupants=data.products.filter(item=>item.branch===location.branch&&item.rack===location.rack&&item.level===location.level&&item.bin===location.bin&&item.qty>0&&key(item)!==key(p))
  if(occupants.length&&!request.separatedAck)return fail("Ô này đã có lô hàng khác. Để mỗi lô sang một bên hoặc vào khay riêng, giữ nhãn từng lô, rồi tích xác nhận đã để hàng mới riêng.")
  const items=[...occupants,product]
  const uncertain=items.some(item=>storagePackageFor(item).estimated)
  if(request.stacking&&uncertain)return fail("Muốn đặt hộp lên nhau, cần nhập kích thước đã đo của tất cả sản phẩm trong ô này.")
  if(!slotLayout(rack,items).fits)return fail("Theo kích thước đã nhập và số lớp bạn chọn, ô này không đủ chỗ. Hãy chọn ô khác hoặc giảm số hàng trong thùng.")
  if(uncertain&&!request.unmeasuredAck)return fail("Web chưa đủ kích thước để tính chỗ trống. Hãy kiểm tra ô kệ thực tế, để riêng từng lô và tích xác nhận ô còn đủ chỗ.")
  return {error:"",product,carton,capacityNote:uncertain?"Bạn đã xác nhận ô kệ thực tế còn đủ chỗ. Web chưa tính được vì còn thiếu kích thước sản phẩm.":"Theo kích thước đã nhập, ô kệ dự kiến đủ chỗ. Bạn vẫn cần kiểm tra kệ có chịu được trọng lượng hàng hay không."}
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
