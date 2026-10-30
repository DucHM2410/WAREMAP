import { useEffect, useState } from "react"
import type { Product, Rack } from "../../app/model"
import { useApp } from "../../app/store"
import { productKey } from "../../app/catalog"
import { Button } from "../../app/ui"
import { fitsCompartment, packageFor, PACKAGE_SHAPES, validPackage } from "./productSizing"

export function ProductSizingPanel({ product, rack, readOnly=false }: {product: Product; rack: Rack;readOnly?:boolean}) {
  const { accessMode, role, update, notify } = useApp()
  const profile = packageFor(product)
  const [draft,setDraft] = useState(profile.value)
  const [error,setError] = useState("")
  useEffect(() => { setDraft(packageFor(product).value); setError("") }, [product.id,product.batch,product.branch,product.package3d])
  const canEdit = !readOnly && accessMode === "authenticated" && ["owner","manager","warehouse"].includes(role)
  return <section className="product-sizing" aria-label="Kích thước bao bì sản phẩm">
    <strong>Kích thước một đơn vị bao bì</strong>
    <p className="tiny">{profile.value.widthCm} × {profile.value.depthCm} × {profile.value.heightCm} cm · {PACKAGE_SHAPES[profile.value.shape]}</p>
    <p className="tiny muted">{profile.estimated ? "Kích thước tham khảo — cần đo bao bì thực tế để xác nhận." : "Kích thước đã nhập, áp dụng cho mã hàng và lô tại cơ sở đang chọn."}</p>
    {!fitsCompartment(profile.value,rack) && <p className="callout">Bao bì vượt kích thước ô theo hướng hiện tại. Cần đổi ô, đổi hướng bao bì hoặc chọn kệ lớn hơn.</p>}
    {canEdit && <details><summary>Nhập kích thước thực tế</summary><form onSubmit={event => {
      event.preventDefault()
      if (!validPackage(draft)) return setError("Nhập các kích thước từ 0,5 đến 150 cm.")
      update(data => ({...data,products:data.products.map(p => productKey(p) === productKey(product) ? {...p,package3d:{...draft}} : p)}))
      setError(""); notify("Đã lưu kích thước bao bì trên trình duyệt này.")
    }}><div className="stack">
      {([['widthCm','Dài bao bì (cm)'],['depthCm','Rộng bao bì (cm)'],['heightCm','Cao bao bì (cm)']] as const).map(([key,label]) => <label className="field" key={key}>{label}<input type="number" min="0.5" max="150" step="0.1" required value={draft[key]} onChange={e => setDraft(value => ({...value,[key]:Number(e.target.value)}))}/></label>)}
      <label className="field">Dạng bao bì<select value={draft.shape} onChange={e => setDraft(value => ({...value,shape:e.target.value as typeof value.shape}))}>{Object.entries(PACKAGE_SHAPES).map(([id,label]) => <option key={id} value={id}>{label}</option>)}</select></label>
      {error && <p role="alert">{error}</p>}<Button type="submit">Lưu kích thước bao bì</Button>
    </div></form></details>}
  </section>
}
