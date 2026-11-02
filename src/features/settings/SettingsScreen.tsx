import {
  Calculator,
  Building2,
  BellRing,
  Check,
  CheckCircle2,
  CircleHelp,
  Download as DownloadIcon,
  Layers3,
  MessageCircle,
  Minus,
  PackageCheck,
  Plus,
  RefreshCw,
  Send,
  ShieldCheck,
  UserRoundPlus,
} from "lucide-react"
import { useState } from "react"
import { useApp } from "../../app/store"
import { branches, money, quote, today } from "../../app/model"
import { Badge, Button, Modal, PageTitle, Panel } from "../../app/ui"
import "./settings.css"
export default function Settings() {
  const { data, update, notify, role } = useApp()
  const [tab, setTab] = useState("Gói & hạn mức"),
    [company, setCompany] = useState(data.company),
    [threshold, setThreshold] = useState(data.settings.expiryDays),
    [enabled, setEnabled] = useState(data.settings.notifications),
    [request, setRequest] = useState(false),
    [plan, setPlan] = useState<"single" | "chain">(
      data.locations === 1 ? "single" : "chain",
    ),
    [branchBlocks, setBranchBlocks] = useState(() =>
      data.locations > 1
        ? Math.ceil(Math.max(0, data.locations - 5) / 2)
        : 0,
    ),
    [accountBlocks, setAccountBlocks] = useState(() =>
      Math.ceil(
        Math.max(0, data.allowance - (data.locations === 1 ? 4 : 18)) / 2,
      ),
    ),
    [connection, setConnection] = useState("")
  const requestedLocations =
    plan === "single" ? 1 : 5 + branchBlocks * 2
  const requestedStaff = (plan === "single" ? 4 : 18) + accountBlocks * 2
  const preview = quote(requestedLocations, requestedStaff)
  const planTitle = plan === "single" ? "Gói Đơn lẻ" : "Gói Chuỗi"
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
        action={
          role === "owner" ? (
            <Button onClick={() => setRequest(true)}>
              <Send size={15} />
              Yêu cầu thay đổi hạn mức
            </Button>
          ) : undefined
        }
      />
      <div className="setting-tabs settings-tabs">
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
          <div className="settings-plan">
            <section className="settings-trial">
              <div className="settings-trial__intro">
                <div className="settings-trial__title">
                  <h2>{data.trialDemo ? "Free Trial demo · 7 ngày" : planTitle}</h2>
                  <Badge tone="info">{data.trialDemo ? "Gói minh họa" : "Đang sử dụng"}</Badge>
                </div>
                <div className="settings-trial__note">
                  <strong><CircleHelp size={15} />{data.trialDemo ? "Quyền lợi Free Trial trong 7 ngày" : "Hạn mức gói hiện tại"}</strong>
                  <span>{data.trialDemo ? "1 cơ sở · 1 Chủ doanh nghiệp + 1 Quản lý kho + 3 Nhân viên" : `Gói ${data.locations === 1 ? "Đơn lẻ" : "Chuỗi"} · ${data.locations} cơ sở · ${data.allowance} tài khoản quản lý và nhân viên`}</span>
                  <small>Tài khoản Chủ doanh nghiệp được tính riêng; số liệu là hạn mức được cấp.</small>
                </div>
              </div>
              <div className="settings-trial__metrics">
                <div className="settings-metric">
                  <span>Hạn mức cơ sở</span>
                  <strong>{data.locations}</strong>
                  <small>{data.locations} cơ sở đang dùng</small>
                </div>
                <div className="settings-metric settings-metric--accent">
                  <span>Quản lý kho &amp; nhân viên</span>
                  <strong>{data.staff.length}<small> / {data.allowance}</small></strong>
                  <small>Chủ doanh nghiệp tính riêng</small>
                </div>
              </div>
            </section>

            <section className="settings-section">
              <div className="settings-section__heading">
                <Layers3 size={17} />
                <h3>Chọn gói dịch vụ chính</h3>
              </div>
              <div className="settings-plan-cards">
                <button
                  type="button"
                  className={`settings-plan-card ${plan === "single" ? "is-selected" : ""}`}
                  aria-pressed={plan === "single"}
                  onClick={() => {
                    setPlan("single")
                    setBranchBlocks(0)
                  }}
                >
                  <span className="settings-plan-card__top">
                    <span>
                      <small>Cửa hàng độc lập</small>
                      <strong>Gói Đơn lẻ</strong>
                    </span>
                    <span className="settings-plan-card__price">{money(149000)}<small>/tháng</small></span>
                  </span>
                  <span className="settings-plan-card__description">Dành cho doanh nghiệp kinh doanh tại một cơ sở duy nhất.</span>
                  <span className="settings-plan-card__features">
                    <span><Check size={14} />1 cơ sở chuẩn 3D Builder</span>
                    <span><Check size={14} />4 tài khoản quản lý &amp; nhân viên</span>
                    <span><Check size={14} />Quét QR, FEFO và cảnh báo Zalo OA</span>
                  </span>
                  <span className="settings-plan-card__selection">
                    {plan === "single" ? <><CheckCircle2 size={16} /> Đang chọn</> : "Chọn gói Đơn lẻ"}
                  </span>
                </button>
                <button
                  type="button"
                  className={`settings-plan-card settings-plan-card--chain ${plan === "chain" ? "is-selected" : ""}`}
                  aria-pressed={plan === "chain"}
                  onClick={() => setPlan("chain")}
                >
                  <span className="settings-plan-card__top">
                    <span>
                      <small>Đa chi nhánh</small>
                      <strong>Gói Chuỗi</strong>
                    </span>
                    <span className="settings-plan-card__price">{money(399000)}<small>/tháng</small></span>
                  </span>
                  <span className="settings-plan-card__description">Dành cho chuỗi bán lẻ cần quản lý nhiều địa điểm.</span>
                  <span className="settings-plan-card__features">
                    <span><Check size={14} />Quản lý tối đa 5 cơ sở</span>
                    <span><Check size={14} />18 tài khoản quản lý &amp; nhân viên</span>
                    <span><Check size={14} />Quản lý hàng In-Transit &amp; chuyển kho</span>
                  </span>
                  <span className="settings-plan-card__selection">
                    {plan === "chain" ? <><CheckCircle2 size={16} /> Đang chọn</> : "Chọn gói Chuỗi"}
                  </span>
                </button>
              </div>
            </section>

            <section className="settings-section">
              <div className="settings-section__heading">
                <Plus size={17} />
                <h3>Khối dịch vụ bổ sung</h3>
              </div>
              <div className="settings-addon-grid">
                <div className="settings-addon">
                  <div className="settings-addon__heading">
                    <span className="settings-addon__icon"><Building2 size={17} /></span>
                    <div><strong>Block cơ sở bổ sung</strong><small>Thêm tối đa 2 cơ sở / block; chỉ áp dụng cho gói Chuỗi.</small></div>
                    <b>{money(199000)}<small>/tháng</small></b>
                  </div>
                  <div className="settings-addon__controls">
                    <span>Số lượng block đăng ký</span>
                    <div className="settings-stepper">
                      <button type="button" aria-label="Giảm block cơ sở" disabled={plan !== "chain" || branchBlocks === 0} onClick={() => setBranchBlocks((value) => Math.max(0, value - 1))}><Minus size={14} /></button>
                      <strong>{branchBlocks}</strong>
                      <button type="button" aria-label="Tăng block cơ sở" disabled={plan !== "chain"} onClick={() => setBranchBlocks((value) => value + 1)}><Plus size={14} /></button>
                    </div>
                  </div>
                </div>
                <div className="settings-addon">
                  <div className="settings-addon__heading">
                    <span className="settings-addon__icon settings-addon__icon--staff"><UserRoundPlus size={17} /></span>
                    <div><strong>Block tài khoản bổ sung</strong><small>Mỗi block thêm 2 tài khoản Quản lý kho hoặc Nhân viên.</small></div>
                    <b>{money(99000)}<small>một lần</small></b>
                  </div>
                  <div className="settings-addon__controls">
                    <span>Số lượng block mua thêm</span>
                    <div className="settings-stepper">
                      <button type="button" aria-label="Giảm block tài khoản" disabled={accountBlocks === 0} onClick={() => setAccountBlocks((value) => Math.max(0, value - 1))}><Minus size={14} /></button>
                      <strong>{accountBlocks}</strong>
                      <button type="button" aria-label="Tăng block tài khoản" onClick={() => setAccountBlocks((value) => value + 1)}><Plus size={14} /></button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="settings-summary">
              <div className="settings-section__heading">
                <Calculator size={17} />
                <h3>Tổng dự kiến chi phí dịch vụ</h3>
              </div>
              <dl className="settings-summary__rows">
                <div><dt>Gói cơ bản đã chọn</dt><dd>{planTitle} · {money(preview.base)}/tháng</dd></div>
                <div><dt>Block cơ sở bổ sung ({branchBlocks} block)</dt><dd>{money(preview.branchExtra)}/tháng</dd></div>
                <div><dt>Block tài khoản bổ sung ({accountBlocks} block)</dt><dd>{money(preview.staffExtra)} một lần</dd></div>
              </dl>
              <div className="settings-summary__total">
                <div>
                  <span>Phí định kỳ hàng tháng</span>
                  <strong>{money(preview.total)}<small>/tháng</small></strong>
                  <small>Phí một lần (nếu có): {money(preview.staffExtra)}</small>
                </div>
                <Button onClick={() => setRequest(true)}><Send size={15} />Yêu cầu thay đổi hạn mức</Button>
              </div>
              <p className="settings-policy">Đơn lẻ: 149.000đ/tháng (1 Chủ doanh + 1 Quản lý + 3 Nhân viên). Chuỗi: 399.000đ/tháng (1 Chủ doanh + 3 Quản lý + 15 Nhân viên). Thêm 2 cơ sở: 199.000đ/tháng, chỉ gói Chuỗi. Thêm 2 tài khoản: 99.000đ một lần. Chủ doanh nghiệp được tính riêng; yêu cầu do WareMap xét duyệt, bản demo không thu phí.</p>
            </section>
          </div>
        )}
        {active === "Kết nối" && (
          <div className="settings-connections">
            <section className="settings-connection-intro">
              <span className="settings-connection-intro__icon">
                <MessageCircle size={18} />
              </span>
              <div>
                <h2>Kết nối dịch vụ · Zalo OA</h2>
                <p>
                  Quản lý kênh gửi thông báo Zalo OA cho các hoạt động trong
                  kho.
                </p>
              </div>
              <Badge>1 dịch vụ</Badge>
            </section>

            <section className="settings-oa-card">
              <div className="settings-oa-card__header">
                <div className="settings-oa-card__identity">
                  <span className="settings-oa-card__logo" aria-hidden="true">
                    Z
                  </span>
                  <div>
                    <div className="settings-oa-card__title">
                      <h3>Zalo Official Account</h3>
                      <Badge>Chưa kết nối</Badge>
                    </div>
                    <p>
                      Kết nối OA của doanh nghiệp để nhận thông báo vận hành qua
                      Zalo.
                    </p>
                  </div>
                </div>
                <Button
                  variant="secondary"
                  onClick={() => setConnection("Zalo OA")}
                >
                  <MessageCircle size={15} />
                  Hướng dẫn kết nối
                </Button>
              </div>

              <div className="settings-oa-card__details">
                <div>
                  <ShieldCheck size={16} />
                  <span>
                    <strong>Quyền truy cập</strong>
                    <small>Chưa cấp quyền cho WareMap</small>
                  </span>
                </div>
                <div>
                  <RefreshCw size={16} />
                  <span>
                    <strong>Đồng bộ gần nhất</strong>
                    <small>Chưa có dữ liệu đồng bộ</small>
                  </span>
                </div>
                <div>
                  <BellRing size={16} />
                  <span>
                    <strong>Thông báo Zalo</strong>
                    <small>Sẽ khả dụng sau khi kết nối OA</small>
                  </span>
                </div>
              </div>
            </section>

            <section className="settings-zns-section">
              <div className="settings-section__heading">
                <BellRing size={17} />
                <h3>Kịch bản thông báo Zalo</h3>
              </div>
              <p className="settings-zns-section__description">
                Chọn các thông báo muốn gửi sau khi OA được kết nối.
              </p>
              <div className="settings-zns-grid">
                <article className="settings-zns-item">
                  <span className="settings-zns-item__icon settings-zns-item__icon--expiry">
                    <BellRing size={17} />
                  </span>
                  <div>
                    <strong>Cảnh báo lô cận hạn</strong>
                    <p>Thông báo lô hàng sắp đến hạn sử dụng.</p>
                  </div>
                  <Badge>Chờ kết nối</Badge>
                </article>
                <article className="settings-zns-item">
                  <span className="settings-zns-item__icon settings-zns-item__icon--expired">
                    <ShieldCheck size={17} />
                  </span>
                  <div>
                    <strong>Cảnh báo lô quá hạn</strong>
                    <p>Nhắc kiểm tra và xử lý hàng đã quá hạn.</p>
                  </div>
                  <Badge>Chờ kết nối</Badge>
                </article>
                <article className="settings-zns-item">
                  <span className="settings-zns-item__icon settings-zns-item__icon--transfer">
                    <PackageCheck size={17} />
                  </span>
                  <div>
                    <strong>Cập nhật chuyển kho</strong>
                    <p>Thông báo trạng thái phiếu chuyển giữa các cơ sở.</p>
                  </div>
                  <Badge>Chờ kết nối</Badge>
                </article>
              </div>
            </section>

            <div className="settings-connection-notice">
              <CircleHelp size={17} />
              <p>
                Bản demo chưa có máy chủ kết nối Zalo OA. Không nhập token hoặc
                thông tin đăng nhập thật; các kịch bản thông báo chưa gửi tin
                ra bên ngoài.
              </p>
            </div>
          </div>
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
                  Zalo OA chưa được kết nối. Thiết lập này không tự gửi tin ra
                  bên ngoài.
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
                {role === "owner" && (<Button
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
                </Button>)}
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
        <Modal
          title="Yêu cầu thay đổi hạn mức"
          close={() => setRequest(false)}
          className="settings-request-modal"
        >
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
                    branches: requestedLocations,
                    count: requestedStaff,
                    reason: `${planTitle}; ${branchBlocks} block cơ sở; ${accountBlocks} block tài khoản. ${String(f.get("reason")).trim()}`,
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
            <div className="settings-request-summary">
              <p>Gói đăng ký: <strong>{planTitle} · {money(preview.base)}/tháng</strong></p>
              <p>Cơ sở: <strong>{requestedLocations} · {branchBlocks} block bổ sung</strong></p>
              <p>Tài khoản quản lý &amp; nhân viên: <strong>{requestedStaff} · {accountBlocks} block bổ sung</strong></p>
              <p>Phí dự kiến: <strong>{money(preview.total)}/tháng</strong> · {money(preview.staffExtra)} phí một lần</p>
            </div>
            <label className="field">
              Email liên hệ
              <input name="email" type="email" required />
            </label>
            <label className="field">
              Ghi chú yêu cầu
              <textarea name="reason" required placeholder="Cho WareMap biết thời điểm hoặc nhu cầu thay đổi hạn mức..." />
            </label>
            <div className="callout">
              Đây là yêu cầu minh họa để WareMap xét duyệt. Bản demo chưa thu phí hoặc thay đổi hạn mức đang sử dụng.
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
