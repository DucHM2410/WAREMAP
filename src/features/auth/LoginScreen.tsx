import { useRef, useState } from 'react'
import type { ReactNode } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  Baby,
  Box,
  Check,
  CheckCircle2,
  Crown,
  Eye,
  EyeOff,
  KeyRound,
  LockKeyhole,
  Mail,
  Map,
  MessageCircle,
  Palette,
  QrCode,
  ShieldAlert,
  Sparkles,
  Store,
} from 'lucide-react'
import { Btn, MonoLabel } from '../../shared'

type BusinessType = 'mother-baby' | 'cosmetics' | 'other'
type Plan = 'free' | 'pro' | 'chain'

function navigateToDashboard() {
  window.dispatchEvent(new CustomEvent('waremap:navigate', { detail: 'dashboard' }))
}

const benefits = [
  {
    icon: Map,
    title: 'Bản đồ Kho 3D',
    description: 'Định vị chính xác từng kệ, tầng và ô hàng.',
  },
  {
    icon: QrCode,
    title: 'QR Lô & Vị trí',
    description: 'Đối soát hai chiều ngay trên điện thoại.',
  },
  {
    icon: ShieldAlert,
    title: 'Cảnh báo FEFO',
    description: 'Chủ động phát hiện lô cận hạn và hết hạn.',
  },
]

function BrandingPanel() {
  return (
    <section className="lg-brand">
      <div className="lg-brand-orb orb-one" />
      <div className="lg-brand-orb orb-two" />
      <div className="lg-brand-grid" />

      <div className="lg-brand-content">
        <div className="lg-main-logo">
          <div><Box size={33} /></div>
          <span>WareMap <strong>System</strong><small>V5.0</small></span>
        </div>

        <div className="lg-brand-copy">
          <MonoLabel size={10} color="#CFFAFE">WAREHOUSE INTELLIGENCE PLATFORM</MonoLabel>
          <h1>Quản lý Kho Thông minh<br />& Định vị 3D Trực quan</h1>
          <p>Tối ưu vận hành, hạn dùng và trải nghiệm quản lý kho dành riêng cho doanh nghiệp Mẹ & Bé và Mỹ phẩm.</p>
        </div>

        <div className="lg-benefits">
          {benefits.map(({ icon: Icon, title, description }) => (
            <article key={title}>
              <div><Icon size={20} /></div>
              <span><strong>{title}</strong><small>{description}</small></span>
            </article>
          ))}
        </div>

        <div className="lg-trust-row">
          <div><CheckCircle2 size={14} /> Dữ liệu được mã hóa</div>
          <div><CheckCircle2 size={14} /> Đồng bộ thời gian thực</div>
          <div><CheckCircle2 size={14} /> PWA hoạt động ngoại tuyến</div>
        </div>
      </div>
    </section>
  )
}

function LoginField({
  label,
  icon: Icon,
  value,
  type = 'text',
  placeholder,
  onChange,
  action,
}: {
  label: string
  icon: typeof Mail
  value: string
  type?: string
  placeholder: string
  onChange: (value: string) => void
  action?: ReactNode
}) {
  return (
    <label className="lg-field">
      <span>{label}</span>
      <div>
        <Icon size={16} />
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
        />
        {action}
      </div>
    </label>
  )
}

function LoginForm({ onCreate }: { onCreate: () => void }) {
  const [email, setEmail] = useState('admin@waremap.vn')
  const [password, setPassword] = useState('WareMap@2026')
  const [remember, setRemember] = useState(true)
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [toast, setToast] = useState('')
  const timer = useRef<number | null>(null)

  const notify = (message: string) => {
    setToast(message)
    if (timer.current) window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setToast(''), 2400)
  }

  const login = () => {
    if (!email || !password) return notify('Vui lòng nhập đầy đủ email và mật khẩu')
    notify('Đăng nhập thành công · Đang mở WareMap')
    window.setTimeout(navigateToDashboard, 450)
  }

  return (
    <div className="lg-form-card">
      <div className="lg-mobile-brand"><Box size={19} /><strong>WareMap System</strong><span>V5.0</span></div>
      <div className="lg-form-head">
        <span>CHÀO MỪNG TRỞ LẠI</span>
        <h2>Đăng nhập WareMap</h2>
        <p>Quản lý kho hàng của bạn thông minh và trực quan hơn.</p>
      </div>

      <div className="lg-fields">
        <LoginField
          label="Email"
          icon={Mail}
          value={email}
          placeholder="admin@cuahang.vn"
          onChange={setEmail}
        />
        <LoginField
          label="Mật khẩu"
          icon={LockKeyhole}
          type={passwordVisible ? 'text' : 'password'}
          value={password}
          placeholder="Nhập mật khẩu"
          onChange={setPassword}
          action={
            <span className="lg-password-eye" onClick={() => setPasswordVisible((visible) => !visible)}>
              {passwordVisible ? <EyeOff size={15} /> : <Eye size={15} />}
            </span>
          }
        />
      </div>

      <div className="lg-login-options">
        <div onClick={() => setRemember((checked) => !checked)}>
          <span className={remember ? 'checked' : ''}>{remember && <Check size={12} />}</span>
          Ghi nhớ đăng nhập
        </div>
        <button onClick={() => notify('Đã gửi liên kết đặt lại mật khẩu đến email')}>Quên mật khẩu?</button>
      </div>

      <Btn
        variant="cyan"
        size="lg"
        full
        onClick={login}
        style={{ color: '#FFFFFF', background: '#0891B2', borderColor: '#0891B2', height: 46, borderRadius: 10 }}
      >
        Đăng nhập <ArrowRight size={16} />
      </Btn>

      <div className="lg-divider"><span>Hoặc</span></div>

      <Btn
        variant="primary"
        size="lg"
        full
        onClick={() => {
          notify('Đã xác thực Zalo · Đang mở WareMap')
          window.setTimeout(navigateToDashboard, 450)
        }}
        style={{ color: '#FFFFFF', background: '#0068FF', borderColor: '#0068FF', height: 46, borderRadius: 10 }}
      >
        <MessageCircle size={17} /> Đăng nhập bằng Zalo
      </Btn>

      <div className="lg-create-link">
        Chưa có tài khoản? <button onClick={onCreate}>Tạo tài khoản VIP mới</button>
      </div>

      <div className="lg-secure-note"><KeyRound size={13} /> Phiên đăng nhập được bảo vệ bằng mã hóa SSL 256-bit.</div>

      {toast && <div className="lg-toast"><Check size={14} /> {toast}</div>}
    </div>
  )
}

