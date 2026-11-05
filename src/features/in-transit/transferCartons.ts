import { branches, daysLeft, transferLines, type DemoData, type Transfer, type TransferLine } from "../../app/model"
import { parseLocation } from "../putaway/putaway"

type Action =
  | { kind: "pack"; lineId: string; code: string; quantity: number; reuse: boolean }
  | { kind: "remove"; code: string }
  | { kind: "place"; code: string; location: string }
  | { kind: "receive"; code: string; quantity: number }
  | { kind: "ship" }
  | { kind: "close"; reason: string }

const matches = (line: TransferLine, item: { id: string; batch: string; branch: string }, branch: string) =>
  item.id === line.productId && item.batch === line.batch && item.branch === branch

export function reusableCartons(data: DemoData, transfer: Transfer, line: TransferLine) {
  const source = data.products.find(item => matches(line, item, transfer.from))
  if (!source) return []
  const options = new Map<string, number>()
  for (const carton of data.inboundCartons ?? []) {
    const spot = carton.placement
    if (carton.status === "stored" && carton.product.storage3d?.unitsPerContainer &&
        matches(line, carton.product, transfer.from) && spot?.rack === source.rack &&
        spot.level === source.level && spot.bin === source.bin) options.set(carton.code, carton.product.qty)
  }
  // Transfers are newest first. Only the most recent completed journey owns the label.
  const seen = new Set<string>()
  for (const previous of data.transfers) {
    for (const carton of previous.cartons ?? []) {
      if (seen.has(carton.code)) continue
      seen.add(carton.code)
      options.delete(carton.code)
      const packedLine = transferLines(previous).find(item => item.id === carton.lineId)
      if (previous.status === "Hoàn tất" && previous.to === transfer.from &&
          packedLine?.productId === line.productId && packedLine.batch === line.batch &&
          carton.received === carton.quantity && carton.placement?.rack === source.rack &&
          carton.placement.level === source.level && carton.placement.bin === source.bin) {
        options.set(carton.code, carton.quantity)
      }
    }
  }
  return [...options].filter(([, quantity]) => quantity <= source.qty)
}

