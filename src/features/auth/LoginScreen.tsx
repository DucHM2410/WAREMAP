import { ArrowLeft, ArrowRight, CheckCircle2, Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { useApp } from "../../app/store"
import { Badge, Brand, Button, Panel } from "../../app/ui"
import { branches, money, quote, today } from "../../app/model"
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
              if (!authenticate(String(form.get("email")), String(form.get("password")))) {
                setMessage("Thông tin demo chưa đúng. Chọn một vai trò bên dưới hoặc dùng email demo với mật khẩu WareMap@123.")
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
                value={email} onChange={e => setEmail(e.target.value)}
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
                  value={password} onChange={e => setPassword(e.target.value)}
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
          <section className="demo-accounts" aria-label="Tài khoản demo theo vai trò">
            <h2>Tài khoản demo · cần đăng nhập</h2>
            <p>Dữ liệu mẫu lưu trên trình duyệt. Đây là tài khoản demo cục bộ, chưa phải tài khoản dịch vụ thực.</p>
            <p>Mật khẩu chung: <code>{DEMO_PASSWORD}</code></p>
            {DEMO_ACCOUNTS.map(account => <button type="button" className="demo-account" key={account.role} onClick={() => { setEmail(account.email); setPassword(DEMO_PASSWORD); setMessage("Đã điền tài khoản demo. Bấm Đăng nhập để tiếp tục."); window.scrollTo({ top: 0, behavior: "smooth" }) }}>
              <span><strong>{account.label}</strong><small>{account.email} · {account.scope}</small><p>{account.description}</p></span><ArrowRight size={18} />
            </button>)}
          </section>
          <Button
            className="full"
            variant="secondary"
            onClick={enterWorkspace}
          >
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
  const { go, submitRequest, requestedPlan } = useApp()
  const [done, setDone] = useState(""),
    [locations, setLocations] = useState(requestedPlan === "chain" ? 5 : 1),
    [count, setCount] = useState(requestedPlan === "chain" ? 18 : 4),
    [plan, setPlan] = useState(requestedPlan)
  const price = quote(locations, count)
  return (
    <div className="request-page">
      <button className="brand-button" onClick={() => go("home")}>
        <Brand />
      </button>
      {done ? (
        <Panel>
          <div className="empty">
            <CheckCircle2
              size={42}
              color="#087e8b"
              style={{ margin: "0 auto 20px" }}
            />
            <h1>Yêu cầu đã được ghi nhận</h1>
            <p>Mã {done} · Chờ WareMap xét duyệt.</p>
            <div className="callout">
              Đây là yêu cầu minh họa, lưu trên trình duyệt này. Chưa gửi đến
              dịch vụ bên ngoài và chưa tạo tài khoản hoạt động.
            </div>
            <div
              className="row"
              style={{ justifyContent: "center", marginTop: 20 }}
            >
              <Button onClick={() => go("home")}>Về trang chủ</Button>
            </div>
          </div>
        </Panel>
      ) : (
        <>
          <span className="eyebrow">Bắt đầu với WareMap System</span>
          <h1>Yêu cầu sử dụng</h1>
          <p>Cho chúng mình biết mô hình và nhu cầu tài khoản của bạn.</p>
          <Panel>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const f = new FormData(e.currentTarget)
                const id = "YC-" + Date.now().toString().slice(-6)
                submitRequest({
                      id,
                      kind: "Đăng ký sử dụng",
                      company: String(f.get("company")),
                      name: String(f.get("name")),
                      email: String(f.get("email")),
                      branches: locations,
                      count,
                      reason: `${
                        plan === "free" ? "Free Trial 0đ/7 ngày · 1 Chủ doanh + 1 Quản lý kho + 3 Nhân viên" : plan === "single" ? "Đơn lẻ 149.000đ/tháng · 1 Chủ doanh + 1 Quản lý kho + 3 Nhân viên" : "Chuỗi 399.000đ/tháng · 1 Chủ doanh + 3 Quản lý kho + 15 Nhân viên"
                      } · ${f.get("reason")}`,
                      role: "manager",
                      branch: branches[0],
                      status: "Chờ duyệt",
                      note: "",
                      date: today(),
                })
                setDone(id)
              }}
            >
              <div className="form-grid">
                <label className="field">
                  Tên người liên hệ
                  <input required name="name" autoComplete="name" />
                </label>
                <label className="field">
                  Email liên hệ
                  <input
                    required
                    name="email"
                    type="email"
                    autoComplete="email"
                  />
                </label>
              </div>
              <label className="field">
                Tên doanh nghiệp
                <input required name="company" />
              </label>
              <label className="field">
                Gói quan tâm
                <select value={plan} onChange={(e) => {
                  const next = e.target.value as typeof plan
                  setPlan(next)
                  setLocations(next === "chain" ? 5 : 1)
                  setCount(next === "chain" ? 18 : 4)
                }}>
                  <option value="free">Free Trial · 0đ / 7 ngày</option>
                  <option value="single">Đơn lẻ · 149.000đ/tháng</option>
                  <option value="chain">Chuỗi · 399.000đ/tháng</option>
                </select>
              </label>
              <div className="form-grid">
                <label className="field">
                  Số cơ sở
                  <input
                    type="number"
                    required
                    max={500}
                    disabled={plan !== "chain"}
                    min={plan === "chain" ? 2 : 1}
                    value={locations}
                    onChange={(e) => setLocations(Number(e.target.value))}
                  />
                </label>
                <label className="field">
                  Số tài khoản Quản lý kho & Nhân viên
                  <input
                    type="number"
                    required
                    min={plan === "chain" ? 18 : 4}
                    max={500}
                    disabled={plan === "free"}
                    value={count}
                    onChange={(e) => setCount(Number(e.target.value))}
                  />
                  <small>Chưa bao gồm 1 Chủ doanh. {plan === "chain" ? "Gói gồm 3 Quản lý kho + 15 Nhân viên, dùng chung tối đa 5 cơ sở." : "Gói gồm 1 Quản lý kho + 3 Nhân viên."} {plan !== "free" && "Tài khoản vượt hạn mức mua theo block 2 tài khoản."}</small>
                </label>
              </div>
              <label className="field">
                Vai trò và lý do cần số lượng tài khoản trên
                <textarea
                  name="reason"
                  required
                  placeholder="Ví dụ: 2 quản lý kho, 3 nhân viên làm việc theo ca…"
                />
              </label>
              <div className="callout">
                {plan === "free" ? (
                  "Free Trial 0đ/7 ngày: 1 cơ sở, 1 Chủ doanh + 1 Quản lý kho + 3 Nhân viên."
                ) : (
                  <>
                    <strong>Chi phí dự kiến: {money(price.total)}/tháng</strong>
                    <br />
                    Gói cơ bản {money(price.base)}/tháng + cơ sở bổ sung{" "}
                    {money(price.branchExtra)}/tháng. Tài khoản bổ sung{" "}
                    {money(price.staffExtra)} thanh toán một lần. Chưa bao gồm phí tài khoản trong thuê bao tháng.
                  </>
                )}
              </div>
              <p className="tiny muted">
                Yêu cầu được lưu trong bản demo. WareMap là bên xét duyệt và cấp
                tài khoản.
              </p>
              <div className="form-actions">
                <Button variant="secondary" onClick={() => go("home")}>
                  Quay lại
                </Button>
                <Button type="submit">
                  Gửi yêu cầu minh họa
                  <ArrowRight size={15} />
                </Button>
              </div>
            </form>
          </Panel>
        </>
      )}
    </div>
  )
}