function StepProgress({ step }: { step: number }) {
  const labels = ['Loại hình', 'Cửa hàng', 'Chọn gói']
  return (
    <div className="lg-step-progress">
      {labels.map((label, index) => {
        const number = index + 1
        const complete = number < step
        const active = number === step
        return (
          <div className={complete ? 'complete' : active ? 'active' : ''} key={label}>
            <span>{complete ? <Check size={12} /> : number}</span>
            <small>{label}</small>
            {index < labels.length - 1 && <i />}
          </div>
        )
      })}
    </div>
  )
}

function BusinessTypeStep({
  value,
  onChange,
}: {
  value: BusinessType
  onChange: (value: BusinessType) => void
}) {
  const options: Array<{ id: BusinessType; title: string; description: string; icon: typeof Baby; color: string }> = [
    { id: 'mother-baby', title: 'Mẹ & Bé', description: 'Sữa, bỉm tã, dinh dưỡng và đồ dùng cho bé.', icon: Baby, color: '#0891B2' },
    { id: 'cosmetics', title: 'Mỹ phẩm', description: 'Chăm sóc da, trang điểm và sản phẩm làm đẹp.', icon: Palette, color: '#DB2777' },
    { id: 'other', title: 'Khác', description: 'Mô hình bán lẻ hoặc phân phối chuyên biệt.', icon: Store, color: '#7C3AED' },
  ]

  return (
    <div className="lg-business-options">
      {options.map(({ id, title, description, icon: Icon, color }) => (
        <article className={value === id ? 'selected' : ''} key={id} onClick={() => onChange(id)}>
          <div style={{ color, background: `${color}12` }}><Icon size={22} /></div>
          <span><strong>{title}</strong><small>{description}</small></span>
          <span className="lg-radio">{value === id && <Check size={12} />}</span>
        </article>
      ))}
    </div>
  )
}

function StoreStep({
  storeName,
  setStoreName,
  branch,
  setBranch,
}: {
  storeName: string
  setStoreName: (value: string) => void
  branch: string
  setBranch: (value: string) => void
}) {
  return (
    <div className="lg-store-fields">
      <LoginField
        label="Tên cửa hàng / Doanh nghiệp"
        icon={Store}
        value={storeName}
        placeholder="Ví dụ: Mẹ & Bé An Nhiên"
        onChange={setStoreName}
      />
      <LoginField
        label="Chi nhánh đầu tiên"
        icon={Map}
        value={branch}
        placeholder="Ví dụ: Chi nhánh Quận 3"
        onChange={setBranch}
      />
      <div className="lg-store-preview">
        <div><Store size={18} /></div>
        <span><strong>{storeName || 'Tên cửa hàng'}</strong><small>{branch || 'Tên chi nhánh'} · Kho chính</small></span>
        <MonoLabel size={8} color="#0891B2">WAREMAP READY</MonoLabel>
      </div>
    </div>
  )
}

