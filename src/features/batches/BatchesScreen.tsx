import { MapPin } from "lucide-react"
import { useState } from "react"
import { useApp } from "../../app/store"
import { dateLabel, daysLeft, locationLabel } from "../../app/model"
import { ExpiryBadge, matchesProduct, productKey } from "../../app/catalog"
import {
  Button,
  Empty,
  Modal,
  PageTitle,
  Panel,
  SearchInput,
} from "../../app/ui"
export default function Batches() {
  const { visibleProducts, data, go, setSelected, setBranch, branch } = useApp()
  const [filter, setFilter] = useState("Tất cả"),
    [search, setSearch] = useState(""),
    [detailKey, setDetailKey] = useState("")
  const middleRange = `Từ ${data.settings.expiryDays + 1}–90 ngày`
  const filters = [
    "Tất cả",
    "Đã hết hạn",
    `Trong ${data.settings.expiryDays} ngày`,
    ...(data.settings.expiryDays < 90 ? [middleRange] : []),
    "Trên 90 ngày",
  ]
  const matches = (p: typeof visibleProducts[number]) => {
    const d = daysLeft(p.expiry)
    return (
      filter === "Tất cả" ||
      (filter === "Đã hết hạn" && d < 0) ||
      (filter === `Trong ${data.settings.expiryDays} ngày` &&
        d >= 0 &&
        d <= data.settings.expiryDays) ||
      (filter === middleRange && d > data.settings.expiryDays && d <= 90) ||
      (filter === "Trên 90 ngày" && d > 90)
    )
  }
  const rows = visibleProducts
    .filter((p) => matches(p) && matchesProduct(p, search))
    .sort((a, b) => daysLeft(a.expiry) - daysLeft(b.expiry))
  const detail = visibleProducts.find((p) => productKey(p) === detailKey)
  return (
    <>
      <PageTitle
        eyebrow="Kiểm soát lô, chủ động hạn dùng"
        title="Lô hàng & hạn dùng"
        description="Tra cứu lô theo ngày hết hạn. Chọn một lô khi cần xem vị trí hoặc thông tin chi tiết."
      />
      <div className="toolbar">
        <div className="tabs">
          {filters.map((f) => (
            <button
              key={f}
              className={filter === f ? "active" : ""}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Tìm sản phẩm hoặc mã lô…"
        />
      </div>
      <Panel>
        {rows.length ? (
          <>
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Sản phẩm / lô</th>
                    <th>Hạn dùng</th>
                    <th>Số lượng</th>
                    {branch === "all" && <th>Cơ sở</th>}
                    <th>Vị trí</th>
                    <th>Trạng thái</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((p) => (
                    <tr key={productKey(p)}>
                      <td>
                        <strong>{p.name}</strong>
                        <small>
                          {p.batch} · {p.variant}
                        </small>
                      </td>
                      <td>{dateLabel(p.expiry)}</td>
                      <td>{p.qty}</td>
                      {branch === "all" && <td>{p.branch}</td>}
                      <td>
                        {p.rack} · T{p.level} · Ô {p.bin}
                      </td>
                      <td>
                        <ExpiryBadge
                          product={p}
                          threshold={data.settings.expiryDays}
                        />
                      </td>
                      <td>
                        <Button
                          variant="ghost"
                          onClick={() => setDetailKey(productKey(p))}
                        >
                          Xem lô
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="table-footer">
              {rows.length} lô hàng trong phạm vi đang xem · Hết hạn trước được
              xếp trước
            </div>
          </>
        ) : (
          <Empty
            title="Không có lô phù hợp"
            action={
              <Button
                variant="secondary"
                onClick={() => {
                  setFilter("Tất cả")
                  setSearch("")
                }}
              >
                Xóa bộ lọc
              </Button>
            }
          >
            Thử thay đổi mốc hạn dùng hoặc nội dung tìm kiếm.
          </Empty>
        )}
      </Panel>
      <div className="callout" style={{ marginTop: 20 }}>
        Ưu tiên xuất lô hết hạn trước (FEFO). Lô đã hết hạn cần được kiểm tra và
        xử lý riêng, không đưa vào luồng xuất hàng.
      </div>
      {detail && (
        <Modal title={detail.name} close={() => setDetailKey("")}>
          <div className="stack">
            <ExpiryBadge
              product={detail}
              threshold={data.settings.expiryDays}
            />
            <dl className="detail-list">
              <div>
                <dt>Mã lô</dt>
                <dd>{detail.batch}</dd>
              </div>
              <div>
                <dt>Hạn dùng</dt>
                <dd>{dateLabel(detail.expiry)}</dd>
              </div>
              <div>
                <dt>Tồn kho</dt>
                <dd>{detail.qty} sản phẩm</dd>
              </div>
              <div>
                <dt>Cơ sở</dt>
                <dd>{detail.branch}</dd>
              </div>
              <div>
                <dt>Vị trí</dt>
                <dd>{locationLabel(detail)}</dd>
              </div>
            </dl>
            <Button
              onClick={() => {
                setSelected(detail.id)
                setBranch(detail.branch)
                go("warehouse")
              }}
            >
              <MapPin size={16} />
              Xem vị trí
            </Button>
          </div>
        </Modal>
      )}
    </>
  )
}
