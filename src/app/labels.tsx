import { useEffect, useRef } from "react"
import QRCode from "qrcode"
import { Printer } from "lucide-react"
import { locationLabel, positionCode, type Product } from "./model"
import { Button } from "./ui"
function QR({ value, label }: { value: string; label: string }) {
  const canvas = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    if (canvas.current)
      void QRCode.toCanvas(canvas.current, value, {
        width: 160,
        margin: 3,
        errorCorrectionLevel: "M",
      })
  }, [value])
  return (
    <div className="qr-label">
      <canvas
        aria-label={label}
        ref={canvas}
        style={{ margin: "auto", maxWidth: "100%", height: "auto" }}
      />
      <strong className="tiny">{label}</strong>
      <p style={{ fontSize: 10, marginTop: 5, wordBreak: "break-all" }}>
        {value}
      </p>
    </div>
  )
}
export function QRLabels({ product }: { product: Product }) {
  return (
    <div className="qr-print-area stack">
      <h3>Nhãn vị trí & lô hàng</h3>
      <p className="tiny muted">
        {product.branch} · {locationLabel(product)}
        <br />
        {product.name} · {product.variant}
      </p>
      <div className="grid-two">
        <QR value={positionCode(product)} label="QR vị trí" />
        <QR value={`LOT:${product.batch}`} label="QR lô hàng" />
      </div>
      <Button variant="secondary" onClick={() => window.print()}>
        <Printer size={15} />
        In nhãn / Lưu PDF
      </Button>
    </div>
  )
}
