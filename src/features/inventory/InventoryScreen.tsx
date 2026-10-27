import { ArrowRight, Check, MapPin, Package, Plus } from "lucide-react"
import { useEffect, useState } from "react"
import { useApp } from "../../app/store"
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
import {
  branches,
  dateLabel,
  daysLeft,
  locationLabel,
  today,
  type Product,
} from "../../app/model"
import { ExpiryBadge, matchesProduct, productKey } from "../../app/catalog"
import { QRLabels } from "../../app/labels"
type Operation = "Nhập hàng" | "Xuất hàng" | "Kiểm kê" | "Xử lý hàng hỏng" | "Gán vị trí"
export default function Inventory() {
  const {
    data,
    visibleProducts,
    branch,
    role,
    search,
    setSearch,
    update,
    go,
    setSelected,
    setBranch,
    log,
    notify,
  } = useApp()
  const [category, setCategory] = useState("all"),
    [page, setPage] = useState(1),
    [detail, setDetail] = useState<Product | null>(null),
    [operation, setOperation] = useState<Operation | null>(null),
    [newItem, setNewItem] = useState(false),
    [chosenKey, setChosenKey] = useState(""),
    [targetBranch, setTargetBranch] = useState(
      branch === "all" ? branches[0] : branch,
    ),
    [rackId, setRackId] = useState("A1"),
    [error, setError] = useState("")
  const canWrite = ["owner", "manager", "warehouse"].includes(role)
  const filtered = visibleProducts.filter(
    (p) =>
      matchesProduct(p, search) &&
      (category === "all" || p.category === category),
  )
  useEffect(() => setPage(1), [search, category, branch])
  const pages = Math.max(1, Math.ceil(filtered.length / 6))
  const currentPage = Math.min(page, pages)
  const selectedProduct =
    data.products.find((p) => productKey(p) === chosenKey) || visibleProducts[0]
  const racks = data.racks[targetBranch] || []
  const openOperation = (op: Operation, item?: Product) => {
    setOperation(op)
    setChosenKey(productKey(item || visibleProducts[0] || data.products[0]))
    setTargetBranch(item?.branch || (branch === "all" ? branches[0] : branch))
    setRackId(item?.rack || "A1")
    setNewItem(false)
    setError("")
  }
  const actualDetail =
    detail && data.products.find((p) => productKey(p) === productKey(detail))
  return (
    <>
      <PageTitle
        eyebrow="Mỗi mặt hàng, một vị trí rõ ràng"
        title="Sản phẩm & tồn kho"
        description="Tra cứu hàng hóa, kiểm tra số lượng và xác định nơi đang lưu trữ."
        action={
          canWrite ? (
            <Button onClick={() => openOperation("Nhập hàng")}>
              <Plus size={16} />
              Nhập hàng
            </Button>
          ) : undefined
        }
      />
      <div className="toolbar">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Tìm tên hàng, mã sản phẩm hoặc vị trí…"
        />
        <select
          aria-label="Nhóm hàng"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="all">Tất cả nhóm hàng</option>
          {[...new Set(visibleProducts.map((p) => p.category))].map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <Download
          name="ton-kho.csv"
          rows={[
            ["Mã", "Tên hàng", "Lô", "Kho", "Số lượng", "Vị trí"],
            ...filtered.map((p) => [
              p.id,
              p.name,
              p.batch,
              p.branch,
              p.qty,
              locationLabel(p),
            ]),
          ]}
        />
      </div>
      {canWrite && (
        <div className="chip-row" style={{ marginBottom: 20 }}>
          {(["Xuất hàng", "Kiểm kê", "Xử lý hàng hỏng"] as Operation[]).map(
            (op) => (
              <Button
                variant="secondary"
                key={op}
                onClick={() => openOperation(op)}
              >
                {op}
              </Button>
            ),
          )}
          <Button variant="ghost" onClick={() => go("mobile")}>
            Chuyển kho
            <ArrowRight size={14} />
          </Button>
        </div>
      )}
      <Panel>
        {filtered.length ? (
          <>
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Sản phẩm</th>
                    <th>Tồn kho</th>
                    <th>Cơ sở</th>
                    <th>Vị trí</th>
                    <th>Hạn dùng</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered
                    .slice((currentPage - 1) * 6, currentPage * 6)
                    .map((p) => (
                      <tr key={productKey(p)}>
                        <td>
                          <div className="row">
                            <span className="product-swatch">
                              <Package size={18} />
                            </span>
                            <div>
                              <strong>{p.name}</strong>
                              <small>
                                {p.id} · {p.variant}
                              </small>
                            </div>
                          </div>
                        </td>
                        <td>
                          <strong>{p.qty}</strong>
                          <small>sản phẩm</small>
                        </td>
                        <td>{p.branch}</td>
                        <td>
                          <span className="mini-location">
                            <MapPin size={13} />
                            {p.rack} · T{p.level} · Ô {p.bin}
                          </span>
                        </td>
                        <td>
                          <ExpiryBadge
                            product={p}
                            threshold={data.settings.expiryDays}
                          />
                        </td>
                        <td>
                          <Button variant="ghost" onClick={() => setDetail(p)}>
                            Chi tiết
                          </Button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            <div className="pagination">
              <span>
                {filtered.length} dòng hàng · Trang {currentPage}/{pages}
              </span>
              <div className="row">
                <Button
                  variant="secondary"
                  disabled={currentPage === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Trước
                </Button>
                <Button
                  variant="secondary"
                  disabled={currentPage === pages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Sau
                </Button>
              </div>
            </div>
          </>
        ) : (
          <Empty
            title="Chưa tìm thấy sản phẩm"
            action={
              <Button
                variant="secondary"
                onClick={() => {
                  setSearch("")
                  setCategory("all")
                }}
              >
                Xóa bộ lọc
              </Button>
            }
          >
            Thử tên, mã hoặc nhóm hàng khác.
          </Empty>
        )}
      </Panel>
      {actualDetail && (
        <Modal title={actualDetail.name} close={() => setDetail(null)}>
          <div className="stack">
            <p className="tiny muted">
              {actualDetail.variant} · {actualDetail.id}
            </p>
            <dl className="detail-list">
              <div>
                <dt>Lô hàng</dt>
                <dd>{actualDetail.batch}</dd>
              </div>
              <div>
                <dt>Hạn sử dụng</dt>
                <dd>{dateLabel(actualDetail.expiry)}</dd>
              </div>
              <div>
                <dt>Số lượng</dt>
                <dd>{actualDetail.qty} sản phẩm</dd>
              </div>
              <div>
                <dt>Cơ sở</dt>
                <dd>{actualDetail.branch}</dd>
              </div>
              <div>
                <dt>Vị trí</dt>
                <dd>{locationLabel(actualDetail)}</dd>
              </div>
            </dl>
            <details>
              <summary>Nhãn QR vị trí & lô hàng</summary>
              <QRLabels product={actualDetail} />
            </details>
            <Button
              onClick={() => {
                setSelected(actualDetail.id)
                setBranch(actualDetail.branch)
                go("warehouse")
              }}
            >
              <MapPin size={16} />
              Xem vị trí trên bản đồ
            </Button>
            {canWrite && (
              <Button
                variant="secondary"
                onClick={() => {
                  openOperation("Gán vị trí", actualDetail)
                  setDetail(null)
                }}
              >
                Thay đổi vị trí
              </Button>
            )}
          </div>
        </Modal>
      )}
      {operation && (
        <Modal title={operation} close={() => setOperation(null)}>
          <form
            key={`${operation}-${newItem}-${chosenKey}-${targetBranch}`}
            onSubmit={(e) => {
              e.preventDefault()
              const f = new FormData(e.currentTarget)
              const qty = Number(f.get("qty"))
              const level = Number(f.get("level") || 1),
                bin = Number(f.get("bin") || 1)
              const target = racks.find((r) => r.id === rackId)
              if (
                (operation === "Nhập hàng" || operation === "Gán vị trí") &&
                (!target ||
                  level < 1 ||
                  level > target.levels ||
                  bin < 1 ||
                  bin > target.bins)
              )
                return setError("Chọn một kệ và tầng/ô hợp lệ tại cơ sở này.")
              if (
                operation !== "Gán vị trí" &&
                (!Number.isFinite(qty) ||
                  qty < 0 ||
                  !Number.isInteger(qty) ||
                  (operation !== "Kiểm kê" && qty === 0))
              )
                return setError("Số lượng phải là số nguyên hợp lệ.")
              if (!newItem && !selectedProduct)
                return setError("Chọn sản phẩm trước khi tiếp tục.")
              if (operation === "Nhập hàng" && !newItem && daysLeft(selectedProduct.expiry) < 0)
                return setError("Không nhập bổ sung lô đã hết hạn.")
              if (
                !newItem &&
                (operation === "Xuất hàng" ||
                  operation === "Xử lý hàng hỏng") &&
                qty > selectedProduct.qty
              )
                return setError("Số lượng vượt quá tồn kho hiện tại.")
              if (
                operation === "Xuất hàng" &&
                daysLeft(selectedProduct.expiry) < 0
              )
                return setError(
                  "Lô đã hết hạn. Vui lòng chuyển sang xử lý hàng hỏng/hết hạn.",
                )
              if (newItem && operation === "Nhập hàng") {
                const p: Product = {
                  id: "WM-" + Date.now().toString().slice(-6),
                  name: String(f.get("name")).trim(),
                  variant: String(f.get("variant")).trim(),
                  category: String(f.get("category")),
                  batch: String(f.get("batch")).trim(),
                  expiry: String(f.get("expiry")),
                  qty,
                  branch: targetBranch,
                  rack: rackId,
                  level,
                  bin,
                }
                if (daysLeft(p.expiry) < 0)
                  return setError("Không nhập lô đã hết hạn.")
                update((d) => ({ ...d, products: [...d.products, p] }))
              } else
                update((d) => ({
                  ...d,
                  products: d.products.map((p) =>
                    productKey(p) !== productKey(selectedProduct)
                      ? p
                      : {
                          ...p,
                          qty:
                            operation === "Nhập hàng"
                              ? p.qty + qty
                              : operation === "Kiểm kê"
                                ? qty
                                : operation === "Gán vị trí"
                                  ? p.qty
                                  : p.qty - qty,
                          ...(operation === "Gán vị trí"
                            ? { rack: rackId, level, bin }
                            : {}),
                        },
                  ),
                }))
              log(
                operation,
                `${newItem ? f.get("name") : selectedProduct.name} · ${
                  operation === "Gán vị trí"
                    ? `Kệ ${rackId}`
                    : qty + " sản phẩm"
                } · ${targetBranch} · ${f.get("reason") || ""}`,
              )
              notify(`${operation} đã được ghi nhận trong kho mẫu.`)
              setOperation(null)
            }}
          >
            {operation === "Nhập hàng" && (
              <div className="tabs">
                <button
                  type="button"
                  className={!newItem ? "active" : ""}
                  onClick={() => setNewItem(false)}
                >
                  Hàng đã có
                </button>
                <button
                  type="button"
                  className={newItem ? "active" : ""}
                  onClick={() => setNewItem(true)}
                >
                  Sản phẩm mới
                </button>
              </div>
            )}
            {newItem ? (
              <>
                <label className="field">
                  Tên sản phẩm
                  <input name="name" required />
                </label>
                <div className="form-grid">
                  <label className="field">
                    Quy cách / biến thể
                    <input
                      name="variant"
                      required
                      placeholder="50ml, màu hồng…"
                    />
                  </label>
                  <label className="field">
                    Nhóm hàng
                    <select name="category">
                      <option>Chăm sóc cá nhân</option>
                      <option>Mẹ & Bé</option>
                      <option>Hàng tiêu dùng</option>
                    </select>
                  </label>
                </div>
                <div className="form-grid">
                  <label className="field">
                    Mã lô
                    <input name="batch" required />
                  </label>
                  <label className="field">
                    Hạn dùng
                    <input type="date" name="expiry" min={today()} required />
                  </label>
                </div>
                <label className="field">
                  Cơ sở
                  <select
                    value={targetBranch}
                    onChange={(e) => {
                      setTargetBranch(e.target.value)
                      setRackId(data.racks[e.target.value]?.[0]?.id || "")
                    }}
                  >
                    {(role === "owner"
                      ? branches
                      : [branch === "all" ? branches[0] : branch]
                    ).map((b) => (
                      <option key={b}>{b}</option>
                    ))}
                  </select>
                </label>
              </>
            ) : (
              <label className="field">
                Sản phẩm / lô
                <select
                  value={chosenKey}
                  onChange={(e) => {
                    const p = data.products.find(
                      (p) => productKey(p) === e.target.value,
                    )!
                    setChosenKey(e.target.value)
                    setTargetBranch(p.branch)
                    setRackId(p.rack)
                  }}
                >
                  {visibleProducts.map((p) => (
                    <option key={productKey(p)} value={productKey(p)}>
                      {p.name} · {p.batch} · {p.branch} ({p.qty})
                    </option>
                  ))}
                </select>
              </label>
            )}
            {operation !== "Gán vị trí" && (
              <label className="field">
                {operation === "Kiểm kê" ? "Số lượng thực đếm" : "Số lượng"}
                <input
                  type="number"
                  name="qty"
                  min={operation === "Kiểm kê" ? 0 : 1}
                  step={1}
                  required
                  defaultValue={
                    operation === "Kiểm kê" ? selectedProduct?.qty : 1
                  }
                />
              </label>
            )}
            {(operation === "Gán vị trí" || newItem) && (
              <>
                <div className="callout">
                  Chọn vị trí đã được tạo trong sơ đồ kho. Các ô phải nằm trong
                  kích thước kệ.
                </div>
                <div className="form-grid">
                  <label className="field">
                    Kệ
                    <select
                      value={rackId}
                      onChange={(e) => setRackId(e.target.value)}
                    >
                      {racks.map((r) => (
                        <option value={r.id} key={r.id}>
                          {r.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="field">
                    Tầng
                    <input
                      name="level"
                      type="number"
                      min={1}
                      max={racks.find((r) => r.id === rackId)?.levels || 1}
                      defaultValue={1}
                      required
                    />
                  </label>
                  <label className="field">
                    Ô
                    <input
                      name="bin"
                      type="number"
                      min={1}
                      max={racks.find((r) => r.id === rackId)?.bins || 1}
                      defaultValue={1}
                      required
                    />
                  </label>
                </div>
              </>
            )}
            {["Kiểm kê", "Xử lý hàng hỏng", "Xuất hàng"].includes(
              operation,
            ) && (
              <label className="field">
                Lý do / ghi chú
                <textarea name="reason" required />
              </label>
            )}
            {operation === "Nhập hàng" && !newItem && (
              <div className="callout">
                Nhập bổ sung cùng lô tại {selectedProduct?.branch},{" "}
                {selectedProduct && locationLabel(selectedProduct)}.
              </div>
            )}
            {error && (
              <p role="alert" className="inline-error">
                {error}
              </p>
            )}
            <div className="form-actions">
              <Button variant="secondary" onClick={() => setOperation(null)}>
                Hủy
              </Button>
              <Button type="submit">
                <Check size={15} />
                Xác nhận {operation.toLocaleLowerCase("vi")}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </>
  )
}
