import { ArrowLeft, ArrowRight, CheckCircle2, Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { useApp } from "../../app/store"
import { Badge, Brand, Button, Panel } from "../../app/ui"
import { branches, money, quote, today } from "../../app/model"
import { useIndustry } from "../../shared/context/IndustryContext"
import { MiniMap } from "../public-home/PublicHomeScreen"
import { DEMO_ACCOUNTS, DEMO_PASSWORD } from "../../shared/config/demoRoles"
export default function Login() {
  const { go, setRole } = useApp()
  const { hasSavedIndustry } = useIndustry()
  const [visible, setVisible] = useState(false),
    [message, setMessage] = useState("")

  const enterWorkspace = () => {
    setRole("owner")
    if (!hasSavedIndustry) go("industry-picker")
  }

  return (
    <div className="auth-page">
      <section className="auth-story">
        <Brand />
        <div>
          <span className="eyebrow" style={{ color: "#81c8cd" }}>
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
          <Brand />
          <Button variant="ghost" onClick={() => go("home")}>
            <ArrowLeft size={15} />
            Về trang chủ
          </Button>
          <h1>Đăng nhập</h1>
          <p>Tiếp tục quản lý kho hàng của bạn.</p>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              const form = new FormData(e.currentTarget)
              const account = DEMO_ACCOUNTS.find(a => a.email === String(form.get("email")).trim().toLowerCase())
              if (!account || form.get("password") !== DEMO_PASSWORD) {
                setMessage("Thông tin demo chưa đúng. Chọn một vai trò bên dưới hoặc dùng email demo với mật khẩu WareMap@123.")
                return
              }
              setRole(account.role)
            }}
          >
            <label className="field">
              Email
              <input
                required
                type="email"
                name="email"
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
            <h2>Thử trước theo vai trò</h2>
            <p>Dữ liệu mẫu lưu trên trình duyệt. Đây là tài khoản demo cục bộ, chưa phải tài khoản dịch vụ thực.</p>
            <p>Mật khẩu chung: <code>{DEMO_PASSWORD}</code></p>
            {DEMO_ACCOUNTS.map(account => <button type="button" className="demo-account" key={account.role} onClick={() => setRole(account.role)}>
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
  const { go, update, requestedPlan } = useApp()
  const [done, setDone] = useState(""),
    [locations, setLocations] = useState(1),
    [count, setCount] = useState(5),
    [plan, setPlan] = useState<string>(requestedPlan)
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
                update((d) => ({
                  ...d,
                  requests: [
                    {
                      id,
                      kind: "Đăng ký sử dụng",
                      company: String(f.get("company")),
                      name: String(f.get("name")),
                      email: String(f.get("email")),
                      branches: locations,
                      count,
                      reason: `${
                        plan === "free" ? "Gói miễn phí" : "Gói có phí"
                      } · ${f.get("reason")}`,
                      role: "manager",
                      branch: branches[0],
                      status: "Chờ duyệt",
                      note: "",
                      date: today(),
                    },
                    ...d.requests,
                  ],
                }))
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
                <select value={plan} onChange={(e) => setPlan(e.target.value)}>
                  <option value="paid">Có phí · Theo quy mô cơ sở</option>
                  <option value="free">
                    Miễn phí · Cần xác nhận quyền lợi
                  </option>
                </select>
              </label>
              <div className="form-grid">
                <label className="field">
                  Số cơ sở
                  <input
                    type="number"
                    required
                    min={1}
                    max={500}
                    value={locations}
                    onChange={(e) => setLocations(Number(e.target.value))}
                  />
                </label>
                <label className="field">
                  Số tài khoản nhân viên
                  <input
                    type="number"
                    required
                    min={1}
                    max={500}
                    value={count}
                    onChange={(e) => setCount(Number(e.target.value))}
                  />
                  <small>Chưa bao gồm chủ doanh nghiệp.</small>
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
                  "Quyền lợi và hạn mức gói miễn phí được xác nhận khi WareMap xử lý yêu cầu."
                ) : (
                  <>
                    <strong>Chi phí dự kiến: {money(price.total)}/tháng</strong>
                    <br />
                    Gói cơ bản {money(price.base)} + cơ sở bổ sung{" "}
                    {money(price.branchExtra)} + tài khoản bổ sung{" "}
                    {money(price.staffExtra)}.
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
