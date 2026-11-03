import { useState } from "react"
import { FileQuestion, Printer } from "lucide-react"
import { useApp } from "../../app/store"
import { branches, dateLabel, locationLabel, today } from "../../app/model"
import { Button, Modal, Panel } from "../../app/ui"
import { prepareDemoKit } from "./qrDemoKit"
import { parseLocation } from "./putaway"
import { QrPreview } from "./QrPreview"

export function DemoKit({ onPrepared, onFillLocation, onFillCarton }: {
  onPrepared: () => void
  onFillLocation: (code: string) => void
  onFillCarton: (code: string) => void
}) {
  const { data, update, role, branch, accessibleBranches, notify } = useApp()
  const targetBranch = accessibleBranches.includes(branch) ? branch : accessibleBranches[0]
  const [selectedCode, setSelectedCode] = useState("")
  const [error, setError] = useState("")
  const [print, setPrint] = useState(false)
  const [help, setHelp] = useState(false)
  const cartons = (data.inboundCartons || []).filter(c => c.qrDemo?.industry === data.industry && c.product.branch === targetBranch)
  const carton = cartons.find(c => c.code === selectedCode) || cartons.find(c => c.status === "pending") || cartons[0]
  const location = carton?.qrDemo && parseLocation(carton.qrDemo.locationCode, data, branches)
  const prepare = () => {
    const token = crypto.randomUUID().toUpperCase()
    const result = prepareDemoKit(data, role, accessibleBranches, targetBranch, today(), token)
    if (!result.carton) return setError(result.error)
    update(current => prepareDemoKit(current, role, accessibleBranches, targetBranch, today(), token).data)
    setSelectedCode(result.carton.code)
    setError("")
    onPrepared()
    notify(result.data === data ? "Đang dùng lại bộ QR chờ nhập, chưa tạo thùng mới." : "Đã chuẩn bị 20 sản phẩm chờ nhập. Tồn kho chưa tăng.")
  }
  const labels = carton && location ? <div className="demo-qr-labels">
    <section><h3>1 · Nhãn vị trí</h3><QrPreview code={carton.qrDemo!.locationCode} label={`${location.branch} · ${locationLabel(location)}`}/></section>
    <section><h3>2 · Nhãn thùng hàng</h3><QrPreview code={carton.code} label={`${carton.product.name} · ${carton.product.qty} đơn vị`}/><p className="tiny">Lô: {carton.product.batch}<br/>Hạn dùng: {dateLabel(carton.product.expiry)}</p></section>
  </div> : null
  return <div className="qr-demo-kit"><Panel title="Bộ QR để trình bày demo">
    <div className="putaway-confirmed"><p className="muted tiny">Thử nhập 20 sản phẩm mẫu: lấy hai nhãn bên dưới, đọc nhãn vị trí trước, rồi đọc nhãn thùng. Tạo nhãn chưa làm tăng số lượng hàng trong kho.</p><Button variant="ghost" onClick={() => setHelp(true)}><FileQuestion size={16}/>Hướng dẫn demo</Button></div>
    {!carton ? <Button onClick={prepare}>Chuẩn bị bộ QR demo</Button> : <>
      <div className="demo-kit-summary"><strong>{carton.product.name}</strong><span>{carton.product.qty} đơn vị · {targetBranch}</span><span className={`badge ${carton.status === "stored" ? "success" : "neutral"}`}>{carton.status === "stored" ? "Đã nhập lên kệ" : "Đang chờ nhập · tồn chưa tăng"}</span><small>Kích thước sản phẩm là số liệu mẫu để thử tính chỗ trống trên kệ.</small></div>
      {location ? <details className="demo-kit-details" open key={carton.code}><summary>Hai nhãn QR của lượt demo</summary>{labels}<div className="row"><Button variant="secondary" onClick={() => setPrint(true)}><Printer size={16}/>In bộ nhãn / Lưu PDF</Button></div><details className="putaway-helper no-print"><summary>Không có ảnh? Dùng mã mẫu để mô phỏng</summary><p className="tiny muted">Bấm lần lượt hai nút bên dưới để điền sẵn mã thay cho quét ảnh. Sau mỗi lần điền, bấm “Kiểm tra mã” ở bước tương ứng.</p><div className="row"><Button variant="secondary" onClick={() => onFillLocation(carton.qrDemo!.locationCode)}>Điền mã vị trí demo</Button><Button variant="secondary" onClick={() => onFillCarton(carton.code)}>Điền mã thùng demo</Button></div></details></details> : <p className="callout">Vị trí trên nhãn không còn trong sơ đồ. Tạo lại kệ tương ứng hoặc tự chọn vị trí hợp lệ ở bước 1.</p>}
      {carton.status === "stored" && <Button variant="secondary" onClick={prepare}>Tạo lượt demo mới</Button>}
    </>}
    {error && <p className="inline-error" role="alert">{error}</p>}
  </Panel>
    {print && <Modal title="In bộ nhãn QR demo" close={() => setPrint(false)}><div className="qr-print-area demo-print-sheet"><h2>WareMap · Nhãn QR demo</h2><p className="tiny">Dán nhãn vị trí vào ô kệ. Dán nhãn thùng lên thùng hàng. Mỗi thùng chứa một loại sản phẩm, cùng mã lô và hạn dùng.</p>{labels}<Button onClick={() => window.print()}><Printer size={16}/>In / Lưu PDF</Button></div></Modal>}
    {help && <Modal title="Demo QR trong 3–5 phút" close={() => setHelp(false)}><ol className="demo-help"><li><strong>Chọn đúng trạng thái ở khung bộ QR.</strong> Nếu chưa có bộ nhãn, bấm “Chuẩn bị bộ QR demo”. Nếu đang ghi “Đã nhập lên kệ”, bấm “Tạo lượt demo mới”. Nếu ghi “Đang chờ nhập · tồn chưa tăng”, dùng ngay bộ nhãn hiện có. Lượt mới tạo thùng 20 sản phẩm và chưa cộng tồn.</li><li><strong>Mở “Hai nhãn QR của lượt demo”.</strong> Để thử không cần camera, mở tiếp “Không có ảnh? Dùng mã mẫu để mô phỏng”. Hoặc tải ảnh từng nhãn để dùng “Đọc QR từ ảnh”.</li><li><strong>Bước 1 · Chọn nơi cất hàng:</strong> bấm “Điền mã vị trí demo”, rồi bấm “Kiểm tra mã” tại bước 1. Nếu dùng ảnh, chọn “Đọc QR từ ảnh” và ảnh nhãn vị trí trước khi kiểm tra.</li><li><strong>Bước 2 · Nhận diện thùng:</strong> bấm “Điền mã thùng demo”, rồi bấm “Kiểm tra mã” tại bước 2. Nếu dùng ảnh, chọn ảnh nhãn thùng. Không dùng QR lô thay QR thùng.</li><li><strong>Bước 3:</strong> đối chiếu sản phẩm, lô, hạn dùng, số lượng. Tích xác nhận đã đặt hàng rồi xác nhận nhập.</li><li><strong>Xem kết quả:</strong> tồn của lô từ 0 → 20; mở vị trí trên Kho 3D. Nhập lại mã thùng sẽ bị chặn.</li></ol><p className="callout">Thực hiện trên cùng trình duyệt. Điện thoại chỉ dùng để hiển thị ảnh nhãn cho camera máy tính; dữ liệu chưa đồng bộ giữa thiết bị.</p><p className="tiny muted">Chủ doanh, Quản lý kho và Nhân viên kho được nhập hàng. Nhân viên bán hàng chỉ xem thông tin. Hãy dùng nhãn của thùng để nhập hàng; nhãn lô dùng để tra cứu và xác minh khi chuyển kho. Lưu ảnh QR chưa làm tăng số lượng hàng trong kho.</p></Modal>}
  </div>
}
