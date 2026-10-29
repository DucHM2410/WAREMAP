import { useEffect, useRef, useState } from "react"
import { Button } from "../../app/ui"
export function ScanInput({label,value,onChange,onSubmit}: {label:string;value:string;onChange:(value:string)=>void;onSubmit:()=>void}) {
  const [camera,setCamera]=useState(false),[message,setMessage]=useState("")
  const stream=useRef<MediaStream|null>(null),video=useRef<HTMLVideoElement>(null),busy=useRef(false)
  const onCode=useRef(onChange);onCode.current=onChange
  const stop=()=>{stream.current?.getTracks().forEach(t=>t.stop());stream.current=null;setCamera(false)}
  useEffect(()=>()=>stream.current?.getTracks().forEach(t=>t.stop()),[])
  useEffect(()=>{
    if(!camera||!video.current)return
    const media=stream.current;video.current.srcObject=media;void video.current.play().catch(()=>{})
    const Detector=(window as any).BarcodeDetector,detector=new Detector({formats:['qr_code']})
    const timer=setInterval(async()=>{if(busy.current||!video.current)return;busy.current=true;try{const codes=await detector.detect(video.current);if(codes[0]?.rawValue){onCode.current(codes[0].rawValue);setMessage("Đã đọc mã. Bấm kiểm tra để tiếp tục.");stop()}}catch{}finally{busy.current=false}},600)
    return()=>clearInterval(timer)
  },[camera])
  return <div className="scan-input"><form onSubmit={e=>{e.preventDefault();onSubmit()}}><label className="field">{label}<input value={value} onChange={e=>onChange(e.target.value)} placeholder="Quét bằng máy đọc mã hoặc nhập thủ công" autoComplete="off" required/></label><div className="row"><Button type="submit">Kiểm tra mã</Button><Button variant="secondary" onClick={async()=>{if(camera)return stop();if(!(window as any).BarcodeDetector)return setMessage("Camera QR chưa được hỗ trợ trên trình duyệt này. Dùng máy quét hoặc nhập mã thủ công.");try{stream.current=await navigator.mediaDevices.getUserMedia({video:{facingMode:'environment'}});setCamera(true);setMessage("")}catch{setMessage("Chưa mở được camera. Bạn vẫn có thể nhập mã thủ công.")}}}>{camera?"Tắt camera":"Quét QR bằng camera"}</Button></div></form>{camera&&<video ref={video} muted playsInline className="putaway-video"/>}{message&&<p role="status" className="tiny">{message}</p>}</div>
}
