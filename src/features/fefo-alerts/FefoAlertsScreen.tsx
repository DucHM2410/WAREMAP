import {
  AlertCircle,
  Bell,
  Clock3,
  MapPin,
  PackageCheck,
  Settings,
} from "lucide-react"

import { lazy, Suspense, useState } from "react"

import { useApp } from "../../app/store"

import { dateLabel, daysLeft, locationLabel, roleNames } from "../../app/model"

import { productKey } from "../../app/catalog"

import { Badge, Button, Empty, Modal } from "../../app/ui"

import "./fefo-alerts.css"

const MiniWarehouse3D = lazy(() =>
  import("../../shared/components/MiniWarehouse3D").then((module) => ({
    default: module.MiniWarehouse3D,
  })),
)

export default function Alerts() {
  const {
    data,

    visibleProducts,

    accessibleBranches,

    branch,

    go,

    setSelected,

    setBranch,

    role,

    notify,
  } = useApp()

  const [filter, setFilter] = useState("Tất cả")

  const [message, setMessage] = useState("")

  const alerts = visibleProducts

    .filter((p) => p.qty > 0 && daysLeft(p.expiry) <= data.settings.expiryDays)

    .sort((a, b) => daysLeft(a.expiry) - daysLeft(b.expiry))

  const rows = alerts.filter(
    (p) =>
      filter === "Tất cả" ||
      (filter === "Đã hết hạn" && daysLeft(p.expiry) < 0) ||
      (filter === "Cận hạn" && daysLeft(p.expiry) >= 0),
  )

  const mapBranch = branch === "all" ? accessibleBranches[0] : branch

  const mapRacks = mapBranch ? (data.racks[mapBranch] ?? []) : []

  const mapAlerts = alerts.filter((p) => p.branch === mapBranch)

  const alertRacks = Array.from(new Set(mapAlerts.map((p) => p.rack)))

  const expiredCount = visibleProducts.filter(
    (p) => p.qty > 0 && daysLeft(p.expiry) < 0,
  ).length

  const nearExpiryCount = alerts.filter((p) => daysLeft(p.expiry) >= 0).length

  const safeCount = visibleProducts.filter(
    (p) => p.qty > 0 && daysLeft(p.expiry) > data.settings.expiryDays,
  ).length

  const p = data.products.find((p) => productKey(p) === message)

  return (
    <>
      <div className="fefo-report">
        <aside className="fefo-report__overview">
          <section className="fefo-report__map-card">
            <div className="fefo-report__map-heading">
              <span className="fefo-report__map-icon">
                <MapPin size={16} />
              </span>
              <div>
                <strong>Bản đồ kho</strong>
                <span>{mapBranch ?? "Chưa có cơ sở"}</span>
              </div>
              <span className="fefo-report__map-status">
                <span /> Đang hoạt động
              </span>
            </div>
            <div className="fefo-report__map-canvas">
              {mapRacks.length ? (
                <Suspense
                  fallback={
                    <div className="fefo-report__map-loading" role="status">
                      Đang tải bản đồ kho…
                    </div>
                  }
                >
                  <MiniWarehouse3D racks={mapRacks} alertRacks={alertRacks} />
                </Suspense>
              ) : (
                <div className="fefo-report__map-loading">
                  Chưa có sơ đồ kho cho cơ sở này.
                </div>
              )}
              {alertRacks.length > 0 && (
                <span className="fefo-report__map-caption">
                  <span /> {alertRacks.length} kệ có lô cần chú ý
                </span>
              )}
            </div>
            <div className="fefo-report__map-foot">
              <span>
                <span className="fefo-report__legend-dot" />
                Kệ có cảnh báo
              </span>
              <Button variant="ghost" onClick={() => go("warehouse")}>
                Mở bản đồ <MapPin size={14} />
              </Button>
            </div>
          </section>

          <div className="fefo-report__metrics">
            <article className="fefo-report__metric fefo-report__metric--danger">
              <span className="fefo-report__metric-icon">
                <AlertCircle size={16} />
              </span>
              <span className="fefo-report__metric-label">Đã hết hạn</span>
              <strong>{expiredCount}</strong>
              <small>Lô cần xử lý</small>
            </article>
            <article className="fefo-report__metric fefo-report__metric--warning">
              <span className="fefo-report__metric-icon">
                <Clock3 size={16} />
              </span>
              <span className="fefo-report__metric-label">Cận hạn</span>
              <strong>{nearExpiryCount}</strong>
              <small>Trong {data.settings.expiryDays} ngày</small>
            </article>
            <article className="fefo-report__metric fefo-report__metric--safe">
              <span className="fefo-report__metric-icon">
                <PackageCheck size={16} />
              </span>
              <span className="fefo-report__metric-label">Còn hạn</span>
              <strong>{safeCount}</strong>
              <small>Chưa cần xử lý</small>
            </article>
          </div>

          <div className="fefo-report__tip">
            <strong>Nguyên tắc FEFO</strong>
            <p>
              Ưu tiên xuất lô có hạn sử dụng gần nhất. Kiểm tra vị trí trước khi
              xử lý hàng.
            </p>
          </div>
        </aside>

        <section className="fefo-report__content" aria-label="Báo cáo FEFO">
          <div className="fefo-report__topbar">
            <span className="fefo-report__live">
              <span /> Dữ liệu kho
            </span>
            <span className="fefo-report__user-pill">{roleNames[role]}</span>
          </div>

          <header className="fefo-report__header">
            <div>
              <div className="fefo-report__eyebrow">
                Xử lý sớm, giảm hàng bỏ quên
              </div>
              <h1>Hàng cần kiểm tra hạn dùng</h1>
              <p>
                Ưu tiên lô đã hết hạn và lô còn hạn trong{" "}
                {data.settings.expiryDays} ngày.
              </p>
            </div>
            {["owner", "manager"].includes(role) && (
              <Button
                variant="secondary"
                onClick={() => go("settings")}
                className="fefo-report__settings"
              >
                <Settings size={15} />
                Cài đặt cảnh báo
              </Button>
            )}
          </header>

          <section className="fefo-report__list-card">
            <div className="fefo-report__list-heading">
              <div>
                <h2>Danh sách lô FEFO</h2>
                <p>Các lô tồn kho cần ưu tiên kiểm tra</p>
              </div>
              <span className="fefo-report__count">
                {rows.length} lô cần kiểm tra
              </span>
            </div>

            <div className="fefo-report__toolbar">
              <div
                className="fefo-report__tabs"
                role="group"
                aria-label="Lọc lô hàng"
              >
                {["Tất cả", "Đã hết hạn", "Cận hạn"].map((item) => (
                  <button
                    className={filter === item ? "active" : ""}
                    onClick={() => setFilter(item)}
                    key={item}
                    type="button"
                    aria-pressed={filter === item}
                  >
                    {item}
                  </button>
                ))}
              </div>
              <Badge tone={rows.length ? "warning" : "success"}>
                {rows.length ? "Cần ưu tiên xử lý" : "Không có cảnh báo"}
              </Badge>
            </div>

            {rows.length ? (
              <div className="fefo-report__table-scroll">
                <table className="fefo-report__table">
                  <thead>
                    <tr>
                      <th>Lô hàng</th>
                      <th>Sản phẩm</th>
                      <th>Vị trí</th>
                      <th>Tình trạng</th>
                      <th>Số lượng</th>
                      <th>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((item) => {
                      const expired = daysLeft(item.expiry) < 0

                      return (
                        <tr key={productKey(item)}>
                          <td>
                            <strong>{item.batch}</strong>
                          </td>
                          <td>
                            <strong>{item.name}</strong>
                            <small>{item.variant}</small>
                          </td>
                          <td>
                            <span>{item.branch}</span>
                            <small>{locationLabel(item)}</small>
                          </td>
                          <td>
                            <span
                              className={`fefo-report__status ${
                                expired ? "is-expired" : "is-near"
                              }`}
                            >
                              <span />
                              {expired
                                ? `Hết hạn ${-daysLeft(item.expiry)} ngày`
                                : `Còn ${daysLeft(item.expiry)} ngày`}
                            </span>
                          </td>
                          <td>{item.qty}</td>
                          <td>
                            <div className="fefo-report__row-actions">
                              <Button
                                variant="secondary"
                                onClick={() => {
                                  setSelected(item.id)

                                  setBranch(item.branch)

                                  go("warehouse")
                                }}
                              >
                                <MapPin size={13} />
                                Vị trí
                              </Button>
                              {["owner", "manager"].includes(role) && (
                                <Button
                                  variant="secondary"
                                  onClick={() => setMessage(productKey(item))}
                                >
                                  <Bell size={13} />
                                  Báo
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="fefo-report__empty">
                <Empty title="Chưa có lô cần chú ý">
                  Không có cảnh báo phù hợp trong phạm vi và bộ lọc đang xem.
                </Empty>
              </div>
            )}
          </section>

          <div className="fefo-report__footnote">
            Số liệu được lọc theo cơ sở đang chọn và tồn kho hiện tại.
          </div>
        </section>
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

                  notify("Đã sao chép nội dung cảnh báo.")
                } catch {
                  notify(
                    "Không thể sao chép. Hãy kiểm tra quyền truy cập clipboard.",
                  )
                }
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
