import {
  ArrowRight,
  BarChart3,
  Bell,
  Box,
  Check,
  Clock3,
  Mail,
  MapPin,
  PenTool,
  Phone,
  QrCode,
  Search,
  ShieldCheck,
  Sparkles,
  Store,
  Truck,
  Users,
} from 'lucide-react'
import type { CSSProperties } from 'react'
import { Btn, MonoLabel } from '../../shared'

function navigateTo(screen: string) {
  window.dispatchEvent(new CustomEvent('waremap:navigate', { detail: screen }))
}

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const painPoints = [
  {
    icon: Search,
    title: 'Hàng nghìn SKU, vỏ hộp giống nhau',
    result: 'Nhặt nhầm',
    description: 'Nhân viên mất thời gian tìm kiếm và dễ lấy sai màu, sai dung tích hoặc sai lô.',
    color: '#0891B2',
  },
  {
    icon: Clock3,
    title: 'Hàng mới chất lên hàng cũ',
    result: 'Sót hàng hết hạn',
    description: 'Không nhìn thấy lô cận hạn khiến hàng nằm quên trên kệ và phải tiêu hủy.',
    color: '#D97706',
  },
  {
    icon: BarChart3,
    title: 'Dữ liệu phân mảnh giữa Sheets, Sapo, KiotViet',
    result: 'Rác dữ liệu',
    description: 'Tồn kho trên hệ thống và thực tế không khớp, khó xác định nguồn dữ liệu đúng.',
    color: '#7C3AED',
  },
  {
    icon: Truck,
    title: 'Chuyển hàng giữa các cửa hàng',
    result: 'Thất thoát',
    description: 'Không biết hàng đang ở kho xuất, trên đường hay đã đến chi nhánh nhận.',
    color: '#DC2626',
  },
]

const features = [
  {
    icon: Box,
    title: 'Bản đồ Kho 3D Trực quan',
    description: 'Biết chính xác SKU nằm ở Kệ nào, Tầng nào và Ô nào. Điều hướng nhân viên đến đúng vị trí.',
    accent: '#0891B2',
    tag: '3D MAP',
  },
  {
    icon: QrCode,
    title: 'Xác minh QR 2 chiều & RBAC',
    description: 'Quét đồng thời mã vị trí Kệ và mã Lô. Phân quyền đúng vai trò cho từng nhân viên.',
    accent: '#2563EB',
    tag: 'QR + SECURITY',
  },
  {
    icon: PenTool,
    title: 'Bộ tự vẽ Sơ đồ kho 3D',
    description: 'Kéo thả kệ trưng bày, tủ mát và khu tester để tái hiện đúng kho thực tế.',
    accent: '#7C3AED',
    tag: '3D BUILDER',
  },
  {
    icon: Bell,
    title: 'Định vị FEFO & Cảnh báo Zalo OA',
    description: 'Phát hiện lô cận hạn, chỉ đường nhặt hàng và gửi cảnh báo tự động đến quản lý.',
    accent: '#D97706',
    tag: 'FEFO ALERT',
  },
  {
    icon: Truck,
    title: 'Quản lý Hàng Trung chuyển Nội bộ',
    description: 'Theo dõi hàng từ lúc rời kho, đang đi đường đến khi đối soát tại chi nhánh nhận.',
    accent: '#059669',
    tag: 'IN-TRANSIT',
  },
]

const plans = [
  {
    name: 'FREE',
    price: '0đ',
    description: 'Cho cửa hàng nhỏ bắt đầu số hóa kho.',
    features: ['1 kho hàng', '1 tài khoản Admin', 'Quản lý tồn kho cơ bản', 'Xem bản đồ 3D cơ bản'],
    action: 'Bắt đầu miễn phí',
    featured: false,
  },
  {
    name: 'PRO',
    price: '99.000đ',
    description: 'Bộ công cụ đầy đủ cho cửa hàng chuyên nghiệp.',
    features: ['3D Builder', 'QR Kệ + QR Lô', 'Quản lý Lô/Hạn & FEFO', 'Cảnh báo Zalo OA', 'Tài khoản phụ & RBAC'],
    action: 'Dùng thử Pro',
    featured: true,
  },
  {
    name: 'CHUỖI',
    price: '299.000đ',
    description: 'Vận hành đồng bộ nhiều cửa hàng.',
    features: ['Toàn bộ tính năng Pro', 'Tối đa 3 chi nhánh', 'Quản lý chuyển kho', 'Hàng đi đường', 'Đối soát chi nhánh'],
    action: 'Dùng thử Chuỗi',
    featured: false,
    note: 'Chi nhánh bổ sung: 60.000đ/tháng',
  },
]

