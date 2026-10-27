import {
  Building2,
  Check,
  Download as DownloadIcon,
  ShieldCheck,
} from "lucide-react"
import { useState } from "react"
import { useApp } from "../../app/store"
import { branches, money, quote, today } from "../../app/model"
import { Badge, Button, Modal, PageTitle, Panel } from "../../app/ui"
export default function Settings() {
  const { data, update, notify, role } = useApp()
  const [tab, setTab] = useState("Doanh nghiệp"),
    [company, setCompany] = useState(data.company),
    [threshold, setThreshold] = useState(data.settings.expiryDays),
    [enabled, setEnabled] = useState(data.settings.notifications),
    [request, setRequest] = useState(false),
    [locations, setLocations] = useState(data.locations),
    [staff, setStaff] = useState(data.allowance),
    [connection, setConnection] = useState("")
  const price = quote(data.locations, data.allowance)
  const preview = quote(locations, staff)
  const tabs =
    role === "owner"
      ? [
          "Doanh nghiệp",
          "Gói & hạn mức",
          "Kết nối",
          "Thông báo",
          "Dữ liệu & hỗ trợ",
        ]
      : ["Thông báo", "Dữ liệu & hỗ trợ"]
  const active = tabs.includes(tab) ? tab : tabs[0]
  return (
    <>
      <PageTitle
        title="Cài đặt"
        description="Mở đúng mục bạn cần. Thông tin cấu hình chi tiết được hiển thị theo từng nhóm."
      />
      <div className="setting-tabs">
        {tabs.map((t) => (
          <Button
            key={t}
            variant={active === t ? "primary" : "secondary"}
            onClick={() => setTab(t)}
          >
            {t}
          </Button>
        ))}
      </div>
      <div className="settings-width">
        {active === "Doanh nghiệp" && (
          <Panel title="Thông tin doanh nghiệp">
            <div className="panel-body">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  update((d) => ({
                    ...d,
                    company: company.trim(),
                    requests: d.requests.map((r) =>
                      r.company === d.company
                        ? { ...r, company: company.trim() }
                        : r,
                    ),
                  }))
                  notify("Tên doanh nghiệp đã được lưu trên trình duyệt.")
                }}
              >
                <label className="field">
                  Tên doanh nghiệp
                  <input
                    required
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                  />
                </label>
                <div className="stack">
                  {branches.map((b) => (
                    <div className="row" key={b}>
                      <Building2 size={17} color="#829ba9" />
                      <span className="tiny">{b}</span>
                      <Badge>Đang sử dụng</Badge>
                    </div>
                  ))}
                </div>
                <div className="form-actions">
                  <Button type="submit">Lưu thông tin</Button>
                </div>
              </form>
            </div>
          </Panel>
        )}
        {active === "Gói & hạn mức" && (
          <div className="stack">
            <Panel
              title={data.locations === 1 ? "Gói Một cơ sở" : "Gói Chuỗi"}
              action={<Badge tone="info">Gói minh họa</Badge>}
            >
              <div className="panel-body stack">
                <div className="stat-pair">
                  <div>
                    <small>Hạn mức cơ sở</small>
                    <strong>
                      {data.locations === 1
                        ? 1
                        : 5 +
                          Math.ceil(Math.max(0, data.locations - 5) / 5) * 5}
                    </strong>
                  </div>
                  <div>
                    <small>Tài khoản nhân viên</small>
                    <strong>
                      {data.staff.length}/{data.allowance}
                    </strong>
                  </div>
                </div>
                <dl className="detail-list">
                  <div>
                    <dt>Gói cơ bản</dt>
                    <dd>{money(price.base)}/tháng</dd>
                  </div>
                  <div>
                    <dt>Block cơ sở bổ sung</dt>
                    <dd>{money(price.branchExtra)}/tháng</dd>
                  </div>
                  <div>
                    <dt>Block tài khoản bổ sung</dt>
                    <dd>{money(price.staffExtra)}/tháng</dd>
                  </div>
                  <div>
                    <dt>Tổng dự kiến</dt>
                    <dd className="text-teal">{money(price.total)}/tháng</dd>
                  </div>
                </dl>
                <div className="callout">
                  Một cơ sở: 99.000đ/tháng. Chuỗi tối đa 5 cơ sở:
                  299.000đ/tháng. Thêm 5 cơ sở: 150.000đ/tháng. Thêm 5 tài khoản
                  nhân viên: 60.000đ/tháng.
                </div>
                <Button onClick={() => setRequest(true)}>
                  Yêu cầu thay đổi hạn mức
                </Button>
              </div>
            </Panel>
            <p className="tiny muted">
              1 tài khoản chủ doanh nghiệp được tính riêng. Yêu cầu tăng hạn mức
              do WareMap xét duyệt; bản demo không thu phí.
            </p>
          </div>
        )}
        {active === "Kết nối" && (
          <Panel title="Kết nối dịch vụ">
            <div className="action-list">
              {["KiotViet", "Sapo", "Zalo OA"].map((service) => (
                <div key={service}>
                  <span className="avatar">{service[0]}</span>
                  <div className="action-copy">
                    <strong>{service}</strong>
                    <p>Chưa kết nối · Không có dữ liệu trao đổi với dịch vụ</p>
                  </div>
                  <Button
                    variant="secondary"
                    onClick={() => setConnection(service)}
                  >
                    Xem cấu hình
                  </Button>
                </div>
              ))}
            </div>
          </Panel>
        )}
        {active === "Thông báo" && (
          <Panel title="Cảnh báo hạn dùng">
            <div className="panel-body">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  update((d) => ({
                    ...d,
                    settings: {
                      ...d.settings,
                      expiryDays: threshold,
                      notifications: enabled,
                    },
                  }))
                  notify("Đã lưu cấu hình cảnh báo cho kho mẫu.")
                }}
              >
                <label className="field">
                  Cảnh báo khi hạn dùng còn trong
                  <input
                    className="number-input"
                    type="number"
                    min={1}
                    max={90}
                    required
                    value={threshold}
                    onChange={(e) => setThreshold(Number(e.target.value))}
                  />
                  <small>
                    Ngày. Áp dụng thống nhất cho Tổng quan, Lô hàng và Hàng cận
                    hạn.
                  </small>
                </label>
                <label className="check-row">
                  <input
                    type="checkbox"
                    checked={enabled}
                    onChange={(e) => setEnabled(e.target.checked)}
                  />
                  Cho phép thông báo trong ứng dụng
                </label>
                <div className="callout">
                  Kênh Zalo/email chưa được kết nối. Thiết lập này không tự gửi
                  tin ra bên ngoài.
                </div>
                <div className="form-actions">
                  <Button type="submit">Lưu cài đặt</Button>
                </div>
              </form>
            </div>
          </Panel>
        )}
        {active === "Dữ liệu & hỗ trợ" && (
          <div className="stack">
            <Panel title="Dữ liệu bản dùng thử">
              <div className="panel-body stack">
                <p className="tiny">
                  Thay đổi được lưu trên trình duyệt hiện tại. Tải bản sao để
                  giữ lại dữ liệu bạn đã thử.
                </p>
                <Button
                  variant="secondary"
                  onClick={() => {
                    const blob = new Blob([JSON.stringify(data, null, 2)], {
                      type: "application/json",
                    })
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement("a")
                    a.href = url
                    a.download = "waremap-demo.json"
                    a.click()
                    setTimeout(() => URL.revokeObjectURL(url), 1000)
                  }}
                >
                  <DownloadIcon size={16} />
                  Tải bản sao dữ liệu
                </Button>
              </div>
            </Panel>
            <Panel title="Hỗ trợ tài khoản">
              <div className="panel-body stack">
                <p className="tiny">
                  Gửi yêu cầu thay đổi vai trò, khóa tài khoản hoặc hỗ trợ sử
                  dụng. WareMap xét duyệt các yêu cầu tài khoản.
                </p>
                <Button
                  variant="secondary"
                  onClick={() => setConnection("Yêu cầu hỗ trợ")}
                >
                  Gửi yêu cầu hỗ trợ
                </Button>
              </div>
            </Panel>
            <Panel title="Cập nhật sản phẩm">
              <div className="panel-body">
                <Badge>Phiên bản {data.release}</Badge>
                <p className="tiny" style={{ marginTop: 12 }}>
                  {data.releaseNote}
                </p>
              </div>
            </Panel>
          </div>
        )}
      </div>
      {connection && (
        <Modal title={connection} close={() => setConnection("")}>
          <div className="stack">
            {connection === "Yêu cầu hỗ trợ" ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  const f = new FormData(e.currentTarget)
                  update((d) => ({
                    ...d,
                    requests: [
                      {
                        id: "HT-" + Date.now().toString().slice(-6),
                        kind: "Hỗ trợ tài khoản",
                        company: d.company,
                        name: "Chủ doanh nghiệp",
                        email: String(f.get("email")),
                        branches: d.locations,
                        count: 0,
                        reason: String(f.get("reason")),
                        role: "manager",
                        branch: branches[0],
                        status: "Chờ duyệt",
                        note: "",
                        date: today(),
                      },
                      ...d.requests,
                    ],
                  }))
                  setConnection("")
                  notify("Đã lưu yêu cầu hỗ trợ trong bản demo.")
                }}
              >
                <label className="field">
                  Email liên hệ
                  <input name="email" type="email" required />
                </label>
                <label className="field">
                  Nội dung yêu cầu
                  <textarea
                    name="reason"
                    required
                    placeholder="Nêu nhân viên, cơ sở và thay đổi cần hỗ trợ…"
                  />
                </label>
                <Button type="submit">Lưu yêu cầu minh họa</Button>
              </form>
            ) : (
              <>
                <Badge>Chưa kết nối</Badge>
                <p>
                  Để sử dụng {connection}, cần cấu hình dịch vụ cho doanh nghiệp
                  và xác nhận quyền truy cập.
                </p>
                <div className="callout">
                  Bản demo chưa có máy chủ kết nối. Không yêu cầu nhập token
                  hoặc mật khẩu thật tại đây.
                </div>
                <Button variant="secondary" onClick={() => setConnection("")}>
                  Đã hiểu
                </Button>
              </>
            )}
          </div>
        </Modal>
      )}
      {request && (
        <Modal title="Yêu cầu thay đổi hạn mức" close={() => setRequest(false)}>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              const f = new FormData(e.currentTarget)
              update((d) => ({
                ...d,
                requests: [
                  {
                    id: "HM-" + Date.now().toString().slice(-6),
                    kind: "Tăng hạn mức",
                    company: d.company,
                    name: "Chủ doanh nghiệp",
                    email: String(f.get("email")),
                    branches: locations,
                    count: staff,
                    reason: String(f.get("reason")),
                    role: "manager",
                    branch: branches[0],
                    status: "Chờ duyệt",
                    note: "",
                    date: today(),
                  },
                  ...d.requests,
                ],
              }))
              setRequest(false)
              notify(
                "Yêu cầu hạn mức đã được lưu để WareMap duyệt trong bản demo.",
              )
            }}
          >
            <div className="form-grid">
              <label className="field">
                Tổng số cơ sở cần dùng
                <input
                  type="number"
                  min={data.locations}
                  max={500}
                  required
                  value={locations}
                  onChange={(e) => setLocations(Number(e.target.value))}
                />
              </label>
              <label className="field">
                Tổng số tài khoản nhân viên
                <input
                  type="number"
                  min={Math.max(5, data.staff.length, data.allowance)}
                  max={500}
                  required
                  value={staff}
                  onChange={(e) => setStaff(Number(e.target.value))}
                />
              </label>
            </div>
            <label className="field">
              Email liên hệ
              <input name="email" type="email" required />
            </label>
            <label className="field">
              Lý do thay đổi
              <textarea name="reason" required />
            </label>
            <div className="callout">
              <strong>Dự kiến {money(preview.total)}/tháng</strong>
              <br />
              Gói {money(preview.base)} + cơ sở {money(preview.branchExtra)} +
              tài khoản {money(preview.staffExtra)}. Chưa thu phí.
            </div>
            <div className="form-actions">
              <Button variant="secondary" onClick={() => setRequest(false)}>
                Hủy
              </Button>
              <Button type="submit">Gửi yêu cầu minh họa</Button>
            </div>
          </form>
        </Modal>
      )}
    </>
  )
}
