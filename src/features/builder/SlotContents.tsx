import type { Product, Rack } from "../../app/model"
import { useState } from "react"
import { slotLayout, slotProductKey } from "./slotLayout"
import "./slot-contents.css"

export function SlotContents({ rack, products, selected, onSelect, onAdd }: {
  rack: Rack; products: Product[]; selected?: Product; onSelect?: (p: Product) => void; onAdd?: () => void
}) {
  const layout = slotLayout(rack, products)
  const [plane,setPlane]=useState(0)
  const planes=[...new Set([0,...layout.entries.map(e=>e.yCm)])].sort((a,b)=>a-b)
  const activePlane=planes.includes(plane)?plane:0
  const colors = ["#74b3b8", "#ae96c8", "#d7a27e", "#89a7d5"]
  return <section className="slot-contents" aria-label="Hàng cùng ô và chỗ trống">
    <div className="slot-contents-heading"><strong>Trong cùng ô · {layout.entries.length} mã/lô</strong>{onAdd && <button onClick={onAdd}>+ Nhập thêm vào ô</button>}</div>
    <p>Mỗi mã/lô có vùng riêng. Có thể nhập thêm hàng khi còn đủ chỗ và giữ được nhãn.</p>
    {!layout.uncertain&&layout.fits&&<><div className="slot-plane-tabs" role="group" aria-label="Mặt bằng theo độ cao">{planes.map(y=><button key={y} aria-pressed={activePlane===y} onClick={()=>setPlane(y)}>{y===0?"Mặt kệ":`Cao ${y.toFixed(1)} cm`}</button>)}</div><div className="slot-top-view" aria-label="Sơ đồ ô nhìn từ trên xuống">{layout.entries.map((entry,i)=>entry.yCm===activePlane&&<button key={entry.key} title={`${entry.product.name} · ${entry.product.batch}`} disabled={!onSelect} onClick={()=>onSelect?.(entry.product)} style={{left:`${entry.xCm/layout.widthCm*100}%`,bottom:`${entry.zCm/layout.depthCm*100}%`,width:`${entry.reservedCm/layout.widthCm*100}%`,height:`${entry.depthUsedCm/layout.depthCm*100}%`,background:colors[i%colors.length]}}>{i+1}</button>)}</div><small>Trái ↔ Phải · Phía trước kệ ở cạnh dưới sơ đồ</small></>}
    <small>{layout.uncertain ? "Chưa đủ số đo: cần kiểm tra chỗ trống thực tế, chưa xác nhận sức chứa." : !layout.fits ? "Vùng bị trùng, vượt ô hoặc thiếu bề mặt đỡ. Cần kiểm tra bố trí." : `Mặt ô còn khoảng ${layout.freeAreaCm2.toFixed(0)} cm² chưa được phân vùng; cần kiểm tra hình dạng khoảng trống trước khi nhập thêm.`}</small>
    <div className="slot-item-list">{layout.entries.map((entry, i) => <button disabled={!onSelect} className={selected && slotProductKey(selected) === entry.key ? "is-selected" : ""} key={entry.key} onClick={() => onSelect?.(entry.product)}><b style={{background:colors[i % colors.length]}}>{i+1}</b><span><strong>{entry.product.name}</strong><small>{entry.product.batch} · {entry.product.qty} đơn vị · HSD {entry.product.expiry}</small><small>{entry.yCm?`Đặt trên lô khác · Cao ${entry.yCm.toFixed(1)} cm`:"Đặt trên mặt kệ"} · {entry.product.storage3d?.layers||1} lớp</small></span></button>)}</div>
    <small>Ước tính theo bao bì, số lượng và lớp xếp; chưa tính tải trọng, lối lấy hàng hoặc hình dạng bất quy tắc.</small>
  </section>
}