function PublicHeader() {
  return (
    <header className="ph-header">
      <div className="ph-header-inner">
        <div className="ph-logo" onClick={() => scrollToSection('hero')}>
          <div><Box size={20} /></div>
          <span>WareMap <strong>System</strong><small>V5.0</small></span>
        </div>

        <nav className="ph-nav">
          <Btn variant="ghost" size="sm" onClick={() => scrollToSection('features')}>Tính năng</Btn>
          <Btn variant="ghost" size="sm" onClick={() => scrollToSection('pricing')}>Bảng giá</Btn>
          <Btn variant="ghost" size="sm" onClick={() => scrollToSection('customers')}>Khách hàng</Btn>
          <Btn variant="ghost" size="sm" onClick={() => scrollToSection('docs')}>Tài liệu</Btn>
          <Btn variant="ghost" size="sm" onClick={() => scrollToSection('contact')}>Liên hệ</Btn>
        </nav>

        <div className="ph-header-actions">
          <Btn
            variant="ghost"
            size="sm"
            onClick={() => navigateTo('login')}
            style={{ color: '#2563EB', background: '#FFFFFF', borderColor: '#BFDBFE' }}
          >
            Đăng nhập
          </Btn>
          <Btn
            variant="primary"
            size="sm"
            onClick={() => navigateTo('login')}
            style={{ color: '#FFFFFF', background: '#2563EB', borderColor: '#2563EB' }}
          >
            Dùng thử miễn phí <ArrowRight size={13} />
          </Btn>
        </div>
      </div>
    </header>
  )
}

function RackMockup({ label, color, selected }: { label: string; color: string; selected?: boolean }) {
  return (
    <div className={`ph-rack ${selected ? 'selected' : ''}`} style={{ '--rack-color': color } as CSSProperties}>
      <div className="ph-rack-label">{label}</div>
      {[0, 1, 2].map((level) => (
        <div className="ph-rack-level" key={level}>
          <span /><span /><span />
        </div>
      ))}
    </div>
  )
}

function HeroMockup() {
  return (
    <div className="ph-hero-visual">
      <div className="ph-dashboard-window">
        <div className="ph-window-bar">
          <div><span /><span /><span /></div>
          <strong>WareMap · Kho Trung Tâm</strong>
          <MonoLabel size={7} color="#059669">LIVE</MonoLabel>
        </div>
        <div className="ph-window-content">
          <div className="ph-mini-sidebar">
            <Box size={15} />
            <span className="active" /><span /><span /><span />
          </div>
          <div className="ph-warehouse-scene">
            <div className="ph-scene-grid" />
            <div className="ph-racks">
              <RackMockup label="A1" color="#2563EB" />
              <RackMockup label="A2" color="#0891B2" selected />
              <RackMockup label="A3" color="#059669" />
            </div>
            <div className="ph-scene-pill"><MapPin size={11} /> Kệ A2 · Tầng 2 · Ô 03</div>
            <div className="ph-scene-alert"><Bell size={12} /><span><strong>FEFO Alert</strong><small>Son Môi A · còn 23 ngày</small></span></div>
          </div>
          <div className="ph-mini-analytics">
            <span>TỔNG QUAN KHO</span>
            <div><strong>1,847</strong><small>SKU</small></div>
            <div><strong>71%</strong><small>Công suất</small></div>
            <div className="ph-mini-chart"><i /><i /><i /><i /></div>
          </div>
        </div>
      </div>
      <div className="ph-float-card card-one"><QrCode size={17} /><span><strong>QR đã xác minh</strong><small>Đúng Lô · Đúng Kệ</small></span><Check size={13} /></div>
      <div className="ph-float-card card-two"><Truck size={17} /><span><strong>Đang đi đường</strong><small>Kho Tổng → CN Quận 3</small></span></div>
    </div>
  )
}