export function applyCartonTransfer(data: DemoData, id: string, action: Action) {
  const transfer = data.transfers.find(item => item.id === id)
  const fail = (error: string) => ({ data, error })
  if (!transfer?.cartons) return fail("Phiếu này dùng luồng kiểm nhận theo lô.")
  const cartons = transfer.cartons
  const lines = transferLines(transfer)
  const save = (patch: Partial<Transfer>, entry: string, products = data.products) => ({
    error: "",
    data: {
      ...data,
      products,
      transfers: data.transfers.map(item => item.id === id
        ? { ...item, ...patch, history: [...item.history, entry] }
        : item),
    },
  })
  if (action.kind === "pack") {
    const line = lines.find(item => item.id === action.lineId)
    if (transfer.status !== "Chuẩn bị" || !line) return fail("Phiếu đã gửi hoặc dòng hàng không hợp lệ.")
    const { code, quantity } = action
    const packed = cartons.filter(item => item.lineId === line.id).reduce((sum, item) => sum + item.quantity, 0)
    if (!Number.isSafeInteger(quantity) || quantity < 1 || packed + quantity > line.qty) {
      return fail("Số lượng trong thùng phải từ 1 đến số còn cần đóng của dòng hàng.")
    }
    const reusable = reusableCartons(data, transfer, line).some(([label, qty]) => label === code && qty === quantity)
    const registered = data.inboundCartons?.some(item => item.code === code) ||
      data.transfers.some(item => item.cartons?.some(carton => carton.code === code))
    if (!/^CTN:[A-Za-z0-9_-]+$/.test(code) || (action.reuse ? !reusable : registered)) {
      return fail("Mã thùng đã được dùng hoặc không thuộc lô tại kho xuất.")
    }
    return save({ cartons: [...cartons, { code, lineId: line.id, quantity }] }, `Đã đóng ${code} · ${quantity} sản phẩm`)
  }
  if (action.kind === "ship") {
    if (transfer.status !== "Chuẩn bị" || transfer.reserved || !cartons.length || lines.some(line =>
      line.sent || cartons.filter(item => item.lineId === line.id).reduce((sum, item) => sum + item.quantity, 0) !== line.qty)) {
      return fail("Đóng đủ số lượng trên từng dòng trước khi xác nhận gửi.")
    }
    if (lines.some(line => !data.products.some(item =>
      matches(line, item, transfer.from) && item.qty >= line.qty && daysLeft(item.expiry) >= 0))) {
      return fail("Kho xuất không đủ tồn khả dụng hoặc lô đã hết hạn.")
    }
    const products = data.products.map(item => {
      const line = lines.find(line => matches(line, item, transfer.from))
      return line ? { ...item, qty: item.qty - line.qty } : item
    })
    return save({ status: "Đang chuyển", reserved: true, lines: lines.map(line => ({ ...line, sent: true })) },
      `Đã gửi ${cartons.length} thùng · ${transfer.qty} sản phẩm`, products)
  }
  if (action.kind === "close") {
    const received = cartons.reduce((sum, carton) => sum + (carton.received ?? 0), 0)
    const reason = action.reason.trim()
    if (!received && !reason) return fail("Cần có hàng đã nhận hoặc lý do đối soát.")
    if (!["Đang chuyển", "Kiểm nhận"].includes(transfer.status) ||
        cartons.some(carton => (carton.received ?? 0) > 0 && !carton.placement)) {
      return fail("Cất hết hàng đã nhận trước khi đóng phiếu.")
    }
    if (received !== transfer.qty && !reason) return fail("Nhập lý do xử lý số hàng thiếu trước khi đóng phiếu.")
    return save({ status: "Hoàn tất", received }, reason
      ? `Đã đối soát ${received}/${transfer.qty} sản phẩm · ${reason}`
      : "Đã nhận đủ và cất hàng lên kệ")
  }
  const carton = cartons.find(item => item.code === action.code)
  if (!carton) return fail("Mã thùng không có trên phiếu này.")
  if (action.kind === "remove") {
    if (transfer.status !== "Chuẩn bị") return fail("Phiếu đã gửi.")
    return save({ cartons: cartons.filter(item => item !== carton) }, `Đã bỏ thùng ${carton.code} khỏi phiếu`)
  }
  if (!["Đang chuyển", "Kiểm nhận"].includes(transfer.status)) return fail("Phiếu chưa gửi hoặc đã hoàn tất.")
  if (action.kind === "receive") {
    if (carton.received !== undefined) return fail("Thùng này đã được kiểm nhận.")
    if (!Number.isSafeInteger(action.quantity) || action.quantity < 1 || action.quantity > carton.quantity) {
      return fail(`Nhập từ 1 đến ${carton.quantity} sản phẩm. Thùng chưa tới giữ ở trạng thái chờ nhận.`)
    }
    const next = cartons.map(item => item === carton ? { ...item, received: action.quantity } : item)
    return save({
      cartons: next,
      received: next.reduce((sum, item) => sum + (item.received ?? 0), 0),
      status: "Kiểm nhận",
      lines: lines.map(line => ({
        ...line,
        received: next.filter(item => item.lineId === line.id).reduce((sum, item) => sum + (item.received ?? 0), 0),
      })),
    }, `Đã nhận ${carton.code} · ${action.quantity}/${carton.quantity} sản phẩm vào khu chờ cất`)
  }
  if (!carton.received || carton.placement) return fail("Thùng chưa được nhận hoặc đã cất lên kệ.")
  const location = parseLocation(action.location, data, branches)
  if (!location || location.branch !== transfer.to) return fail("Quét mã ô kệ hợp lệ tại kho đích.")
  const { rack, level, bin } = location
  const line = lines.find(line => line.id === carton.lineId)
  const source = line && data.products.find(item => matches(line, item, transfer.from))
  if (!line || !source) return fail("Không tìm thấy thông tin lô của thùng.")
  const existing = data.products.find(item => matches(line, item, transfer.to))
  if (existing && existing.expiry !== source.expiry) {
    return fail("Hạn dùng của lô tại kho đích khác kho xuất. Kiểm tra thông tin lô trước khi cất.")
  }
  if (existing && existing.qty > 0 && (existing.rack !== rack || existing.level !== level || existing.bin !== bin)) {
    return fail(`Lô này đang ở kệ ${existing.rack}, tầng ${existing.level}, ô ${existing.bin}. Chọn cùng ô để gộp tồn.`)
  }
  const stored = { ...(existing ?? source), branch: transfer.to, qty: (existing?.qty ?? 0) + carton.received, rack, level, bin }
  const products = existing ? data.products.map(item => item === existing ? stored : item) : [...data.products, stored]
  return save({ cartons: cartons.map(item => item === carton ? { ...item, placement: { rack, level, bin } } : item) },
    `Đã cất ${carton.code} tại ${rack} · tầng ${level} · ô ${bin}`, products)
}