function PlanStep({ plan, setPlan }: { plan: Plan; setPlan: (plan: Plan) => void }) {
  return (
    <>
      <div className="lg-plans">
        <article className={plan === 'free' ? 'selected' : ''} onClick={() => setPlan('free')}>
          <div className="lg-plan-head"><div><span>FREE</span><strong>0đ</strong><small>/ tháng</small></div><span className="lg-radio">{plan === 'free' && <Check size={12} />}</span></div>
          <p>Dành cho cửa hàng bắt đầu số hóa kho.</p>
          <ul><li><Check size={12} /> 1 kho hàng</li><li><Check size={12} /> 1 tài khoản Admin</li></ul>
        </article>
        <article className={`pro ${plan === 'pro' ? 'selected' : ''}`} onClick={() => setPlan('pro')}>
          <div className="lg-popular"><Crown size={11} /> KHUYÊN DÙNG</div>
          <div className="lg-plan-head"><div><span>PRO</span><strong>99.000đ</strong><small>/ tháng</small></div><span className="lg-radio">{plan === 'pro' && <Check size={12} />}</span></div>
          <p>Đầy đủ công cụ quản lý kho chuyên nghiệp.</p>
          <ul><li><Check size={12} /> 3D Builder & QR</li><li><Check size={12} /> FEFO & Zalo OA</li><li><Check size={12} /> Tài khoản phụ</li></ul>
        </article>
        <article className={`chain ${plan === 'chain' ? 'selected' : ''}`} onClick={() => setPlan('chain')}>
          <div className="lg-plan-head"><div><span>CHUỖI</span><strong>299.000đ</strong><small>/ tháng</small></div><span className="lg-radio">{plan === 'chain' && <Check size={12} />}</span></div>
          <p>Vận hành đồng bộ nhiều cửa hàng.</p>
          <ul><li><Check size={12} /> Toàn bộ tính năng Pro</li><li><Check size={12} /> Tối đa 3 chi nhánh</li><li><Check size={12} /> Quản lý In-Transit</li></ul>
          <div className="lg-chain-note">Chi nhánh thêm: 60.000đ/tháng</div>
        </article>
      </div>
      <div className="lg-trial-note"><Sparkles size={12} /> Miễn phí 14 ngày.</div>
    </>
  )
}

function OnboardingForm({ onBackToLogin }: { onBackToLogin: () => void }) {
  const [step, setStep] = useState(1)
  const [businessType, setBusinessType] = useState<BusinessType>('mother-baby')
  const [storeName, setStoreName] = useState('Mẹ & Bé An Nhiên')
  const [branch, setBranch] = useState('Chi nhánh Quận 3')
  const [plan, setPlan] = useState<Plan>('pro')

  const next = () => {
    if (step < 3) return setStep((current) => current + 1)
    navigateToDashboard()
  }

  return (
    <div className="lg-form-card lg-onboarding-card">
      <button className="lg-back-button" onClick={step === 1 ? onBackToLogin : () => setStep((current) => current - 1)}>
        <ArrowLeft size={14} /> {step === 1 ? 'Đăng nhập' : 'Quay lại'}
      </button>

      <div className="lg-form-head">
        <span>THIẾT LẬP WAREMAP</span>
        <h2>Tạo không gian kho của bạn</h2>
        <p>Chỉ mất khoảng 2 phút để hoàn tất cấu hình ban đầu.</p>
      </div>

      <StepProgress step={step} />

      <div className="lg-onboarding-body">
        {step === 1 && (
          <>
            <div className="lg-step-copy"><strong>Chọn loại hình kinh doanh</strong><span>WareMap sẽ tối ưu mẫu kho và cảnh báo phù hợp.</span></div>
            <BusinessTypeStep value={businessType} onChange={setBusinessType} />
          </>
        )}
        {step === 2 && (
          <>
            <div className="lg-step-copy"><strong>Thông tin cửa hàng</strong><span>Bạn có thể thêm nhiều chi nhánh sau khi hoàn tất.</span></div>
            <StoreStep storeName={storeName} setStoreName={setStoreName} branch={branch} setBranch={setBranch} />
          </>
        )}
        {step === 3 && (
          <>
            <div className="lg-step-copy"><strong>Chọn gói WareMap</strong><span>Có thể nâng cấp hoặc thay đổi gói bất cứ lúc nào.</span></div>
            <PlanStep plan={plan} setPlan={setPlan} />
          </>
        )}
      </div>

      <Btn
        variant="cyan"
        size="lg"
        full
        onClick={next}
        style={{ color: '#FFFFFF', background: '#0891B2', borderColor: '#0891B2', height: 46, borderRadius: 10 }}
      >
        {step === 3 ? <><Sparkles size={16} /> Hoàn tất & Mở WareMap</> : <>Tiếp tục <ArrowRight size={16} /></>}
      </Btn>
    </div>
  )
}

export default function Screen0Login() {
  const [onboarding, setOnboarding] = useState(false)

  return (
    <div className="lg-shell">
      <BrandingPanel />
      <section className="lg-form-side">
        {onboarding
          ? <OnboardingForm onBackToLogin={() => setOnboarding(false)} />
          : <LoginForm onCreate={() => setOnboarding(true)} />}
        <div className="lg-footer">© 2026 WareMap System · Điều khoản · Quyền riêng tư</div>
      </section>
    </div>
  )
}