function HeroSection() {
  return (
    <section className="ph-hero" id="hero">
      <div className="ph-container ph-hero-grid">
        <div className="ph-hero-copy">
          <div className="ph-eyebrow"><Sparkles size={13} /> NỀN TẢNG QUẢN LÝ KHO 3D CHO BÁN LẺ</div>
          <h1>Quản lý Kho Mẹ & Bé / Mỹ phẩm bằng <span>Bản đồ 3D Trực quan</span></h1>
          <p>Biết chính xác hàng nằm ở Ô nào, Kệ nào, Lô nào, Hạn bao nhiêu. Tìm đúng vị trí – Lấy đúng hàng – Quản lý chính xác tồn kho & Hàng đi đường.</p>
          <div className="ph-hero-actions">
            <Btn
              variant="primary"
              size="lg"
              onClick={() => navigateTo('login')}
              style={{ color: '#FFFFFF', background: '#2563EB', borderColor: '#2563EB', height: 48, borderRadius: 10 }}
            >
              Dùng thử miễn phí 14 ngày <ArrowRight size={16} />
            </Btn>
            <Btn
              variant="outline"
              size="lg"
              onClick={() => navigateTo('dashboard')}
              style={{ color: '#0891B2', background: '#FFFFFF', borderColor: '#0891B2', height: 48, borderRadius: 10 }}
            >
              <Box size={16} /> Xem Demo 3D
            </Btn>
          </div>
          <div className="ph-hero-proof">
            <div className="ph-avatar-stack"><span>HC</span><span>F52</span><span>MB</span></div>
            <div><strong>Được tin dùng bởi doanh nghiệp bán lẻ</strong><span>Không cần thẻ tín dụng · Thiết lập trong 15 phút</span></div>
          </div>
        </div>
        <HeroMockup />
      </div>
    </section>
  )
}

