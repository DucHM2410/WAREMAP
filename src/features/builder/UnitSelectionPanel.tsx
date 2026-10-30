import type { ProductUnit } from "./productUnits"
import { Button } from "../../app/ui"

export function UnitSelectionPanel({units,index,wholeLot,onUnit,onLot}:{units:ProductUnit[];index:number;wholeLot:boolean;onUnit:(index:number)=>void;onLot:()=>void}){
  const current=Math.max(0,units.findIndex(u=>u.index===index))
  if(!units.length)return <p className="tiny muted">Lô này chưa có bao bì tồn để chọn trong 3D.</p>
  return <section className="unit-selection" aria-label="Chọn một bao bì hoặc cả lô"><strong>{wholeLot?"Đang chọn cả mã/lô":`Đang chọn một bao bì · #${index+1}`}</strong>
    <div className="row"><Button variant="ghost" disabled={current===0} onClick={()=>onUnit(units[current-1].index)}>← Trước</Button><label className="field">Bao bì minh họa<select value={index} onChange={e=>onUnit(Number(e.target.value))}>{units.map(u=><option value={u.index} key={u.index}>#{u.index+1}</option>)}</select></label><Button variant="ghost" disabled={current>=units.length-1} onClick={()=>onUnit(units[current+1].index)}>Sau →</Button></div>
    <Button variant="secondary" onClick={wholeLot?()=>onUnit(index):onLot}>{wholeLot?"Chọn riêng một bao bì":"Chọn cả lô"}</Button>
    <p>Hình 3D là bao bì đại diện của lô, chưa có serial riêng. Chọn một hình không tách số lượng tồn hay tự di chuyển một đơn vị hàng.</p>
  </section>
}
