import { useEffect, useState } from "react"
import QRCode from "qrcode"
export function QrPreview({code,label}: {code:string;label:string}) {
  const [src,setSrc]=useState("")
  useEffect(()=>{let active=true;setSrc("");QRCode.toDataURL(code,{width:180,margin:2}).then(value=>{if(active)setSrc(value)}).catch(()=>{});return()=>{active=false}},[code])
  return <figure className="putaway-qr">{src&&<img src={src} width="150" height="150" alt={label}/>}<figcaption>{label}<code>{code}</code></figcaption>{src&&<a className="button secondary" href={src} download={`${code.replace(/[^a-zA-Z0-9_-]/g,'-')}.png`}>Tải nhãn QR</a>}</figure>
}
