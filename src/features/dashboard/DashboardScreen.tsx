import {
  AlertCircle,
  ArrowRight,
  Building2,
  Clock3,
  MapPin,
  Package,
  Truck,
} from "lucide-react"
import { useApp } from "../../app/store"
import {
  Badge,
  Button,
  Empty,
  LinkButton,
  PageTitle,
  Panel,
} from "../../app/ui"
import { branches, daysLeft, expiryLabel, locationLabel } from "../../app/model"
import { MiniMap } from "../public-home/PublicHomeScreen"
export default function Dashboard() {
  const { data, visibleProducts, branch, setBranch, go, setSelected } = useApp()
  const alerts = visibleProducts
    .filter((p) => p.qty > 0 && daysLeft(p.expiry) <= data.settings.expiryDays)
    .sort((a, b) => daysLeft(a.expiry) - daysLeft(b.expiry))
  const transfers = data.transfers.filter(
    (t) =>
      (branch === "all" || t.from === branch || t.to === branch) &&
      t.status !== "Hoàn tất",
  )
  const showProduct = (id: string, b: string) => {
    setSelected(id)
    setBranch(b)
    go("warehouse")
  }
  return (
    <>
      <PageTitle
        eyebrow="Một góc nhìn, toàn bộ hoạt động"
        title="Hôm nay, kho của bạn thế nào?"
        description={
          branch === "all"
            ? "Theo dõi các cơ sở và ưu tiên những việc cần xử lý."
            : `Tình trạng tại ${branch}. Chọn một công việc để bắt đầu.`
        }
        action={
          <Button onClick={() => go("warehouse")}>
            <MapPin size={16} />
            Xem bản đồ kho
          </Button>
        }
      />
      <div className="metric-grid compact">
        {[
          {
            icon: Package,
            label: "Mặt hàng đang quản lý",
            value: new Set(visibleProducts.map((p) => p.id)).size,
            note: `${visibleProducts.reduce((n, p) => n + p.qty, 0)} sản phẩm tại phạm vi đang xem`,
          },
          {
            icon: AlertCircle,
            label: "Lô cần kiểm tra hạn dùng",
            value: alerts.length,
            note: `${alerts.filter((p) => daysLeft(p.expiry) < 0).length} lô đã hết hạn`,
          },
          {
            icon: Truck,
            label: "Phiếu chuyển cần xử lý",
            value: transfers.length,
            note: `${transfers.filter((t) => t.status === "Đang chuyển").length} phiếu đang chuyển`,
          },
        ].map(({ icon: Icon, label, value, note }) => (
          <Panel className="metric" key={label}>
            <span>{label}</span>
            <Icon className="metric-icon" size={20} />
            <div className="metric-value">
              <strong>{value}</strong>
            </div>
            <p>{note}</p>
          </Panel>
        ))}
      </div>
      <div className="split">
        <div className="stack">
          <Panel
            title="Cần xử lý"
            action={
              <Badge tone={alerts.length ? "warning" : "success"}>
                {alerts.length + transfers.length} công việc
              </Badge>
            }
          >
            {!alerts.length && !transfers.length ? (
              <Empty title="Mọi việc đang ổn">
                Chưa có cảnh báo hoặc phiếu chuyển cần xử lý tại phạm vi này.
              </Empty>
            ) : (
              <div className="action-list">
                {alerts.slice(0, 3).map((p) => (
                  <div key={`${p.id}-${p.branch}`}>
                    <span
                      className={`action-symbol ${
                        daysLeft(p.expiry) < 0 ? "danger" : ""
                      }`}
                    >
                      <AlertCircle size={20} />
                    </span>
                    <div className="action-copy">
                      <strong>{p.name}</strong>
                      <p>
                        {expiryLabel(p.expiry)} · {p.qty} sản phẩm · {p.branch}
                      </p>
                    </div>
                    <Button
                      variant="secondary"
                      onClick={() => showProduct(p.id, p.branch)}
                    >
                      Xem vị trí
                      <ArrowRight size={14} />
                    </Button>
                  </div>
                ))}
                {transfers.slice(0, 2).map((t) => (
                  <div key={t.id}>
                    <span
                      className="action-symbol"
                      style={{ background: "#edf5f8", color: "#63889c" }}
                    >
                      <Truck size={20} />
                    </span>
                    <div className="action-copy">
                      <strong>
                        {t.id} · {t.status}
                      </strong>
                      <p>
                        {t.from} → {t.to}
                      </p>
                    </div>
                    <Button variant="secondary" onClick={() => go("mobile")}>
                      Kiểm tra phiếu
                      <ArrowRight size={14} />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            <div className="section-note">
              <LinkButton to="onboarding">
                Xem toàn bộ hàng cần kiểm tra
              </LinkButton>
            </div>
          </Panel>
          <Panel
            title="Hoạt động gần đây"
            action={<Clock3 size={17} color="#8195a3" />}
          >
            {data.activities.length ? (
              <div className="action-list">
                {data.activities.slice(0, 4).map((a) => (
                  <div key={a.id}>
                    <span className="avatar">
                      <Clock3 size={16} />
                    </span>
                    <div className="action-copy">
                      <strong>{a.title}</strong>
                      <p>{a.detail}</p>
                    </div>
                    <small className="muted">
                      {new Date(a.time).toLocaleTimeString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </small>
                  </div>
                ))}
              </div>
            ) : (
              <div className="panel-body">
                <p className="tiny">
                  Thao tác nhập hàng, chuyển kho và chỉnh sơ đồ sẽ được ghi lại
                  tại đây.
                </p>
              </div>
            )}
          </Panel>
        </div>
        <div className="stack">
          <Panel
            title={branch === "all" ? "Các cơ sở của bạn" : "Kho đang xem"}
          >
            {(branch === "all" ? branches : [branch]).map((b) => {
              const n = data.products.filter(
                (p) =>
                  p.branch === b &&
                  p.qty > 0 &&
                  daysLeft(p.expiry) <= data.settings.expiryDays,
              ).length
              return (
                <div className="branch-card" key={b}>
                  <Building2 size={21} color="#7497a7" />
                  <div>
                    <strong className="tiny">{b}</strong>
                    <p>
                      {data.products
                        .filter((p) => p.branch === b)
                        .reduce((a, p) => a + p.qty, 0)}{" "}
                      sản phẩm
                    </p>
                  </div>
                  <button
                    className="icon-button"
                    aria-label={`Xem ${b}`}
                    onClick={() => {
                      setBranch(b)
                      go("warehouse")
                    }}
                  >
                    <Badge tone={n ? "warning" : "success"}>
                      {n ? `${n} cần chú ý` : "Ổn định"}
                    </Badge>
                  </button>
                </div>
              )
            })}
          </Panel>
          <Panel title="Mỗi mặt hàng, một vị trí">
            <div className="panel-body">
              <MiniMap />
              <div className="row between" style={{ marginTop: 17 }}>
                <div>
                  <strong className="tiny">Tìm hàng bằng vị trí</strong>
                  <p className="tiny">Kệ · Tầng · Ô</p>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => go("warehouse")}
                  aria-label="Mở bản đồ kho"
                >
                  <ArrowRight size={18} />
                </Button>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </>
  )
}
