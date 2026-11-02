import { useEffect, useRef, useState } from "react"
import { Camera, ImageUp } from "lucide-react"
import { Button } from "../../app/ui"

export function ScanInput({ label, value, onChange, onSubmit }: {
  label: string
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
}) {
  const [camera, setCamera] = useState(false)
  const [message, setMessage] = useState("")
  const [reading, setReading] = useState(false)
  const fileInput = useRef<HTMLInputElement>(null)
  const stream = useRef<MediaStream | null>(null)
  const video = useRef<HTMLVideoElement>(null)
  const busy = useRef(false)
  const generation = useRef(0)
  const onCode = useRef(onChange)
  onCode.current = onChange
  const stop = () => {
    generation.current++
    stream.current?.getTracks().forEach(t => t.stop())
    stream.current = null
    setCamera(false)
  }
  useEffect(() => () => {
    generation.current++
    stream.current?.getTracks().forEach(t => t.stop())
  }, [])
  useEffect(() => {
    if (!camera || !video.current) return
    video.current.srcObject = stream.current
    void video.current.play().catch(() => {})
    const Detector = (window as any).BarcodeDetector
    const detector = new Detector({ formats: ["qr_code"] })
    let active = true
    const timer = setInterval(async () => {
      if (busy.current || !video.current) return
      busy.current = true
      try {
        const codes = await detector.detect(video.current)
        if (active && codes[0]?.rawValue) {
          onCode.current(codes[0].rawValue)
          setMessage("Đã đọc QR từ camera. Bấm Kiểm tra mã để tiếp tục.")
          stop()
        }
      } catch { /* Keep scanning until a complete QR is visible. */ }
      finally { busy.current = false }
    }, 600)
    return () => { active = false; clearInterval(timer) }
  }, [camera])

  const upload = async (file?: File) => {
    if (!file) return
    stop()
    const ticket = generation.current
    setReading(true)
    setMessage("")
    onCode.current("")
    try {
      const { readQrImage } = await import("./readQrImage")
      const code = await readQrImage(file)
      if (ticket !== generation.current) return
      onCode.current(code)
      setMessage("Đã đọc được mã trong ảnh. Bấm “Kiểm tra mã” để xem thông tin và tiếp tục.")
    } catch (error) {
      if (ticket === generation.current) setMessage(error instanceof Error ? error.message : "Chưa đọc được QR từ ảnh.")
    } finally {
      if (ticket === generation.current) setReading(false)
    }
  }
  return <div className="scan-input">
    <form onSubmit={e => { e.preventDefault(); onSubmit() }}>
      <label className="field">{label}<input value={value} onChange={e => onChange(e.target.value)} placeholder="Quét hoặc nhập mã trên nhãn" autoComplete="off" required disabled={reading}/></label>
      <div className="row">
        <Button type="submit" disabled={reading}>Kiểm tra mã</Button>
        <Button variant="secondary" disabled={reading} onClick={() => fileInput.current?.click()}><ImageUp size={16}/>{reading ? "Đang đọc ảnh…" : "Đọc QR từ ảnh"}</Button>
        <Button variant="ghost" disabled={reading} onClick={async () => {
          if (camera) return stop()
          if (!(window as any).BarcodeDetector || !navigator.mediaDevices?.getUserMedia) return setMessage("Trình duyệt này chưa quét QR bằng camera được. Bạn có thể chọn “Đọc QR từ ảnh” hoặc gõ mã trên nhãn.")
          const ticket = ++generation.current
          try {
            const media = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
            if (ticket !== generation.current) { media.getTracks().forEach(t => t.stop()); return }
            stream.current = media
            setCamera(true)
            setMessage("")
          } catch { if (ticket === generation.current) setMessage("Chưa mở được camera. Dùng Đọc QR từ ảnh hoặc nhập mã trên nhãn.") }
        }}><Camera size={16}/>{camera ? "Tắt camera" : "Dùng camera"}</Button>
      </div>
    </form>
    <input ref={fileInput} type="file" accept="image/png,image/jpeg" aria-label={`Ảnh ${label}`} hidden onChange={e => { const file = e.target.files?.[0]; e.target.value = ""; void upload(file) }}/>
    {camera && <video ref={video} muted playsInline className="putaway-video"/>}
    {message && <p role="status" className="tiny scan-message">{message}</p>}
  </div>
}
