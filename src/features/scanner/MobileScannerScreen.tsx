import { Camera, CheckCircle2, ScanLine, XCircle } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useApp } from "../../app/store"
import {
  branches,
  daysLeft,
  locationLabel,
  positionCode,
  transferDisplayId,
  transferLineCode,
  transferLines,
} from "../../app/model"
import { Badge, Button, PageTitle, Panel } from "../../app/ui"
import { productKey } from "../../app/catalog"
export default function Scanner() {
  const {
    data,
    update,
    scanTask,
    setScanTask,
    go,
    setSelected,
    setBranch,
    visibleProducts,
    log,
    notify,
    role,
    branch,
  } = useApp()
  const [step, setStep] = useState(0),
    [input, setInput] = useState(""),
    [result, setResult] = useState(""),
    [good, setGood] = useState(false),
    [lookupKey, setLookupKey] = useState(
      scanTask.productKey || (visibleProducts[0] ? productKey(visibleProducts[0]) : ""),
    ),
    [rackId, setRackId] = useState("A1"),
    [level, setLevel] = useState(1),
    [bin, setBin] = useState(1),
    [received, setReceived] = useState(1),
    [camera, setCamera] = useState(false),
    [done, setDone] = useState(false)
  const video = useRef<HTMLVideoElement>(null),
    stream = useRef<MediaStream | null>(null),
    busy = useRef(false),
    submitRef = useRef<(code: string) => void>(() => {})
  const transfer = data.transfers.find((t) => t.id === scanTask.transferId)
  const transferLineList = transfer ? transferLines(transfer) : []
  const transferLine = transfer
    ? transferLineList.find(
        (line) => line.id === scanTask.transferLineId,
      ) ?? (transferLineList.length === 1 ? transferLineList[0] : undefined)
    : undefined
  const transferLineIndex = transferLine
    ? transferLineList.indexOf(transferLine)
    : -1
  const transferLineCodeValue =
    transfer && transferLine && transferLineIndex >= 0
      ? transferLineCode(transfer, transferLine, transferLineIndex)
      : ""
  const p =
    scanTask.mode === "lookup"
      ? visibleProducts.find((p) => productKey(p) === lookupKey)
      : data.products.find(
          (p) =>
            p.id === transferLine?.productId &&
            p.branch === transfer?.from &&
            p.batch === transferLine?.batch,
        )
  const targetBranch =
    scanTask.mode === "receive" && transfer
      ? transfer.to
      : p?.branch || branches[0]
  const destination = { branch: targetBranch, rack: rackId, level, bin }
  useEffect(() => {
    if (scanTask.mode === "lookup") {
      setLookupKey(scanTask.productKey || (visibleProducts[0] ? productKey(visibleProducts[0]) : ""))
      setStep(0)
      setDone(false)
      setResult("")
    }
  }, [branch, scanTask.productKey])
  const expectedLocation =
    scanTask.mode === "receive"
      ? positionCode(destination)
      : p
        ? positionCode(p)
        : ""
  const expectedBatch = p ? `LOT:${p.batch}` : ""
  const dispatch = scanTask.mode === "dispatch"
  const requiredScans = dispatch ? 1 : 2
  const scanningLocation = !dispatch && step === 0
  const currentCode = scanningLocation ? expectedLocation : expectedBatch
  const stopCamera = () => {
    stream.current?.getTracks().forEach((t) => t.stop())
    stream.current = null
    setCamera(false)
  }
  useEffect(
    () => () => {
      stream.current?.getTracks().forEach((t) => t.stop())
    },
    [],
  )
  useEffect(() => {
    setStep(0)
    setResult("")
    setDone(false)
    setReceived(transferLine?.qty ?? transfer?.qty ?? 1)
  }, [scanTask.transferId, scanTask.transferLineId, scanTask.mode, lookupKey, rackId, level, bin])
  const verify = (code: string, manual = false) => {
    if (!p || done || step >= requiredScans) return
    const expected = currentCode
    // Printed lot IDs omit the QR payload prefix. Accept them when typed,
    // while camera scans must still contain the expected QR payload.
    const matchesTypedLot = manual && !scanningLocation && code.trim() === p.batch
    if (code.trim() !== expected && !matchesTypedLot) {
      setGood(false)
      setResult(
        `Mã chưa khớp. Cần ${
          scanningLocation ? "đúng mã vị trí đang chọn" : `lô ${p.batch}`
        }.`,
      )
      return
    }
    setGood(true)
    setResult(
      scanningLocation
        ? "Đúng vị trí. Tiếp theo, quét mã lô hàng."
        : dispatch
          ? `Đúng lô ${p.batch}. Kiểm đếm hàng trước khi xác nhận gửi.`
          : `Đã xác minh đúng vị trí và lô ${p.batch}.`,
    )
    setStep((s) => Math.min(requiredScans, s + 1))
    setInput("")
  }
  submitRef.current = verify
  const startCamera = async () => {
    try {
      if (!(window as any).BarcodeDetector) {
        setGood(false)
        setResult(
          "Camera trên trình duyệt này chưa hỗ trợ đọc QR. Bạn vẫn có thể nhập mã vào ô bên dưới rồi bấm “Kiểm tra mã”, hoặc mở “Dùng mã mẫu để thử thao tác”.",
        )
        return
      }
      stream.current = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })
      setCamera(true)
    } catch {
      setGood(false)
      setResult("Chưa mở được camera. Bạn có thể nhập mã thủ công.")
    }
  }
  useEffect(() => {
    if (!camera) return
    const v = video.current
    if (v) {
      v.srcObject = stream.current
      void v.play()
    }
    const detector = new (window as any).BarcodeDetector({
      formats: ["qr_code"],
    })
    const timer = setInterval(async () => {
      if (!video.current || busy.current || step >= requiredScans) return
      busy.current = true
      try {
        const codes = await detector.detect(video.current)
        if (codes[0]?.rawValue) submitRef.current(codes[0].rawValue)
      } catch {
      } finally {
        busy.current = false
      }
    }, 800)
    return () => clearInterval(timer)
  }, [camera, step, requiredScans])
  const finalize = () => {
    if (!p || step !== requiredScans || done) return
    if (scanTask.mode === "lookup") {
      setDone(true)
      log("Đã xác minh vị trí & lô", `${p.name} · ${p.branch} · ${locationLabel(p)}`)
      return
    }
    if (
      role === "sales" ||
      !transfer ||
      (role !== "owner" &&
        (scanTask.mode === "dispatch" ? transfer.from : transfer.to) !== branch)
    ) {
      setGood(false)
      setResult("Vai trò hiện tại không có quyền xử lý phiếu tại cơ sở này.")
      return
    }
    if (scanTask.mode === "dispatch") {
      if (
        transfer.status !== "Chuẩn bị" ||
        !transferLine ||
        transferLine.sent ||
        p.qty < transferLine.qty ||
        daysLeft(p.expiry) < 0
      ) {
        setGood(false)
        setResult("Phiếu đã xử lý, lô hết hạn hoặc tồn kho không đủ.")
        return
      }
      update((d) => ({
        ...d,
        products: d.products.map((item) =>
          productKey(item) === productKey(p)
            ? { ...item, qty: item.qty - transferLine.qty }
            : item,
        ),
        transfers: d.transfers.map((t) =>
          t.id !== transfer.id
            ? t
            : (() => {
                const lines = transferLines(t).map((line) =>
                  line.id === transferLine.id ? { ...line, sent: true } : line,
                )
                const allSent = lines.every((line) => line.sent)
                return {
                  ...t,
                  lines,
                  status: allSent ? "Đang chuyển" as const : "Chuẩn bị" as const,
                  reserved: allSent,
                  history: [
                    ...t.history,
                    `Đã quét QR lô ${transferLine.batch}, gửi ${transferLine.qty} sản phẩm`,
                  ],
                }
              })(),
        ),
      }))
      log(
        "Đã gửi hàng",
        `${transferLineCodeValue || transferDisplayId(transfer)} · ${p.name} · ${transferLine.qty} sản phẩm · ${transfer.from} → ${transfer.to}`,
      )
    } else {
      const targetRack = data.racks[targetBranch]?.find((r) => r.id === rackId)
      if (
        transfer.status !== "Đang chuyển" ||
        !transfer.reserved ||
        !transferLine ||
        transferLine.received !== undefined ||
        !targetRack ||
        !Number.isInteger(received) ||
        received < 0 ||
        received > transferLine.qty ||
        level < 1 ||
        level > targetRack.levels ||
        bin < 1 ||
        bin > targetRack.bins
      ) {
        setGood(false)
        setResult("Kiểm tra số thực nhận, vị trí hoặc trạng thái phiếu.")
        return
      }
      const existingDestination = data.products.find(item => item.id === p.id && item.batch === p.batch && item.branch === targetBranch && item.qty > 0)
      if (existingDestination && (existingDestination.rack !== rackId || existingDestination.level !== level || existingDestination.bin !== bin)) {
        setGood(false)
        setResult(`Lô này đã có tại ${locationLabel(existingDestination)}. Chọn cùng vị trí để nhập bổ sung, hoặc thay đổi vị trí lô trong Tồn kho trước.`)
        return
      }
      update((d) => {
        const existing = d.products.find(
          (item) =>
            item.id === p.id &&
            item.batch === p.batch &&
            item.branch === targetBranch,
        )
        return {
          ...d,
          products: existing
            ? d.products.map((item) =>
                productKey(item) === productKey(existing)
                  ? {
                      ...item,
                      qty: item.qty + received,
                      rack: rackId,
                      level,
                      bin,
                    }
                  : item,
              )
            : [
                ...d.products,
                {
                  ...p,
                  branch: targetBranch,
                  qty: received,
                  rack: rackId,
                  level,
                  bin,
                },
              ],
          transfers: d.transfers.map((t) =>
            t.id !== transfer.id
              ? t
              : (() => {
                  const lines = transferLines(t).map((line) =>
                    line.id === transferLine.id
                      ? { ...line, received }
                      : line,
                  )
                  const totalReceived = lines.reduce(
                    (total, line) => total + (line.received ?? 0),
                    0,
                  )
                  const allReceived = lines.every(
                    (line) => line.received !== undefined,
                  )
                  return {
                    ...t,
                    lines,
                    received: totalReceived,
                    status: allReceived
                      ? totalReceived === t.qty
                        ? "Hoàn tất" as const
                        : "Kiểm nhận" as const
                      : "Đang chuyển" as const,
                    history: [
                      ...t.history,
                      `Đã xác minh lô ${transferLine.batch}, thực nhận ${received}/${transferLine.qty} sản phẩm tại ${rackId}`,
                    ],
                  }
                })(),
          ),
        }
      })
      log(
        "Đã kiểm nhận hàng",
        `${transferLineCodeValue || transferDisplayId(transfer)} · ${p.name} · ${received}/${transferLine.qty} sản phẩm · ${transfer.to}`,
      )
    }
    setDone(true)
    stopCamera()
    notify("Đã cập nhật phiếu và tồn kho trong bản demo.")
  }
  return (
    <>
      {["owner","manager","warehouse"].includes(role) && <div className="putaway-shortcut"><div><strong>Nhập thùng hàng mới?</strong><p>Dùng luồng quét vị trí và mã thùng để cộng tồn sau khi lên kệ.</p></div><Button onClick={()=>go("putaway")}>Quét nhập lên kệ</Button></div>}
      <PageTitle
        title="Quét & xác minh"
        description={dispatch ? "Tới vị trí lấy hàng, quét QR lô và kiểm đếm trước khi xác nhận gửi. Không cần quét QR vị trí." : "Quét đúng vị trí, sau đó quét đúng lô hàng. Có thể nhập mã thủ công."}
        action={
          <Button
            variant="secondary"
            onClick={() => {
              setScanTask({ mode: "lookup" })
              stopCamera()
              setStep(0)
              setDone(false)
              setResult("")
            }}
          >
            Tra cứu vị trí
          </Button>
        }
      />
      <div className="scan-frame stack">
        <div className="callout">
          {scanTask.mode === "lookup"
            ? "Chế độ tra cứu · Không thay đổi số lượng tồn kho."
            : `${
                scanTask.mode === "dispatch"
                  ? "Xác minh gửi hàng"
                  : "Kiểm nhận hàng"
              } · ${
                transfer
                  ? `Phiếu ${transferDisplayId(transfer)}${
                      transferLineCodeValue
                        ? ` · Mã dòng ${transferLineCodeValue}`
                        : ""
                    }`
                  : "Không tìm thấy phiếu"
              }`}
        </div>
        {scanTask.mode === "lookup" && (
          <label className="field">
            Mặt hàng cần xác minh
            <select
              value={lookupKey}
              onChange={(e) => setLookupKey(e.target.value)}
            >
              {visibleProducts.map((item) => (
                <option value={productKey(item)} key={productKey(item)}>
                  {item.name} · {item.branch}
                </option>
              ))}
            </select>
          </label>
        )}
        {scanTask.mode === "receive" && !done && (
          <Panel title="Vị trí xếp hàng tại nơi nhận">
            <div className="panel-body stack">
              <p className="tiny">{targetBranch}</p>
              <label className="field">
                Kệ
                <select
                  value={rackId}
                  onChange={(e) => setRackId(e.target.value)}
                >
                  {(data.racks[targetBranch] || []).map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </label>
              <div className="form-grid">
                <label className="field">
                  Tầng
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={level}
                    onChange={(e) => setLevel(Number(e.target.value))}
                  />
                </label>
                <label className="field">
                  Ô
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={bin}
                    onChange={(e) => setBin(Number(e.target.value))}
                  />
                </label>
              </div>
            </div>
          </Panel>
        )}
        <Panel>
          <div className="panel-body">
            <div className="row between" style={{ marginBottom: 16 }}>
              <Badge tone="info">
                {step >= requiredScans ? `Đã xác minh ${requiredScans}/${requiredScans}` : `Bước ${step + 1}/${requiredScans}`}
              </Badge>
              <span className="tiny muted">{p?.name || "Chọn mặt hàng"}</span>
            </div>
            <div className="scan-preview">
              {camera ? (
                <video
                  ref={video}
                  muted
                  playsInline
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: 16,
                  }}
                />
              ) : (
                <>
                  <ScanLine size={45} strokeWidth={1.2} />
                  <strong>
                    {step >= requiredScans
                      ? dispatch ? "Đúng lô hàng" : "Đúng vị trí · Đúng lô"
                      : scanningLocation ? "Quét mã vị trí" : "Quét mã lô hàng"}
                  </strong>
                  <p>
                    {scanningLocation
                      ? "Xác định nơi lấy hoặc cất hàng"
                      : "Kiểm tra đúng hàng trước khi xác nhận"}
                  </p>
                </>
              )}
            </div>
            <div className="row" style={{ marginBottom: 18 }}>
              <Button
                variant="secondary"
                className="full"
                onClick={() => (camera ? stopCamera() : void startCamera())}
              >
                <Camera size={16} />
                {camera ? "Tắt camera" : "Mở camera"}
              </Button>
            </div>
            {step < requiredScans && (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  verify(input, true)
                }}
              >
                <label className="field">
                  Hoặc nhập mã thủ công
                  <input
                    required
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={scanningLocation ? "LOC:…" : p?.batch || "Nhập mã lô trên nhãn"}
                    autoComplete="off"
                  />
                  {!scanningLocation && <small>Nhập mã lô trên nhãn, ví dụ: {p?.batch}. Không cần thêm “LOT:”.</small>}
                </label>
                <Button type="submit" disabled={!p}>
                  Kiểm tra mã
                </Button>
              </form>
            )}
            {result && (
              <div
                role="status"
                className={`scanner-result ${good ? "" : "error"}`}
              >
                <div className="row">
                  {good ? (
                    <CheckCircle2 size={19} color="#25845e" />
                  ) : (
                    <XCircle size={19} color="#b44b51" />
                  )}
                  <p className="tiny">{result}</p>
                </div>
              </div>
            )}
            {step >= requiredScans && !done && (
              <div className="stack" style={{ marginTop: 18 }}>
                {dispatch && <p className="tiny">Kiểm tra đúng sản phẩm, lô, hạn dùng và đủ {transferLine?.qty} sản phẩm. Chỉ xác nhận sau khi đã kiểm đếm thực tế.</p>}
                {scanTask.mode === "receive" && (
                  <label className="field">
                    Số lượng thực nhận
                    <input
                      type="number"
                      min={0}
                      max={transferLine?.qty}
                      value={received}
                      onChange={(e) => setReceived(Number(e.target.value))}
                    />
                    <small>
                      Dòng hàng gửi {transferLine?.qty}. Số thiếu sẽ được đưa vào đối
                      soát.
                    </small>
                  </label>
                )}
                <Button onClick={finalize}>
                  {scanTask.mode === "lookup"
                    ? "Hoàn tất xác minh"
                    : scanTask.mode === "dispatch"
                      ? "Xác nhận gửi hàng"
                      : "Xác nhận số thực nhận"}
                </Button>
              </div>
            )}
            {done && (
              <div className="stack" style={{ marginTop: 18 }}>
                <div className="callout success">
                  {scanTask.mode === "lookup"
                    ? "Vị trí và lô hàng đã được xác minh."
                    : "Phiếu và tồn kho đã được cập nhật trong kho mẫu."}
                </div>
                <Button
                  onClick={() => {
                    if (scanTask.mode === "lookup" && p) {
                      setSelected(p.id)
                      setBranch(p.branch)
                      go("warehouse")
                    } else go("mobile")
                  }}
                >
                  {scanTask.mode === "lookup"
                    ? "Xem vị trí"
                    : "Về phiếu chuyển kho"}
                </Button>
              </div>
            )}
          </div>
        </Panel>
        {!done && p && (
          <details>
            <summary>Dùng mã mẫu để thử thao tác</summary>
            <div className="stack">
              <p className="tiny muted">
                Mã minh họa để kiểm tra luồng khi chưa có nhãn QR thực tế.
              </p>
              <div className="callout">
                {!dispatch && <>Vị trí: {expectedLocation}<br /></>}
                Mã lô: {p.batch}
              </div>
              <Button
                variant="secondary"
                disabled={step >= requiredScans}
                onClick={() =>
                  verify(scanningLocation ? expectedLocation : p.batch, true)
                }
              >
                Dùng mã mẫu {scanningLocation ? "vị trí" : "lô hàng"}
              </Button>
            </div>
          </details>
        )}
      </div>
    </>
  )
}
