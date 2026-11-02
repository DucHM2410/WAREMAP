import { useState } from "react"
import type { Product, Rack } from "../../app/model"
import { useApp } from "../../app/store"
import { Button } from "../../app/ui"
import { WAREHOUSE_PERMISSIONS } from "../../app/warehousePermissions"
import { slotLayout, slotProductKey } from "./slotLayout"
import { storagePackageFor, storageUnits } from "./productSizing"

export function ProductPlacementEditor({ product, rack, products }: {product:Product;rack:Rack;products:Product[]}) {
  const {accessMode,role,update,notify}=useApp()
  const layout=slotLayout(rack,products),entry=layout.entries.find(e=>e.key===slotProductKey(product))
  const [position,setPosition]=useState(product.storage3d?.placement)
  const [layers,setLayers]=useState(product.storage3d?.layers||1)
  const [support,setSupport]=useState(product.storage3d?.placement?.onTopOf||"")
  const [ack,setAck]=useState(false),[error,setError]=useState("")
  if(accessMode!=="authenticated"||!WAREHOUSE_PERMISSIONS[role].putaway)return null
  if(layout.uncertain||!entry)return <p className="tiny muted">Để bố trí trái/phải, trước/sau và xếp lớp, cần nhập số đo bao bì cho tất cả hàng trong ô.</p>
  const setPreset=(column:number,row:number)=>{
    const base=support?layout.entries.find(e=>e.key===support):undefined
    const width=base?.reservedCm??layout.widthCm,depth=base?.depthUsedCm??layout.depthCm
    setPosition({xCm:(base?.xCm||0)+Math.max(0,width-entry.reservedCm)*column/2,zCm:(base?.zCm||0)+Math.max(0,depth-entry.depthUsedCm)*(2-row)/2,...(support?{onTopOf:support}:{})})
    setError("")
  }
  return <details className="product-placement"><summary>Bố trí trong ô · Trái/phải · Trước/sau · Xếp lớp</summary><div className="stack">
    <p className="tiny">Chọn vị trí nhìn từ trên xuống. Lưu để kiểm tra không trùng vùng với hàng khác.</p>
    <div className="placement-presets" role="group" aria-label="Vị trí trong ô">{["Sau","Giữa","Trước"].flatMap((depth,row)=>["Trái","Giữa","Phải"].map((side,column)=><button key={`${row}-${column}`} onClick={()=>setPreset(column,row)}>{side} · {depth}</button>))}</div>
    <label className="field">Bề mặt đặt hàng<select value={support} onChange={e=>{setSupport(e.target.value);setPosition(undefined);setAck(false)}}><option value="">Mặt ô kệ</option>{layout.entries.filter(e=>e.key!==entry.key&&storagePackageFor(e.product).value.shape==="box").map(e=><option key={e.key} value={e.key}>Đặt trên: {e.product.name} · {e.product.batch}</option>)}</select></label>
    <label className="field">Số lớp của lô này<select value={layers} onChange={e=>{setLayers(Number(e.target.value));setAck(false)}}>{[1,2,3,4,5].filter(n=>n<=storageUnits(product)).map(n=><option key={n} value={n}>{n} lớp</option>)}</select></label>
    {(layers>1||support)&&<label className="check-row"><input type="checkbox" checked={ack} onChange={e=>setAck(e.target.checked)}/>Bao bì và bề mặt đỡ cho phép xếp chồng; đã kiểm tra độ ổn định, tải trọng và không che nhãn lô.</label>}
    <div className="row"><Button variant="secondary" onClick={()=>{setSupport("");setPosition(undefined);setLayers(1);setError("")}}>Để hệ thống bố trí</Button><Button onClick={()=>{
      if((layers>1||support)&&!ack)return setError("Cần xác nhận điều kiện xếp chồng trước khi lưu.")
      const supportEntry=layout.entries.find(e=>e.key===support)
      const placement=support?position||{xCm:supportEntry?.xCm||0,zCm:supportEntry?.zCm||0,onTopOf:support}:position
      const apply=(items:Product[])=>items.map(p=>slotProductKey(p)===entry.key?{...p,storage3d:{...p.storage3d,layers,stackable:layers>1||!!support,placement}}:slotProductKey(p)===support&&ack?{...p,storage3d:{...p.storage3d,layers:p.storage3d?.layers||1,stackable:true}}:p)
      const preview=apply(products)
      if(!slotLayout(rack,preview).fits)return setError("Vùng bị trùng, vượt ô hoặc không đủ bề mặt đỡ/chiều cao. Chọn vị trí khác hoặc giảm số lớp.")
      update(data=>{
        const next=apply(data.products),currentRack=data.racks[product.branch]?.find(r=>r.id===product.rack)
        if(!currentRack||!next.some(p=>slotProductKey(p)===entry.key))return data
        const check=slotLayout(currentRack,next.filter(p=>p.branch===product.branch&&p.rack===product.rack&&p.level===product.level&&p.bin===product.bin&&p.qty>0))
        return check.fits&&!check.uncertain?{...data,products:next}:data
      })
      setError("");notify("Đã lưu bố trí trong ô. Góc nhìn 3D và sơ đồ vùng đã cập nhật.")
    }}>Lưu bố trí</Button></div>
    {error&&<p className="inline-error" role="alert">{error}</p>}
  </div></details>
}