function PainPointsSection() {
  return (
    <section className="ph-section ph-pains">
      <div className="ph-container">
        <div className="ph-section-head">
          <MonoLabel size={9} color="#DC2626">VẤN ĐỀ VẬN HÀNH THỰC TẾ</MonoLabel>
          <h2>Bạn có đang gặp những vấn đề này?</h2>
          <p>Các sai lệch nhỏ trong kho tích tụ thành chi phí lớn, hàng hết hạn và trải nghiệm khách hàng kém.</p>
        </div>
        <div className="ph-pain-grid">
          {painPoints.map(({ icon: Icon, title, result, description, color }) => (
            <article key={title}>
              <div style={{ color, background: `${color}12` }}><Icon size={22} /></div>
              <h3>{title}</h3>
              <span><ArrowRight size={13} /> {result}</span>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function FeaturesSection() {
  return (
    <section className="ph-section ph-features" id="features">
      <div className="ph-container">
        <div className="ph-section-head">
          <MonoLabel size={9} color="#0891B2">5 TRỤ CỘT WAREMAP</MonoLabel>
          <h2>WAREMAP giải quyết tất cả</h2>
          <p>Một nền tảng thống nhất để nhìn thấy, xác minh và kiểm soát toàn bộ dòng chảy hàng hóa.</p>
        </div>
        <div className="ph-feature-grid">
          {features.map(({ icon: Icon, title, description, accent, tag }, index) => (
            <article className={index < 2 ? 'wide' : ''} key={title}>
              <div className="ph-feature-icon" style={{ color: accent, background: `${accent}12` }}><Icon size={23} /></div>
              <MonoLabel size={7} color={accent}>{tag}</MonoLabel>
              <h3>{title}</h3>
              <p>{description}</p>
              <div className="ph-feature-link">Khám phá tính năng <ArrowRight size={12} /></div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function PricingSection() {
  return (
    <section className="ph-section ph-pricing" id="pricing">
      <div className="ph-container">
        <div className="ph-section-head">
          <MonoLabel size={9} color="#0891B2">BẢNG GIÁ MINH BẠCH</MonoLabel>
          <h2>Chọn gói phù hợp với cửa hàng của bạn</h2>
          <p>Bắt đầu miễn phí và nâng cấp khi doanh nghiệp của bạn phát triển.</p>
        </div>
        <div className="ph-pricing-grid">
          {plans.map((plan) => (
            <article className={plan.featured ? 'featured' : ''} key={plan.name}>
              {plan.featured && <div className="ph-plan-popular"><Sparkles size={11} /> ĐƯỢC CHỌN NHIỀU NHẤT</div>}
              <div className="ph-plan-name">{plan.name}</div>
              <div className="ph-price"><strong>{plan.price}</strong><span>/ tháng</span></div>
              <p>{plan.description}</p>
              <div className="ph-plan-divider" />
              <ul>
                {plan.features.map((feature) => <li key={feature}><Check size={13} /> {feature}</li>)}
              </ul>
              {plan.note && <div className="ph-plan-note">{plan.note}</div>}
              <Btn
                variant={plan.featured ? 'primary' : 'outline'}
                size="lg"
                full
                onClick={() => navigateTo('login')}
                style={plan.featured
                  ? { color: '#FFFFFF', background: '#2563EB', borderColor: '#2563EB', borderRadius: 10 }
                  : { color: '#0891B2', background: '#FFFFFF', borderColor: '#0891B2', borderRadius: 10 }}
              >
                {plan.action} <ArrowRight size={14} />
              </Btn>
            </article>
          ))}
        </div>
        <div className="ph-pricing-note"><ShieldCheck size={15} /> Miễn phí 14 ngày. Không cần thẻ tín dụng. Không tính phí per-user.</div>
      </div>
    </section>
  )
}

function CustomersSection() {
  const customers = [
    { name: 'HC Cosmetics', mark: 'HC' },
    { name: 'Forever52', mark: 'F52' },
    { name: 'Logistics Plus', mark: 'L+' },
    { name: 'Chuỗi Mẹ & Bé', mark: 'M&B' },
  ]

  return (
    <section className="ph-section ph-customers" id="customers">
      <div className="ph-container">
        <div className="ph-section-head compact">
          <MonoLabel size={9} color="#64748B">KHÁCH HÀNG TIÊU BIỂU</MonoLabel>
          <h2>Đồng hành cùng các thương hiệu tăng trưởng</h2>
        </div>
        <div className="ph-customer-grid">
          {customers.map((customer) => (
            <div key={customer.name}><span>{customer.mark}</span><strong>{customer.name}</strong></div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FinalCta() {
  return (
    <section className="ph-final-cta">
      <div className="ph-container">
        <div><MonoLabel size={9} color="#CFFAFE">BẮT ĐẦU NGAY HÔM NAY</MonoLabel><h2>Sẵn sàng chuyển đổi số kho hàng của bạn?</h2><p>Thiết lập kho 3D đầu tiên trong 15 phút. Đội ngũ WareMap luôn sẵn sàng đồng hành.</p></div>
        <Btn
          variant="ghost"
          size="lg"
          onClick={() => navigateTo('login')}
          style={{ color: '#0891B2', background: '#FFFFFF', borderColor: '#FFFFFF', height: 48, borderRadius: 10 }}
        >
          Dùng thử miễn phí ngay <ArrowRight size={16} />
        </Btn>
      </div>
    </section>
  )
}

function PublicFooter() {
  const columns = [
    { title: 'Về WareMap', links: ['Câu chuyện', 'Khách hàng', 'Bảng giá', 'Tuyển dụng'] },
    { title: 'Tính năng', links: ['Kho 3D', 'QR & RBAC', 'FEFO Alerts', 'In-Transit'] },
    { title: 'Hỗ trợ', links: ['Tài liệu', 'Hướng dẫn nhanh', 'API', 'Trạng thái hệ thống'] },
  ]

  return (
    <footer className="ph-footer" id="contact">
      <div className="ph-container">
        <div className="ph-footer-brand">
          <div className="ph-logo dark"><div><Box size={20} /></div><span>WareMap <strong>System</strong><small>V5.0</small></span></div>
          <p>Nền tảng quản lý kho 3D trực quan dành cho doanh nghiệp bán lẻ Việt Nam.</p>
          <div><MapPin size={13} /> Thành phố Hồ Chí Minh, Việt Nam</div>
        </div>
        {columns.map((column) => (
          <div className="ph-footer-column" key={column.title}><strong>{column.title}</strong>{column.links.map((link) => <span key={link}>{link}</span>)}</div>
        ))}
        <div className="ph-footer-column" id="docs">
          <strong>Liên hệ</strong>
          <span><Mail size={12} /> hello@waremap.vn</span>
          <span><Phone size={12} /> 028 7300 2026</span>
          <span><Users size={12} /> Đặt lịch tư vấn</span>
        </div>
      </div>
      <div className="ph-footer-bottom"><div className="ph-container"><span>© 2026 WareMap System v5.0. Made in Vietnam.</span><span>Điều khoản sử dụng · Chính sách bảo mật</span></div></div>
    </footer>
  )
}

export default function ScreenPublicHome() {
  return (
    <div className="ph-shell">
      <PublicHeader />
      <HeroSection />
      <PainPointsSection />
      <FeaturesSection />
      <PricingSection />
      <CustomersSection />
      <FinalCta />
      <PublicFooter />
    </div>
  )
}
