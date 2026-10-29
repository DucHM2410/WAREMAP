import type { Rack } from "../../app/model"
import { Button } from "../../app/ui"
export function RackInspector({rack,onPatch}: {rack: Rack; onPatch: (patch: Partial<Rack>) => void}) {
  const sizes = rack.kind === "Kệ pallet" ? [
    {label:"Kho gọn",width:2.4,depth:1,height:2.4},{label:"Kho vừa",width:3,depth:1.2,height:3},{label:"Kho cao",width:3,depth:1.4,height:3.6},
  ] : rack.kind === "Khu kiểm đếm" ? [
    {label:"Bàn gọn",width:1.2,depth:.6,height:.9},{label:"Bàn vừa",width:1.6,depth:.8,height:.9},{label:"Bàn rộng",width:2,depth:1.2,height:.9},
  ] : rack.kind === "Khay chia ngăn" ? [
    {label:"Khay gọn",width:.6,depth:.3,height:.2},{label:"Khay vừa",width:.8,depth:.3,height:.2},{label:"Khay rộng",width:1,depth:.4,height:.25},
  ] : [
    {label:"Gọn",width:.9,depth:.4,height:1.5},{label:"Phổ biến",width:1.2,depth:.4,height:1.8},{label:"Rộng",width:1.8,depth:.6,height:2},
  ]
  return <div className="rack-simple-inspector">
    <label className="field">Đặt tên dễ nhớ<input value={rack.name} onChange={e => onPatch({name:e.target.value})} placeholder="Ví dụ: Kệ son gần cửa"/></label>
    <div className="rack-dimension-summary"><strong>{Math.round(rack.width*100)} × {Math.round(rack.depth*100)} × {Math.round(rack.height*100)} cm</strong><small>Dài × sâu × cao · {rack.kind}</small></div>
    <fieldset><legend>Chọn kích thước gần với kệ của bạn</legend><div className="rack-size-options">{sizes.map(size => <button key={size.label} className={`rack-size-choice ${Math.abs(rack.width-size.width)<.01 && Math.abs(rack.depth-size.depth)<.01 && Math.abs(rack.height-size.height)<.01 ? "selected" : ""}`} onClick={() => {const {label:_,...dimensions}=size;onPatch(dimensions)}}><strong>{size.label}</strong><small>{Math.round(size.width*100)} × {Math.round(size.depth*100)} × {Math.round(size.height*100)} cm</small></button>)}</div></fieldset>
    {([['levels','Số tầng','tầng'],['bins','Ô lưu trữ mỗi tầng','ô']] as const).map(([key,label,unit]) => <div className="rack-stepper" key={key}><div><strong>{label}</strong><small>{key === "levels" ? "Thêm hoặc bớt mặt tầng" : "Ô định vị; dùng khay để tách hàng nhỏ"}</small></div><div><Button variant="secondary" aria-label={`Giảm ${label.toLowerCase()}`} disabled={rack[key]<=1} onClick={() => onPatch({[key]:rack[key]-1})}>−</Button><output aria-label={label}>{rack[key]} {unit}</output><Button variant="secondary" aria-label={`Tăng ${label.toLowerCase()}`} disabled={rack[key]>=10} onClick={() => onPatch({[key]:rack[key]+1})}>+</Button></div></div>)}
    <div className="rack-slot-preview" aria-label={`Minh họa ${rack.levels} tầng, mỗi tầng ${rack.bins} ô`}>{Array.from({length:rack.levels},(_,i)=><div key={i}>{Array.from({length:rack.bins},(_,j)=><span key={j}/>)}</div>)}</div>
    <Button variant="secondary" onClick={() => onPatch({rotation:(rack.rotation+90)%360})}>↻ Xoay kệ 90°</Button>
    <details><summary>Đo chính xác / tùy chỉnh nâng cao</summary><p className="tiny muted">Chỉ cần mở khi mẫu có sẵn chưa đúng. Nhập theo cm.</p><div className="stack">{([['width','Dài kệ (cm)'],['depth','Sâu kệ (cm)'],['height','Cao kệ (cm)']] as const).map(([key,label]) => <label className="field" key={key}>{label}<input type="number" min="20" max="600" step="5" value={Math.round(rack[key]*100)} onChange={e => {const n=Number(e.target.value);if(Number.isFinite(n)&&n>=20&&n<=600)onPatch({[key]:n/100})}}/></label>)}{(['x','z'] as const).map(key => <label className="field" key={key}>{key==='x'?'Vị trí ngang (m)':'Vị trí dọc (m)'}<input type="number" min="-8" max="8" step="0.1" value={rack[key]} onChange={e=>onPatch({[key]:Number(e.target.value)})}/></label>)}</div></details>
    <p className="tiny muted">Sơ đồ mô phỏng bố trí, không xác nhận tải trọng chịu lực của kệ.</p>
  </div>
}
