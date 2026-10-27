import {
  AlertCircle,
  ArrowRight,
  MapPin,
  MessageCircle,
  Settings,
} from "lucide-react"
import { useState } from "react"
import { useApp } from "../../app/store"
import { dateLabel, daysLeft, locationLabel } from "../../app/model"
import { productKey } from "../../app/catalog"
import { Badge, Button, Empty, Modal, PageTitle, Panel } from "../../app/ui"
export default function Alerts() {
  const { data, visibleProducts, go, setSelected, setBranch, role } = useApp()
  const [filter, setFilter] = useState("Tất cả"),
    [message, setMessage] = useState("")
  const alerts = visibleProducts
    .filter((p) => p.qty > 0 && daysLeft(p.expiry) <= data.settings.expiryDays)
    .sort((a, b) => daysLeft(a.expiry) - daysLeft(b.expiry))
  const rows = alerts.filter(
    (p) =>
      filter === "Tất cả" ||
      (filter === "Đã hết hạn" && daysLeft(p.expiry) < 0) ||
      (filter === "Cận hạn" && daysLeft(p.expiry) >= 0),
  )
  const p = data.products.find((p) => productKey(p) === message)
  return (
    <>
      <PageTitle
        eyebrow="Xử lý sớm, giảm hàng bỏ quên"
        title="Hàng cần kiểm tra hạn dùng"
        description={`Ưu tiên lô đã hết hạn và lô còn trong ${data.settings.expiryDays} ngày. Chọn vị trí để tìm hàng thực tế.`}
        action={
          ["owner", "manager"].includes(role) ? (
            <Button variant="secondary" onClick={() => go("settings")}>
              <Settings size={15} />
              Cài đặt cảnh báo
            </Button>
          ) : undefined
        }
      />
      <div className="toolbar">
        <div className="tabs">
          {["Tất cả", "Đã hết hạn", "Cận hạn"].map((s) => (
            <button
              className={filter === s ? "active" : ""}
              onClick={() => setFilter(s)}
              key={s}
            >
              {s}
            </button>
          ))}
        </div>
        <Badge tone="warning">{rows.length} lô cần kiểm tra</Badge>
      </div>
      <Panel>
        {rows.length ? (
          <div className="action-list">
            {rows.map((item) => {
              const expired = daysLeft(item.expiry) < 0
              return (
                <div key={productKey(item)}>
                  <span className={`action-symbol ${expired ? "danger" : ""}`}>
                    <AlertCircle size={21} />
                  </span>
                  <div className="action-copy">
                    <div className="row wrap">
                      <strong>{item.name}</strong>
                      <Badge tone={expired ? "danger" : "warning"}>
                        {expired
                          ? `Đã hết hạn ${-daysLeft(item.expiry)} ngày`
                          : `Còn ${daysLeft(item.expiry)} ngày`}
                      </Badge>
                    </div>
                    <p>
                      {item.batch} · {item.qty} sản phẩm · {item.branch}
                    </p>
                    <p>{locationLabel(item)}</p>
                  </div>
                  <div className="row wrap">
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setSelected(item.id)
                        setBranch(item.branch)
                        go("warehouse")
                      }}
                    >
                      <MapPin size={14} />
                      Xem vị trí
                    </Button>
                    {["owner", "manager"].includes(role) && (
                      <Button
                        variant="ghost"
                        onClick={() => setMessage(productKey(item))}
                      >
                        <MessageCircle size={15} />
                        Thông báo
                      </Button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <Empty title="Chưa có lô cần chú ý">
            Không có cảnh báo phù hợp trong phạm vi và bộ lọc đang xem.
          </Empty>
        )}
      </Panel>
      <div className="grid-two" style={{ marginTop: 22 }}>
        <div className="callout">
          <strong>Lô cận hạn</strong>
          <br />
          Kiểm tra hàng tại vị trí, ưu tiên sử dụng lô hết hạn trước khi lập
          phiếu xuất.
        </div>
        <div className="callout warning">
          <strong>Lô đã hết hạn</strong>
          <br />
          Tách riêng để kiểm tra. Dùng “Xử lý hàng hỏng” trong Sản phẩm & tồn
          kho để ghi nhận giảm số lượng.
        </div>
      </div>
      {p && (
        <Modal title="Xem trước thông báo" close={() => setMessage("")}>
          <div className="stack">
            <Badge tone="info">Bản xem trước · Chưa gửi</Badge>
            <div className="audit-card">
              <h3>WareMap System · Cảnh báo hạn dùng</h3>
              <p style={{ marginTop: 14 }}>
                {p.name} · {p.variant}
                <br />
                Lô {p.batch} · {p.qty} sản phẩm
                <br />
                Hạn dùng: {dateLabel(p.expiry)}
                <br />
                {p.branch} · {locationLabel(p)}
              </p>
            </div>
            <div className="callout">
              Chưa kết nối dịch vụ gửi Zalo hoặc email. Có thể sao chép nội dung
              để sử dụng.
            </div>
            <Button
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(
                    `${p.name}\nLô ${p.batch}\nHạn dùng ${dateLabel(p.expiry)}\n${p.branch}\n${locationLabel(p)}`,
                  )
                  setMessage("")
                } catch {}
              }}
            >
              Sao chép nội dung
            </Button>
          </div>
        </Modal>
      )}
    </>
  )
}
