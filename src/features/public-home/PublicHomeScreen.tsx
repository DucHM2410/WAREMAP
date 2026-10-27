import {
  ArrowRight,
  Box,
  Building2,
  Check,
  CheckCircle2,
  MapPin,
  ScanLine,
  Search,
  ShieldCheck,
  Truck,
} from "lucide-react"
import { Bell, Users, Plus } from "lucide-react"
import { useApp } from "../../app/store"
import { Badge, Brand, Button } from "../../app/ui"
import { branches, money, policy } from "../../app/model"
import { useIndustry } from "../../shared/context/IndustryContext"
export function MiniMap({ highlight = "A2" }: { highlight?: string }) {
  return (
    <div
      className="rack-mini"
      aria-label={`Sơ đồ minh họa, kệ ${highlight} được đánh dấu`}
    >
      {["A1", "A2", "A3"].map((id) => (
        <div
          key={id}
          className={`rack-drawing ${highlight === id ? "highlight" : ""}`}
        >
          <span>{id}</span>
          <i />
          <i />
          <i />
        </div>
      ))}
    </div>
  )
}
export default function PublicHome() {
  const { go, setRole, setRequestedPlan } = useApp()
  const { hasSavedIndustry } = useIndustry()
  const startDemo = () => {
    setRole("owner")
    go(hasSavedIndustry ? "warehouse" : "industry-picker")
  }
  return (
    <div className="landing">
      <header className="public-nav">
        <Brand />
        <nav className="public-links">
          <a href="#benefits">Lợi ích</a>
          <a href="#remote">Quản lý từ xa</a>
          <a href="#pricing">Bảng giá</a>
        </nav>
        <div className="row">
          <Button variant="secondary" onClick={() => go("login")}>
            Đăng nhập
          </Button>
          <Button onClick={() => go("request")}>
            Yêu cầu dùng thử
            <ArrowRight size={15} />
          </Button>
        </div>
      </header>
      <main>
        <section className="hero">
          <div className="hero-copy">
            <Badge tone="info">
              <Box size={13} />
              Mỗi mặt hàng, một vị trí rõ ràng
            </Badge>
            <h1>
              Quản lý Kho 3D Thông minh cho <em>Mẹ &amp; Bé / Mỹ phẩm</em>
            </h1>
            <p>
              Tự vẽ sơ đồ kho, quét QR đối soát, và theo dõi hàng đi đường trên một nền tảng.
            </p>
            <div className="row">
              <Button onClick={startDemo}>
                Dùng thử miễn phí
                <ArrowRight size={17} />
              </Button>
              <Button variant="secondary" onClick={startDemo}>
                Xem Demo Kho 3D
              </Button>
            </div>
            <p className="hero-foot">
              Không cần tài khoản để khám phá · Dữ liệu mẫu riêng biệt
            </p>
          </div>
          <div className="hero-visual">
            <div className="visual-head">
              <span>WAREMAP SYSTEM / KHO TRUNG TÂM</span>
              <span>Minh họa</span>
            </div>
            <div className="product-preview">
              <div className="preview-library"><Box size={20} /><span>Thư viện</span><div>＋ Kệ hàng</div><div>＋ Tủ bảo quản</div></div>
              <div className="preview-map"><MiniMap /><span className="preview-caption">KHO 3D · Chọn kệ để tùy chỉnh</span></div>
              <div className="preview-inspector"><span>KỆ A2</span><strong>Kích thước</strong><div>2 × 1 × 2.4 m</div><strong>Số tầng</strong><div>3 tầng</div></div>
            </div>
            <div className="preview-alert"><span className="preview-alert-icon"><Bell size={18} /></span><div><strong>FEFO Alert</strong><p>Lô tại kệ A2 cần được ưu tiên xuất.</p></div></div>
            <div className="preview-notification"><span>Z</span><div><strong>Zalo OA Notification</strong><p>Kho của bạn vừa có một cảnh báo mới.</p></div><CheckCircle2 size={17} /></div>
          </div>
        </section>
        <section id="benefits" className="public-section">
          <span className="eyebrow">ÍT THAO TÁC HƠN. NẮM RÕ HƠN.</span>
          <h2>Một nền tảng. Bốn cách làm kho nhẹ nhàng hơn.</h2>
          <p>Từ thiết kế không gian đến phối hợp cả đội, mọi thứ ở đúng chỗ.</p>
          <div className="usp-grid">
            <article className="usp-card"><span className="usp-number">01 / THIẾT KẾ KHÔNG GIAN</span><div className="usp-art usp-racks"><MiniMap /></div><h3>Tự Vẽ Kho 3D Trong 5 Phút</h3><p>Thêm kệ bằng một chạm, kéo vào lưới và chỉnh kích thước theo kho thực tế.</p><Button variant="ghost" onClick={startDemo}>Khám phá Builder <ArrowRight size={16} /></Button></article>
            <article className="usp-card"><span className="usp-number">02 / KẾT NỐI CHI NHÁNH</span><div className="usp-art transit-art">{["Xuất kho", "Đang đi", "Đã nhận"].map((step,i) => <div key={step}><span className={i < 2 ? "done" : ""}>{i === 1 ? <Truck size={22} /> : <Check size={22} />}</span><strong>{step}</strong></div>)}</div><h3>Theo Dõi Hàng Đi Đường</h3><p>Nắm rõ từng chặng chuyển kho. Đối soát số lượng ngay khi chi nhánh nhận hàng.</p></article>
            <article className="usp-card"><span className="usp-number">03 / CHỦ ĐỘNG MỖI NGÀY</span><div className="usp-art"><div className="zalo-phone"><div className="phone-camera"/><strong>Zalo <small>OA · Minh họa</small></strong><div className="zalo-bubble">WareMap System<br/><b>Có lô hàng sắp hết hạn</b><p>Kệ A2 · Ưu tiên kiểm tra hôm nay.</p></div></div></div><h3>Cảnh Báo Zalo OA Tự Động</h3><p>Nhận nhắc nhở về lô cận hạn và biến động kho ngay trên Zalo.</p></article>
            <article className="usp-card"><span className="usp-number">04 / PHỐI HỢP ĐÚNG VAI TRÒ</span><div className="usp-art"><div className="staff-preview"><Users size={23}/><strong>Thêm nhân viên</strong><div>Nguyễn Minh Anh <span>Nhân viên kho</span></div><div>Quyền truy cập <b>Kho trung tâm</b></div><span className="staff-invite"><Plus size={14}/> Cấp tài khoản · Minh họa</span></div></div><h3>Tạo Tài Khoản Nhân Viên (RBAC)</h3><p>Phân quyền rõ ràng cho quản lý, nhân viên kho và bán hàng. Mỗi người thấy đúng công việc.</p></article>
          </div>
        </section>
        <div className="public-tint" id="remote">
          <section className="public-section remote-section">
            <div>
              <span className="eyebrow">Một hệ thống, nhiều cơ sở</span>
              <h2>
                Không có mặt tại kho,
                <br />
                vẫn nắm được tình hình.
              </h2>
              <p>
                Chuyển giữa kho tổng và chi nhánh, kiểm tra tồn kho, theo dõi
                hàng đang chuyển và xem nơi nào cần chú ý.
              </p>
              <div className="row" style={{ marginTop: 23 }}>
                <Button variant="secondary" onClick={startDemo}>
                  Xem cách quản lý nhiều kho
                  <ArrowRight size={15} />
                </Button>
              </div>
            </div>
            <div className="panel">
              {branches.map((b, i) => (
                <div className="branch-card" key={b}>
                  <Building2 size={21} color="#799baa" />
                  <div>
                    <strong>{b}</strong>
                    <p>Ví dụ tình trạng theo từng cơ sở</p>
                  </div>
                  <Badge
                    tone={i === 2 ? "danger" : i === 0 ? "warning" : "success"}
                  >
                    {i === 2
                      ? "Có hàng hết hạn"
                      : i === 0
                        ? "Cần kiểm tra"
                        : "Đang hoạt động"}
                  </Badge>
                </div>
              ))}
              <div className="section-note">
                Minh họa · Luôn hiển thị phạm vi kho đang xem
              </div>
            </div>
          </section>
        </div>
        <section id="pricing" className="public-section">
          <span className="eyebrow">Chi phí rõ ràng</span>
          <h2>Bắt đầu phù hợp. Mở rộng khi cần.</h2>
          <p>
            Hai lựa chọn: miễn phí và có phí. Gói có phí linh hoạt theo số cơ
            sở.
          </p>
          <div className="pricing-grid">
            {[
              {
                name: "Miễn phí",
                price: 0,
                subtitle: "Tìm hiểu WareMap System.",
                items: [
                  "Khám phá kho mẫu",
                  "Gửi yêu cầu sử dụng miễn phí",
                  "Quyền lợi được xác nhận khi cấp gói",
                ],
                cta: "Yêu cầu gói miễn phí",
              },
              {
                name: "Một cơ sở",
                price: policy.single,
                subtitle: "Cho doanh nghiệp có một địa điểm.",
                items: [
                  "1 cơ sở",
                  "5 tài khoản nhân viên ban đầu",
                  "Cấp tài khoản qua yêu cầu",
                ],
                cta: "Yêu cầu gói Một cơ sở",
              },
              {
                name: "Chuỗi",
                price: policy.chain,
                subtitle: "Cho doanh nghiệp có nhiều địa điểm.",
                items: [
                  "Tối đa 5 cơ sở",
                  "5 tài khoản nhân viên dùng chung",
                  "Theo dõi tập trung giữa các kho",
                ],
                cta: "Yêu cầu gói Chuỗi",
              },
            ].map((p, i) => (
              <article
                className={`panel price-card ${i === 2 ? "featured" : ""}`}
                key={p.name}
              >
                <Badge tone={i === 2 ? "info" : "neutral"}>{p.name}</Badge>
                <div className="price">
                  {money(p.price)}
                  <small> / tháng</small>
                </div>
                <p>{p.subtitle}</p>
                <ul>
                  {p.items.map((item) => (
                    <li key={item}>
                      <Check size={15} />
                      {item}
                    </li>
                  ))}
                </ul>
                <Button
                  variant={i === 2 ? "primary" : "secondary"}
                  onClick={() => { setRequestedPlan(i === 0 ? "free" : "paid"); go("request") }}
                >
                  {p.cta}
                </Button>
              </article>
            ))}
          </div>
          <div className="grid-two" style={{ marginTop: 20 }}>
            <div className="callout">
              <strong>Thêm cơ sở</strong>
              <br />
              Vượt 5 cơ sở: +150.000đ/tháng cho mỗi block 5 cơ sở.
            </div>
            <div className="callout">
              <strong>Thêm tài khoản nhân viên</strong>
              <br />
              Vượt 5 tài khoản: +60.000đ/tháng cho mỗi block 5 tài khoản.
            </div>
          </div>
          <p className="tiny" style={{ marginTop: 14 }}>
            Tài khoản chủ doanh nghiệp được tính riêng. Yêu cầu cấp tài khoản do
            WareMap xét duyệt.
          </p>
        </section>
        <div className="public-tint">
          <section className="public-section">
            <span className="eyebrow">Phù hợp với mô hình của bạn</span>
            <h2>Từ cửa hàng đến chuỗi bán lẻ.</h2>
            <div className="chip-row" style={{ marginTop: 20 }}>
              {[
                "Mẹ & Bé",
                "Mỹ phẩm & chăm sóc cá nhân",
                "Cửa hàng hàng nhập khẩu",
              ].map((t) => (
                <Badge key={t}>{t}</Badge>
              ))}
            </div>
          </section>
        </div>
        <section className="public-section">
          <div className="public-cta">
            <h2>Hình dung kho của bạn rõ ràng hơn.</h2>
            <p>Thử tìm một mặt hàng, xem vị trí và khám phá cách bố trí kho.</p>
            <Button onClick={startDemo}>
              Mở kho mẫu
              <ArrowRight size={16} />
            </Button>
          </div>
        </section>
      </main>
      <footer className="public-footer">
        <Brand />
        <p>
          © {new Date().getFullYear()} WareMap System · Quản lý vị trí. Kết nối
          vận hành.
        </p>
        <Button variant="ghost" onClick={() => go("request")}>
          Liên hệ sử dụng
        </Button>
      </footer>
    </div>
  )
}
