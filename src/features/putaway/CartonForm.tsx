import { useState } from "react"
import { useApp } from "../../app/store"
import { today, type InboundCarton, type Product, type ProductPackage } from "../../app/model"
import { Button } from "../../app/ui"
import { validCarton } from "./putaway"
import { validPackage, PACKAGE_SHAPES } from "../builder/productSizing"

export function CartonForm({onCreated}: {onCreated:(carton:InboundCarton)=>void}) {
  const {data,update,accessibleBranches,branch}=useApp()
  const [selected,setSelected]=useState("new"),[measured,setMeasured]=useState(false),[wholeCarton,setWholeCarton]=useState(false),[error,setError]=useState("")
  const [defaultCode]=useState(()=>'THUNG-'+crypto.randomUUID().slice(0,8).toUpperCase())
  const catalog=data.products.filter(p=>accessibleBranches.includes(p.branch))
  const source=catalog.find((_,index)=>String(index)===selected)
  return <form className="stack" key={selected} onSubmit={event=>{
    event.preventDefault();const f=new FormData(event.currentTarget)
    const product:Product={id:source?.id||String(f.get('sku')).trim(),name:source?.name||String(f.get('name')).trim(),variant:source?.variant||String(f.get('variant')).trim(),category:source?.category||String(f.get('category')).trim(),batch:String(f.get('batch')).trim(),expiry:String(f.get('expiry')),qty:Number(f.get('qty')),branch:String(f.get('branch')),rack:'',level:1,bin:1}
    if(measured){const pack:ProductPackage={widthCm:Number(f.get('width')),depthCm:Number(f.get('depth')),heightCm:Number(f.get('height')),shape:String(f.get('shape')) as ProductPackage['shape']};if(!validPackage(pack))return setError("Kiểm tra kích thước bao bì từ 0,5 đến 150 cm.");product.package3d=pack}
    if(wholeCarton){const pack:ProductPackage={widthCm:Number(f.get('outerWidth')),depthCm:Number(f.get('outerDepth')),heightCm:Number(f.get('outerHeight')),shape:'box'};if(!validPackage(pack))return setError("Nhập kích thước đã đo của nguyên thùng.");product.storage3d={layers:1,stackable:false,unitsPerContainer:product.qty,containerPackage:pack}}
    if(!source&&data.products.some(p=>p.id===product.id))return setError("Mã SKU đã có. Chọn hàng có sẵn thay vì khai báo trùng mã.")
    const carton:InboundCarton={id:crypto.randomUUID(),code:'CTN:'+String(f.get('code')).trim(),product,status:'pending',createdAt:new Date().toISOString()}
    if(!accessibleBranches.includes(product.branch)||!validCarton(carton,data.inboundCartons||[])||!product.expiry||product.expiry<today())return setError("Kiểm tra mã thùng (chữ/số/gạch nối, không trùng), SKU, lô, hạn dùng và số lượng nguyên dương.")
    update(current=>validCarton(carton,current.inboundCartons||[])?{...current,inboundCartons:[carton,...current.inboundCartons||[]]}:current)
    onCreated(carton)
  }}>
    <p className="callout">Tạo nhãn thùng chờ nhập, chưa cộng tồn kho. Mỗi thùng demo chứa một mã hàng và một lô.</p>
    <label className="field">Chọn hàng hoặc khai báo hàng mới<select value={selected} onChange={e=>{setSelected(e.target.value);setMeasured(false);setError("")}}><option value="new">+ Mã hàng mới</option>{catalog.map((p,index)=><option value={index} key={`${p.id}-${p.batch}-${p.branch}`}>{p.name} · {p.id}</option>)}</select></label>
    <div className="form-grid"><label className="field">Mã thùng riêng (không phải mã SKU)<input name="code" required pattern="[A-Za-z0-9_-]{3,60}" defaultValue={defaultCode}/></label><label className="field">Cơ sở nhận<select name="branch" defaultValue={accessibleBranches.includes(branch)?branch:accessibleBranches[0]}>{accessibleBranches.map(b=><option key={b}>{b}</option>)}</select></label>
    {!source&&<><label className="field">Mã SKU<input name="sku" required maxLength={80}/></label><label className="field">Tên sản phẩm<input name="name" required maxLength={160}/></label><label className="field">Đơn vị bao bì<input name="variant" required placeholder="Ví dụ: Hộp 50 ml"/></label><label className="field">Nhóm hàng<input name="category" required placeholder="Ví dụ: Son môi"/></label></>}
    <label className="field">Mã lô<input name="batch" required maxLength={80}/></label><label className="field">Hạn dùng<input name="expiry" type="date" required min={today()}/></label><label className="field">Số đơn vị trong thùng<input name="qty" type="number" min="1" max="100000" step="1" required defaultValue="10"/></label></div>
    <label className="check-row"><input type="checkbox" checked={measured} onChange={e=>setMeasured(e.target.checked)}/>Khai báo kích thước bao bì đã đo để kiểm tra chỗ trống / xếp chồng</label>
    {measured&&<div className="form-grid">{[['width','Dài bao bì (cm)'],['depth','Sâu bao bì (cm)'],['height','Cao bao bì (cm)']].map(([name,label])=><label className="field" key={name}>{label}<input type="number" name={name} min="0.5" max="150" step="0.1" required/></label>)}<label className="field">Dạng bao bì<select name="shape">{Object.entries(PACKAGE_SHAPES).map(([id,label])=><option value={id} key={id}>{label}</option>)}</select></label></div>}
    <label className="field">Cách đặt lên kệ<select value={wholeCarton?'carton':'units'} onChange={e=>setWholeCarton(e.target.value==='carton')}><option value="units">Mở thùng, xếp theo từng đơn vị sản phẩm</option><option value="carton">Giữ nguyên thùng trên kệ</option></select></label>
    {wholeCarton&&<><p className="callout">Tính chỗ theo kích thước nguyên thùng. Tồn kho vẫn theo số sản phẩm bên trong; thùng chưa dùng hết vẫn chiếm một chỗ.</p><div className="form-grid">{[['outerWidth','Dài nguyên thùng (cm)'],['outerDepth','Sâu nguyên thùng (cm)'],['outerHeight','Cao nguyên thùng (cm)']].map(([name,label])=><label className="field" key={name}>{label}<input type="number" name={name} min="0.5" max="150" step="0.1" required/></label>)}</div></>}
    {error&&<p className="inline-error" role="alert">{error}</p>}<Button type="submit">Tạo thùng chờ nhập & nhãn QR</Button>
  </form>
}
