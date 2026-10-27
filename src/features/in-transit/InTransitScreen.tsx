import { ArrowRight, Plus, ScanLine, Truck } from "lucide-react"
import { useState } from "react"
import { useApp } from "../../app/store"
import {
  branches,
  dateLabel,
  daysLeft,
  today,
  type Transfer,
} from "../../app/model"
import {
  Badge,
  Button,
  Download,
  Empty,
  Modal,
  PageTitle,
  Panel,
  SearchInput,
} from "../../app/ui"
import { productKey } from "../../app/catalog"
const statuses = ["Tất cả", "Chuẩn bị", "Đang chuyển", "Kiểm nhận", "Hoàn tất"]
export default function Transfers() {
  const { data, update, branch, visibleProducts, go, setScanTask, log, role } =
    useApp()
  const [filter, setFilter] = useState("Tất cả"),
    [query, setQuery] = useState(""),
    [chosen, setChosen] = useState(""),
    [creating, setCreating] = useState(false),
    [error, setError] = useState("")
  const rows = data.transfers.filter(
    (t) =>
      (branch === "all" || t.from === branch || t.to === branch) &&
      (filter === "Tất cả" || filter === t.status) &&
      `${t.id} ${t.from} ${t.to}`.toLowerCase().includes(query.toLowerCase()),
  )
  const transfer = rows.find((t) => t.id === chosen)
  const product =
    transfer &&
    data.products.find(
      (p) => p.id === transfer.productId && p.batch === transfer.batch,
    )
  const canAct = (b: string) => role === "owner" || b === branch
  return (
    <>
      <PageTitle
        eyebrow="Gửi rõ ràng, nhận đủ hàng"
        title="Chuyển kho"
        description="Theo dõi phiếu giữa các cơ sở. Xác minh vị trí và lô hàng tại cả nơi gửi và nơi nhận."
        action={
          <Button
            onClick={() => {
              setCreating(true)
              setError("")
            }}
          >
            <Plus size={16} />
            Tạo phiếu chuyển
          </Button>
        }
      />
      <div className="toolbar">
        <div className="tabs">
          {statuses.map((s) => (
            <button
              key={s}
              className={filter === s ? "active" : ""}
              onClick={() => {
                setFilter(s)
                setChosen("")
              }}
            >
              {s}
            </button>
          ))}
        </div>
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Tìm mã phiếu hoặc cơ sở…"
        />
      </div>
      <Panel>
        {rows.length ? (
          <>
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Phiếu chuyển</th>
                    <th>Nơi gửi → Nơi nhận</th>
                    <th>Số lượng</th>
                    <th>Trạng thái</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((t) => (
                    <tr
                      className={t.id === chosen ? "selected" : ""}
                      key={t.id}
                    >
                      <td>
                        <strong>{t.id}</strong>
                        <small>{dateLabel(t.created)}</small>
                      </td>
                      <td>
                        <strong>{t.from}</strong>
                        <small>→ {t.to}</small>
                      </td>
                      <td>
                        {t.qty} gửi
                        {t.received !== undefined && (
                          <small>{t.received} đã nhận</small>
                        )}
                      </td>
                      <td>
                        <Badge
                          tone={
                            t.status === "Hoàn tất"
                              ? "success"
                              : t.status === "Kiểm nhận"
                                ? "warning"
                                : "info"
                          }
                        >
                          {t.status}
                        </Badge>
                        {t.received !== undefined && t.received !== t.qty && (
                          <small style={{ color: "#b44b51" }}>
                            Lệch {t.qty - t.received}
                          </small>
                        )}
                      </td>
                      <td>
                        <Button variant="ghost" onClick={() => setChosen(t.id)}>
                          Mở phiếu
                          <ArrowRight size={14} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="table-footer">
              {rows.length} phiếu trong phạm vi đang xem
            </div>
          </>
        ) : (
          <Empty title="Chưa có phiếu phù hợp">
            Thay đổi bộ lọc hoặc tạo phiếu chuyển mới.
          </Empty>
        )}
      </Panel>
      {transfer && (
        <Modal title={`Phiếu ${transfer.id}`} close={() => setChosen("")}>
          <div className="stack">
            <div className="step-list">
              {statuses.slice(1).map((s, i) => (
                <div
                  className={`step ${
                    i <= statuses.indexOf(transfer.status) - 1 ? "active" : ""
                  }`}
                  key={s}
                >
                  <span>{i + 1}</span>
                  {s}
                </div>
              ))}
            </div>
            <div className="callout">
              <strong>
                {transfer.from} → {transfer.to}
              </strong>
              <br />
              {product?.name} · {transfer.batch}
            </div>
            <dl className="detail-list">
              <div>
                <dt>Số lượng gửi</dt>
                <dd>{transfer.qty}</dd>
              </div>
              <div>
                <dt>Số lượng nhận</dt>
                <dd>{transfer.received ?? "Chưa kiểm nhận"}</dd>
              </div>
              {transfer.received !== undefined && (
                <div>
                  <dt>Chênh lệch</dt>
                  <dd>{transfer.qty - transfer.received}</dd>
                </div>
              )}
            </dl>
            {transfer.status === "Chuẩn bị" && canAct(transfer.from) && (
              <Button
                onClick={() => {
                  setScanTask({ transferId: transfer.id, mode: "dispatch" })
                  go("scanner")
                }}
              >
                <ScanLine size={17} />
                Xác minh & gửi hàng
              </Button>
            )}
            {transfer.status === "Đang chuyển" && canAct(transfer.to) && (
              <Button
                onClick={() => {
                  setScanTask({ transferId: transfer.id, mode: "receive" })
                  go("scanner")
                }}
              >
                <ScanLine size={17} />
                Quét kiểm nhận
              </Button>
            )}
            {transfer.status === "Kiểm nhận" &&
              ["owner", "manager"].includes(role) &&
              canAct(transfer.to) && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    const reason = new FormData(e.currentTarget).get("reason")
                    update((d) => ({
                      ...d,
                      transfers: d.transfers.map((t) =>
                        t.id === transfer.id
                          ? {
                              ...t,
                              status: "Hoàn tất",
                              history: [
                                ...t.history,
                                `Đã đối soát chênh lệch: ${reason}`,
                              ],
                            }
                          : t,
                      ),
                    }))
                    log(
                      "Đã đối soát phiếu chuyển",
                      `${transfer.id} · ${reason}`,
                    )
                    setChosen("")
                  }}
                >
                  <label className="field">
                    Kết quả kiểm tra chênh lệch
                    <textarea
                      name="reason"
                      required
                      placeholder="Nêu lý do và hướng xử lý phần thiếu…"
                    />
                  </label>
                  <p className="tiny muted">
                    Tồn kho nơi nhận đã ghi nhận đúng số thực nhận. Việc đóng
                    đối soát không tự cộng phần thiếu.
                  </p>
                  <Button type="submit">Xác nhận kết quả đối soát</Button>
                </form>
              )}
            <details open>
              <summary>Lịch sử phiếu</summary>
              <div className="timeline">
                {transfer.history.map((h, i) => (
                  <div key={i}>{h}</div>
                ))}
              </div>
            </details>
          </div>
        </Modal>
      )}
      {creating && (
        <Modal title="Tạo phiếu chuyển kho" close={() => setCreating(false)}>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              const f = new FormData(e.currentTarget)
              const item = data.products.find(
                (p) => productKey(p) === f.get("item"),
              )
              const qty = Number(f.get("qty"))
              const to = String(f.get("to"))
              if (!item || qty < 1 || !Number.isInteger(qty) || qty > item.qty)
                return setError("Số lượng phải hợp lệ và không vượt tồn kho.")
              if (to === item.branch)
                return setError("Nơi nhận phải khác nơi gửi.")
              if (daysLeft(item.expiry) < 0)
                return setError("Không thể chuyển lô đã hết hạn.")
              const t: Transfer = {
                id: "CK-" + Date.now().toString().slice(-6),
                productId: item.id,
                batch: item.batch,
                from: item.branch,
                to,
                qty,
                status: "Chuẩn bị",
                created: today(),
                history: [
                  `Đã tạo phiếu · ${new Date().toLocaleTimeString("vi-VN")}`,
                ],
                reserved: false,
              }
              update((d) => ({ ...d, transfers: [t, ...d.transfers] }))
              log("Đã tạo phiếu chuyển", `${t.id} · ${item.branch} → ${to}`)
              setCreating(false)
              setFilter("Tất cả")
              setChosen(t.id)
            }}
          >
            <label className="field">
              Sản phẩm / lô tại nơi gửi
              <select name="item" required>
                {visibleProducts
                  .filter((p) => p.qty > 0)
                  .map((p) => (
                    <option key={productKey(p)} value={productKey(p)}>
                      {p.name} · {p.batch} · {p.branch} ({p.qty})
                    </option>
                  ))}
              </select>
            </label>
            <div className="form-grid">
              <label className="field">
                Nơi nhận
                <select name="to">
                  {branches.map((b) => (
                    <option key={b}>{b}</option>
                  ))}
                </select>
              </label>
              <label className="field">
                Số lượng
                <input type="number" name="qty" min={1} step={1} required />
              </label>
            </div>
            <div className="callout">
              Tạo phiếu chưa trừ tồn kho. Hàng được trừ khi xác minh và gửi,
              cộng nơi nhận theo số thực nhận.
            </div>
            {error && (
              <p className="inline-error" role="alert">
                {error}
              </p>
            )}
            <div className="form-actions">
              <Button variant="secondary" onClick={() => setCreating(false)}>
                Hủy
              </Button>
              <Button type="submit">Tạo phiếu</Button>
            </div>
          </form>
        </Modal>
      )}
    </>
  )
}
