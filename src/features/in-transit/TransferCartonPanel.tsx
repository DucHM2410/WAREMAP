import { useState, type FormEvent } from "react"
import { branches, positionCode, transferLines, type Transfer, type TransferCarton } from "../../app/model"
import { useApp } from "../../app/store"
import { Button, Modal } from "../../app/ui"
import { ScanInput } from "../putaway/ScanInput"
import { QrPreview } from "../putaway/QrPreview"
import { applyCartonTransfer, reusableCartons } from "./transferCartons"
import "../putaway/putaway.css"

type Dialog = "receive" | "place" | "labels" | null

export function TransferCartonPanel({ transfer, blocked }: { transfer: Transfer; blocked: boolean }) {
  const { data, update, role, branch } = useApp()
  const cartons = transfer.cartons ?? []
  const lines = transferLines(transfer)
  const [lineId, setLineId] = useState(lines[0]?.id)
  const [reusedCode, setReusedCode] = useState("")
  const [dialog, setDialog] = useState<Dialog>(null)
  const [scan, setScan] = useState("")
  const [location, setLocation] = useState("")
  const [checkedCode, setCheckedCode] = useState("")
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const line = lines.find(item => item.id === lineId)
  const reusable = line ? reusableCartons(data, transfer, line) : []
  const reused = reusable.find(([code]) => code === reusedCode)
  const remaining = (line?.qty ?? 0) - cartons.filter(item => item.lineId === lineId).reduce((sum, item) => sum + item.quantity, 0)
  const packed = cartons.reduce((sum, item) => sum + item.quantity, 0)
  const received = cartons.filter(item => item.received !== undefined)
  const staged = received.filter(item => !item.placement).reduce((sum, item) => sum + (item.received ?? 0), 0)
  const stored = (transfer.received ?? 0) - staged
  const preparing = transfer.status === "Chuẩn bị"
  const active = transfer.status === "Đang chuyển" || transfer.status === "Kiểm nhận"
  const canWork = ["owner", "manager", "warehouse"].includes(role) && !blocked
  const canPack = canWork && preparing && (role === "owner" || branch === transfer.from)
  const canReceive = canWork && active && (role === "owner" || branch === transfer.to)
  const canClose = canReceive && ["owner", "manager"].includes(role) && staged === 0
  const checked = cartons.find(item => item.code === checkedCode)
  const sampleRack = data.racks[transfer.to]?.[0]
  const sampleLocation = sampleRack ? positionCode({ branch: transfer.to, rack: sampleRack.id, level: 1, bin: 1 }) : ""
  const existing = checked && lines.find(item => item.id === checked.lineId)
  const existingSlot = existing && data.products.find(item =>
    item.branch === transfer.to && item.id === existing.productId && item.batch === existing.batch && item.qty > 0)

  const run = (action: Parameters<typeof applyCartonTransfer>[2], success: string) => {
    const result = applyCartonTransfer(data, transfer.id, action)
    setError(result.error)
    if (result.error) return false
    update(current => applyCartonTransfer(current, transfer.id, action).data)
    setMessage(success)
    return true
  }

  const open = (next: Dialog) => {
    setDialog(next)
    setCheckedCode("")
    setScan("")
    setLocation("")
    setError("")
  }

  const pack = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const quantity = reused?.[1] ?? Number(new FormData(event.currentTarget).get("quantity"))
    if (run({
      kind: "pack",
      lineId: lineId ?? "",
      code: reused?.[0] ?? `CTN:${crypto.randomUUID().slice(0, 12).toUpperCase()}`,
      quantity,
      reuse: !!reused,
    }, "Đã gắn nhãn thùng vào phiếu.")) setReusedCode("")
  }

  const eligible = (item: TransferCarton) => dialog === "receive"
    ? item.received === undefined
    : !!item.received && !item.placement

  return <section className="trf-detail__items stack">
    <strong>Thùng hàng trên phiếu ({cartons.length})</strong>
    {preparing
      ? <p>Đã đóng {packed}/{transfer.qty} sản phẩm. Gắn nhãn từng thùng trước khi gửi.</p>
      : <p>Đã nhận {received.length}/{cartons.length} thùng · {transfer.received ?? 0}/{transfer.qty} sản phẩm.<br />
        Chờ cất {staged} · Đã cất {stored} sản phẩm.
        {active && <><br />Còn trên đường hoặc chờ đối soát {transfer.qty - (transfer.received ?? 0)} sản phẩm.</>}</p>}
    {cartons.map(carton => {
      const packedLine = lines.find(item => item.id === carton.lineId)
      return <div className="trf-detail__item" key={carton.code}>
        <div>
          <strong>{carton.code}</strong>
          <small>Lô {packedLine?.batch} · {carton.quantity} sản phẩm</small>
          {!preparing && <small>{carton.placement
            ? `Đã cất ${carton.received} · ${carton.placement.rack}/${carton.placement.level}/${carton.placement.bin}`
            : carton.received !== undefined ? `Chờ cất · thực nhận ${carton.received}`
              : active ? "Chưa nhận" : "Thiếu khi đối soát"}</small>}
        </div>
        {canPack && <Button variant="ghost" onClick={() => run({ kind: "remove", code: carton.code }, "Đã bỏ thùng khỏi phiếu.")}>Bỏ</Button>}
      </div>
    })}
    {!!cartons.length && <Button variant="secondary" onClick={() => open("labels")}>Xem / tải nhãn QR thùng</Button>}
    {canPack && <>
      <form className="stack" onSubmit={pack}>
        <label className="field">Dòng hàng đóng thùng
          <select value={lineId} onChange={event => { setLineId(event.target.value); setReusedCode("") }}>
            {lines.map(item => <option key={item.id} value={item.id}>{item.productId} · {item.batch}</option>)}
          </select>
        </label>
        {!!reusable.length && <label className="field">Nhãn thùng
          <select value={reusedCode} onChange={event => setReusedCode(event.target.value)}>
            <option value="">Tạo nhãn mới</option>
            {reusable.map(([code, quantity]) => <option key={code} value={code}>{code} · {quantity} sản phẩm</option>)}
          </select>
        </label>}
        <label className="field">Số lượng trong thùng · còn cần đóng {remaining}
          {reused ? <input type="number" value={reused[1]} readOnly />
            : <input key={lineId} name="quantity" type="number" min={1} max={Math.max(1, remaining)} required />}
        </label>
        <Button type="submit" disabled={remaining <= 0}>Thêm thùng vào phiếu</Button>
      </form>
      <Button disabled={packed !== transfer.qty} onClick={() => run({ kind: "ship" }, "Đã gửi các thùng. Hàng đang vận chuyển.")}>Xác nhận gửi {cartons.length} thùng</Button>
    </>}
    {canReceive && <>
      <Button disabled={received.length === cartons.length} onClick={() => open("receive")}>Quét nhận thùng</Button>
      <Button variant="secondary" disabled={!staged} onClick={() => open("place")}>Cất thùng lên kệ</Button>
    </>}
    {canClose && <form className="stack" onSubmit={event => {
      event.preventDefault()
      const reason = String(new FormData(event.currentTarget).get("reason") ?? "")
      run({ kind: "close", reason }, "Đã hoàn tất phiếu chuyển.")
    }}>
      {stored !== transfer.qty && <label className="field">Lý do chốt số hàng thiếu
        <input name="reason" placeholder="Ghi kết quả đối soát trước khi đóng phiếu" required />
      </label>}
      <Button type="submit">{stored === transfer.qty ? "Hoàn tất phiếu" : "Đối soát và đóng phiếu"}</Button>
    </form>}
    {!dialog && error && <p role="alert" className="inline-error">{error}</p>}
    {message && <p role="status">{message}</p>}
    {dialog === "labels" && <Modal title="Nhãn QR thùng trên phiếu" className="trf-carton-labels" close={() => open(null)}>
      <Button variant="secondary" onClick={() => window.print()}>In nhãn / Lưu PDF</Button>
      {cartons.map(item => <QrPreview key={item.code} code={item.code} label={`${item.quantity} sản phẩm · lô ${lines.find(line => line.id === item.lineId)?.batch ?? ""}`} />)}
    </Modal>}
    {((dialog === "receive" || dialog === "place") && canReceive) && <Modal
      title={dialog === "receive" ? "Quét nhận thùng" : "Cất thùng lên kệ"} close={() => open(null)}>
      {!checked ? <>
        <ScanInput label="Mã QR thùng trên phiếu" value={scan} onChange={setScan} onSubmit={() => {
          const item = cartons.find(item => item.code === scan.trim())
          if (!item || !eligible(item)) return setError("Mã không có trên phiếu hoặc thùng đã qua bước này.")
          setError("")
          setCheckedCode(item.code)
        }} />
        <details className="putaway-helper"><summary>Dùng mã mẫu trên phiếu</summary>
          {cartons.filter(eligible).map(item => <Button key={item.code} variant="secondary" onClick={() => setScan(item.code)}>{item.code}</Button>)}
        </details>
      </> : <>
        <p><strong>{checked.code}</strong> · Lô {existing?.batch} · {checked.received ?? checked.quantity} sản phẩm</p>
        {dialog === "receive" ? <form className="stack" onSubmit={event => {
          event.preventDefault()
          const quantity = Number(new FormData(event.currentTarget).get("quantity"))
          if (run({ kind: "receive", code: checked.code, quantity }, "Đã nhận thùng vào khu chờ cất.")) open(null)
        }}>
          <label className="field">Số sản phẩm thực nhận
            <input name="quantity" type="number" min={1} max={checked.quantity} defaultValue={checked.quantity} required />
          </label>
          <Button type="submit">Xác nhận nhận thùng</Button>
        </form> : <>
          <ScanInput key="location" label="Mã QR ô kệ tại kho đích" value={location} onChange={setLocation} onSubmit={() => {
            if (run({ kind: "place", code: checked.code, location }, "Đã cất thùng vào ô kệ.")) open(null)
          }} />
          {(existingSlot || sampleLocation) && <Button variant="secondary" onClick={() => setLocation(existingSlot ? positionCode(existingSlot) : sampleLocation)}>Điền mã ô kệ {existingSlot ? "của lô" : "mẫu"}</Button>}
        </>}
      </>}
      {error && <p role="alert" className="inline-error">{error}</p>}
    </Modal>}
  </section>
}
