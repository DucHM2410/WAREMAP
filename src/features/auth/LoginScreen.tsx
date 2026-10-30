import { ArrowLeft, ArrowRight, CheckCircle2, Eye, EyeOff } from "lucide-react"

import { useState } from "react"

import { useApp } from "../../app/store"

import { Brand, Button } from "../../app/ui"

import { branches, money, quote, today } from "../../app/model"

import { PublicFlowLayout, PublicFlowHeading } from "./PublicFlowLayout"

import { MiniMap } from "../public-home/PublicHomeScreen"

import { DEMO_ACCOUNTS, DEMO_PASSWORD } from "../../shared/config/demoRoles"

export default function Login() {
  const { go, authenticate, startGuest } = useApp()

  const [email, setEmail] = useState("")

  const [password, setPassword] = useState("")

  const [visible, setVisible] = useState(false),
    [message, setMessage] = useState("")

  const enterWorkspace = () => {
    startGuest("explore")
  }

  return (
    <div className="auth-page">
      <section className="auth-story">
        <Brand />
        <div>
          <span className="eyebrow" style={{ color: "#A9CFF8" }}>
            Rõ vị trí. Dễ vận hành.
          </span>
          <h1>
            Một góc nhìn rõ hơn
            <br />
            về kho của bạn.
          </h1>
          <p>Cùng một sơ đồ, cả đội biết hàng ở đâu và việc gì cần xử lý.</p>
          <MiniMap />
        </div>
        <p className="tiny">WareMap System</p>
      </section>
      <section className="auth-form-side">
        <div className="auth-card">
          <div className="auth-card-header">
            <Brand />
            <Button variant="ghost" onClick={() => go("home")}>
              <ArrowLeft size={15} />
              Về trang chủ
            </Button>
          </div>
          <h1>Đăng nhập</h1>
          <p>Tiếp tục quản lý kho hàng của bạn.</p>
          <form
            onSubmit={(e) => {
              e.preventDefault()

              const form = new FormData(e.currentTarget)

              if (
                !authenticate(
                  String(form.get("email")),

                  String(form.get("password")),
                )
              ) {
                setMessage(
                  "Thông tin demo chưa đúng. Chọn một vai trò bên dưới hoặc dùng email demo với mật khẩu WareMap@123.",
                )

                return
              }
            }}
          >
            <label className="field">
              Email
              <input
                required
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ban@doanhnghiep.vn"
                autoComplete="username"
              />
            </label>
            <label className="field">
              Mật khẩu
              <div className="row" style={{ gap: 5 }}>
                <input
                  required
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={visible ? "text" : "password"}
                  placeholder="Nhập mật khẩu"
                  autoComplete="current-password"
                />
                <Button
                  variant="ghost"
                  aria-label={visible ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  onClick={() => setVisible((v) => !v)}
                >
                  {visible ? <EyeOff size={18} /> : <Eye size={18} />}
                </Button>
              </div>
            </label>
            <div className="row between">
              <label className="check-row">
                <input type="checkbox" />
                Ghi nhớ đăng nhập
              </label>
              <Button
                variant="ghost"
                onClick={() =>
                  setMessage(
                    "Để khôi phục tài khoản, gửi yêu cầu hỗ trợ qua mục Yêu cầu sử dụng.",
                  )
                }
              >
                Quên mật khẩu?
              </Button>
            </div>
            <Button type="submit">
              Đăng nhập
              <ArrowRight size={16} />
            </Button>
            {message && (
              <p className="callout" role="status">
                {message}
              </p>
            )}
          </form>
          <hr />
          <section
            className="demo-accounts"
            aria-label="Tài khoản demo theo vai trò"
          >
            <h2>Tài khoản demo · cần đăng nhập</h2>
            <p>
              Dữ liệu mẫu lưu trên trình duyệt. Đây là tài khoản demo cục bộ,
              chưa phải tài khoản dịch vụ thực.
            </p>
            <p>
              Mật khẩu chung: <code>{DEMO_PASSWORD}</code>
            </p>
            {DEMO_ACCOUNTS.map((account) => (
              <button
                type="button"
                className="demo-account"
                key={account.role}
                onClick={() => {
                  setEmail(account.email)

                  setPassword(DEMO_PASSWORD)

                  setMessage(
                    "Đã điền tài khoản demo. Bấm Đăng nhập để tiếp tục.",
                  )

                  window.scrollTo({ top: 0, behavior: "smooth" })
                }}
              >
                <span>
                  <strong>{account.label}</strong>
                  <small>
                    {account.email} · {account.scope}
                  </small>
                  <p>{account.description}</p>
                </span>
                <ArrowRight size={18} />
              </button>
            ))}
          </section>
          <Button className="full" variant="secondary" onClick={enterWorkspace}>
            Khám phá kho mẫu
          </Button>
          <div className="auth-bottom">
            Chưa có tài khoản?{" "}
            <Button variant="ghost" onClick={() => go("request")}>
              Yêu cầu cấp tài khoản
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

export function RequestAccess() {
  const { go, submitRequest, requestedPlan, requestFromExperience } = useApp()

  const [done, setDone] = useState("")

  const [locations, setLocations] = useState(requestedPlan === "chain" ? 5 : 1)

  const [count, setCount] = useState(requestedPlan === "chain" ? 18 : 4)

  const [plan, setPlan] = useState(requestedPlan)

  const price = quote(locations, count)

  const free = plan === "free"

  const chain = plan === "chain"

  const planName = free ? "Free Trial" : chain ? "Chuỗi" : "Đơn lẻ"

  const title = free
    ? "Đăng ký dùng thử miễn phí 7 ngày"
    : `Đăng ký gói ${planName}`

  const baseAccounts = chain ? 18 : 4

  const extra = !free && count > baseAccounts

  return (
    <PublicFlowLayout
      experienceParent={requestFromExperience}
      current={
        done
          ? "Đã gửi yêu cầu"
          : free
            ? "Đăng ký dùng thử"
            : `Đăng ký gói ${planName}`
      }
    >
      {done ? (
        <section
          className="registration-success"
          aria-labelledby="request-success-title"
          role="status"
        >
          <span className="registration-success-icon">
            <CheckCircle2 size={36} />
          </span>
          <span className="eyebrow">Yêu cầu đã được ghi nhận</span>
          <h1 id="request-success-title">Cảm ơn bạn đã chọn WareMap</h1>
          <p>Yêu cầu đăng ký {planName} đang chờ WareMap xét duyệt.</p>
          <dl>
            <div>
              <dt>Mã yêu cầu</dt>
              <dd>{done}</dd>
            </div>
            <div>
              <dt>Gói đăng ký</dt>
              <dd>{planName}</dd>
            </div>
            <div>
              <dt>Trạng thái</dt>
              <dd>Chờ duyệt</dd>
            </div>
            <div>
              <dt>Nhu cầu</dt>
              <dd>
                {locations} cơ sở · {count + 1} tài khoản gồm Chủ doanh
              </dd>
            </div>
          </dl>
          <p className="public-flow-demo-note">
            Bản demo — yêu cầu được lưu trên trình duyệt này và xuất hiện trong
            màn Admin WareMap. Chưa gửi ra bên ngoài hoặc tạo tài khoản đăng
            nhập thật.
          </p>
          <Button onClick={() => go("trial-info")}>
            Khám phá demo WareMap <ArrowRight size={16} />
          </Button>
        </section>
      ) : (
        <>
          <PublicFlowHeading
            eyebrow="Bắt đầu cùng WareMap"
            title={title}
            description="Cho chúng mình biết về doanh nghiệp của bạn. WareMap sẽ tiếp nhận yêu cầu và hỗ trợ cấp tài khoản."
          />
          <div className="registration-layout">
            <aside
              className="registration-plan"
              aria-label="Thông tin gói đăng ký"
            >
              <div className="registration-plan-top">
                <span className="eyebrow">Gói bạn chọn</span>
                <span className="registration-plan-tag">
                  {free ? "Trải nghiệm 7 ngày" : "Thanh toán hàng tháng"}
                </span>
              </div>
              <h2>{planName}</h2>
              <div className="registration-price">
                {money(free ? 0 : price.base)}
                <small> / {free ? "7 ngày" : "tháng"}</small>
              </div>
              <label className="field">
                Đổi gói
                <select
                  aria-label="Đổi gói"
                  value={plan}
                  onChange={(e) => {
                    const next = e.target.value as typeof plan

                    setPlan(next)

                    setLocations(next === "chain" ? 5 : 1)

                    setCount(next === "chain" ? 18 : 4)
                  }}
                >
                  <option value="free">Free Trial · 0đ / 7 ngày</option>
                  <option value="single">Đơn lẻ · 149.000đ/tháng</option>
                  <option value="chain">Chuỗi · 399.000đ/tháng</option>
                </select>
              </label>
              <div className="registration-entitlements">
                <h3>Quyền lợi có sẵn</h3>
                <ul>
                  <li>{chain ? "Tối đa 5 cơ sở" : "1 cơ sở"}</li>
                  <li>1 Chủ doanh</li>
                  <li>{chain ? 3 : 1} Quản lý kho</li>
                  <li>{chain ? 15 : 3} Nhân viên</li>
                </ul>
              </div>
              <ul className="registration-features">
                <li>Thiết kế kho 3D, QR Kệ và QR Lô</li>
                <li>Nhập xuất, kiểm kê, quản lý lô và FEFO</li>
                <li>
                  {chain
                    ? "Quản lý đa cơ sở và đối soát chuyển kho"
                    : "Báo cáo và phân quyền theo vai trò"}
                </li>
              </ul>
              {!free && (
                <details className="registration-expansion">
                  <summary>Điều chỉnh nhu cầu mở rộng</summary>
                  {chain && (
                    <label className="field">
                      Số cơ sở
                      <input
                        form="registration-form"
                        required
                        type="number"
                        min={2}
                        max={500}
                        value={locations}
                        onChange={(e) => setLocations(Number(e.target.value))}
                      />
                      <small>
                        Vượt 5 cơ sở: 199.000đ/tháng cho mỗi block 2 cơ sở.
                      </small>
                    </label>
                  )}
                  <label className="field">
                    Quản lý kho & Nhân viên
                    <input
                      form="registration-form"
                      required
                      type="number"
                      min={baseAccounts}
                      max={500}
                      value={count}
                      onChange={(e) => setCount(Number(e.target.value))}
                    />
                    <small>
                      Không gồm Chủ doanh. Thêm 2 tài khoản: 99.000đ một lần, tự
                      phân quyền.
                    </small>
                  </label>
                </details>
              )}
              <dl className="registration-costs">
                <div>
                  <dt>{free ? "Phí dùng thử" : "Thuê bao dự kiến"}</dt>
                  <dd>
                    {money(free ? 0 : price.total)} /{" "}
                    {free ? "7 ngày" : "tháng"}
                  </dd>
                </div>
                {!free && price.staffExtra > 0 && (
                  <div>
                    <dt>Tài khoản bổ sung</dt>
                    <dd>{money(price.staffExtra)} một lần</dd>
                  </div>
                )}
              </dl>
            </aside>
            <section
              className="registration-form-card"
              aria-labelledby="registration-form-title"
            >
              <h2 id="registration-form-title">Thông tin đăng ký</h2>
              <p>
                Điền thông tin liên hệ để WareMap tiếp nhận yêu cầu của bạn.
              </p>
              <form
                id="registration-form"
                onSubmit={(e) => {
                  e.preventDefault()

                  const f = new FormData(e.currentTarget)

                  const id = "YC-" + Date.now().toString().slice(-6)

                  submitRequest({
                    id,

                    kind: "Đăng ký sử dụng",

                    company: String(f.get("company")).trim(),

                    name: String(f.get("name")).trim(),

                    email: String(f.get("email")).trim(),

                    branches: locations,

                    count,

                    reason: `${planName} · ${
                      free ? "0đ/7 ngày" : money(price.total) + "/tháng"
                    } · 1 Chủ doanh + ${chain ? 3 : 1} Quản lý kho + ${
                      chain ? 15 : 3
                    } Nhân viên · Nhu cầu ${locations} cơ sở, ${count} tài khoản ngoài Chủ doanh${
                      !free
                        ? " · Phí tài khoản bổ sung " +
                          money(price.staffExtra) +
                          " một lần"
                        : ""
                    } · ${String(f.get("reason") || "Không có ghi chú")}`,

                    role: "manager",

                    branch: branches[0],

                    status: "Chờ duyệt",

                    note: "",

                    date: today(),
                  })

                  setDone(id)

                  window.scrollTo({ top: 0 })
                }}
              >
                <label className="field">
                  Tên người liên hệ
                  <input
                    name="name"
                    required
                    autoComplete="name"
                    placeholder="Nguyễn Văn An"
                  />
                </label>
                <label className="field">
                  Email liên hệ
                  <input
                    name="email"
                    required
                    type="email"
                    autoComplete="email"
                    placeholder="ban@doanhnghiep.vn"
                  />
                </label>
                <label className="field">
                  Tên doanh nghiệp
                  <input
                    name="company"
                    required
                    autoComplete="organization"
                    placeholder="Tên cửa hàng hoặc doanh nghiệp"
                  />
                </label>
                <label className="field">
                  {extra
                    ? "Vai trò và lý do cần thêm tài khoản"
                    : "Ghi chú thêm (tùy chọn)"}
                  <textarea
                    name="reason"
                    required={extra}
                    placeholder={
                      extra
                        ? "Bạn cần thêm bao nhiêu Quản lý kho, Nhân viên và vì sao?"
                        : "Chia sẻ thêm nhu cầu hoặc điều bạn muốn được hỗ trợ…"
                    }
                  />
                </label>
                <Button type="submit">
                  {free ? "Gửi yêu cầu dùng thử" : "Gửi yêu cầu đăng ký"}
                  <ArrowRight size={16} />
                </Button>
                <p className="public-flow-demo-note">
                  Bản demo — yêu cầu được lưu trên trình duyệt, chưa gửi đến
                  dịch vụ bên ngoài. WareMap là bên xét duyệt và cấp tài khoản.
                </p>
              </form>
            </section>
          </div>
        </>
      )}
    </PublicFlowLayout>
  )
}
