import { useEffect, useState } from "react"
import type { Product, Rack } from "../../app/model"
import { useApp } from "../../app/store"
import { productKey } from "../../app/catalog"
import { Button } from "../../app/ui"
import { fitsCompartment, packageFor, PACKAGE_SHAPES, validPackage } from "./productSizing"
import { slotLayout } from "./slotLayout"

export function ProductSizingPanel({ product, rack, readOnly=false, onEditLot }: {product: Product; rack: Rack;readOnly?:boolean;onEditLot?:()=>void}) {
  const { data, accessMode, role, update, notify } = useApp()
  const profile = packageFor(product)
  const [draft,setDraft] = useState(profile.value)
  const [error,setError] = useState("")
  const [measured,setMeasured] = useState(false)
  const changeDraft=(patch:Partial<typeof draft>)=>{setDraft(current=>({...current,...patch}));setMeasured(false);setError("")}
  useEffect(() => { setDraft(packageFor(product).value); setError("") }, [product.id,product.batch,product.branch,product.package3d])
  const canEdit = !readOnly && accessMode === "authenticated" && ["owner","manager","warehouse"].includes(role)
  return <section className="product-sizing" aria-label="Kích thước bao bì sản phẩm">
    <strong>Kích thước một đơn vị bao bì</strong>
    <p className="tiny">{profile.value.widthCm} × {profile.value.depthCm} × {profile.value.heightCm} cm · {PACKAGE_SHAPES[profile.value.shape]}</p>
    <p className="tiny muted">{profile.estimated ? "Kích thước tham khảo — cần đo bao bì thực tế để xác nhận." : "Kích thước đã nhập, áp dụng cho mã hàng và lô tại cơ sở đang chọn."}</p>
    {!fitsCompartment(profile.value,rack) && <p className="callout">Bao bì vượt kích thước ô theo hướng hiện tại. Cần đổi ô, đổi hướng bao bì hoặc chọn kệ lớn hơn.</p>}
    {canEdit && <form onSubmit={event => {
      event.preventDefault()
      if (!validPackage(draft)) return setError("Nhập các kích thước từ 0,5 đến 150 cm.")
      if(!measured)return setError("Xác nhận số đo bao bì thực tế trước khi lưu.")
      const siblings=data.products.filter(p=>p.branch===product.branch&&p.rack===product.rack&&p.level===product.level&&p.bin===product.bin&&p.qty>0).map(p=>productKey(p)===productKey(product)?{...p,package3d:{...draft}}:p)
      if(!slotLayout(rack,siblings).fits)return setError("Số đo này không đủ chỗ cho hàng đang có trong ô, hoặc ảnh hưởng cách xếp chồng. Chọn ô lớn hơn hoặc điều chỉnh bố trí trước.")
      update(data => ({...data,products:data.products.map(p => productKey(p) === productKey(product) ? {...p,package3d:{...draft}} : p)}))
      setError(""); notify("Đã lưu kích thước bao bì trên trình duyệt này.")
    }}><div className="stack">
      <p className="tiny">1. Chọn dáng bao bì → 2. Điều chỉnh số đo → 3. Xác nhận và lưu</p>
      <div className="row wrap" aria-label="Mẫu bao bì gợi ý">{[{name:"Chai nhỏ",shape:"bottle" as const,widthCm:4,depthCm:4,heightCm:11},{name:"Hũ kem",shape:"jar" as const,widthCm:6,depthCm:6,heightCm:5},{name:"Hộp vừa",shape:"box" as const,widthCm:18,depthCm:10,heightCm:12}].map(({name,...preset})=><Button key={name} variant="secondary" onClick={()=>changeDraft(preset)}>{name}</Button>)}</div>
      <small className="muted">Mẫu chỉ là gợi ý. Đo bao bì thực tế; không thay đổi số lượng tồn của lô.</small>
      <label className="field">Dạng bao bì<select value={draft.shape} onChange={e => changeDraft({shape:e.currentTarget.value as typeof draft.shape})}>{Object.entries(PACKAGE_SHAPES).map(([id,label]) => <option key={id} value={id}>{label}</option>)}</select></label>
      {([['widthCm','Dài bao bì (cm)'],['depthCm','Rộng bao bì (cm)'],['heightCm','Cao bao bì (cm)']] as const).map(([key,label]) => <label className="field" key={key}>{label}<input type="number" min="0.5" max="150" step="0.1" required value={draft[key]} onChange={e => changeDraft({[key]:Number(e.currentTarget.value)})}/><input aria-label={`Kéo chỉnh ${label}`} type="range" min="0.5" max="150" step="0.5" value={draft[key]} onChange={e=>changeDraft({[key]:Number(e.currentTarget.value)})} style={{padding:0,border:0,accentColor:"var(--industry-primary)"}}/></label>)}
      <label className="check-row"><input type="checkbox" checked={measured} onChange={event=>setMeasured(event.currentTarget.checked)}/>Đã đối chiếu với số đo bao bì thực tế</label>
      {error && <p role="alert">{error}</p>}<Button type="submit">Lưu kích thước bao bì</Button>
    </div></form>}
    {!canEdit && !readOnly && <p className="tiny muted">Vai trò hiện tại chỉ xem thông số bao bì.</p>}
    {readOnly && accessMode==="authenticated" && ["owner","manager","warehouse"].includes(role) && onEditLot && <Button onClick={onEditLot}>Chỉnh bao bì của lô này</Button>}
    {readOnly && <p className="tiny muted">Chỉnh bao bì áp dụng cho toàn bộ lô tại vị trí này, không đổi số lượng tồn. Khách chưa đăng nhập chỉ được xem.</p>}
  </section>
}
