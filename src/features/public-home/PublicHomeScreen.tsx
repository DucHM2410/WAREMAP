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
    if (!hasSavedIndustry) go("industry-picker")
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
              Biết hàng ở đâu.
              <br />
              <em>Quản lý kho từ xa.</em>
            </h1>
            <p>
              Sắp xếp vị trí hàng hóa trên bản đồ kho, tìm đúng sản phẩm và nắm
              tình hình các cơ sở trên cùng một hệ thống.
            </p>
            <div className="row">
              <Button onClick={startDemo}>
                Khám phá kho mẫu
                <ArrowRight size={17} />
              </Button>
              <Button variant="secondary" onClick={() => go("request")}>
                Yêu cầu dùng thử
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
            <div className="hero-search">
              <Search size={16} />
              <span>Son dưỡng Daily Care · Hồng nhạt</span>
              <CheckCircle2
                size={16}
                style={{ marginLeft: "auto", color: "#087e8b" }}
              />
            </div>
            <MiniMap />
            <div className="hero-result">
              <MapPin size={25} />
              <div>
                <strong>Kệ A2 · Tầng 2 · Ô 03</strong>
                <p>Đúng vị trí. Đúng sản phẩm. Cả đội cùng tìm được.</p>
              </div>
            </div>
          </div>
        </section>
        <section id="benefits" className="public-section">
          <span className="eyebrow">Từ việc nhỏ, đến kho ngăn nắp hơn</span>
          <h2>Một cách quản lý dễ hình dung.</h2>
          <p>
            Biến những vị trí chỉ người quen kho mới nhớ thành thông tin rõ ràng
            cho cả đội.
          </p>
          <div className="benefits">
            {[
              {
                icon: MapPin,
                title: "Tìm đúng chỗ, lấy đúng hàng",
                text: "Tìm tên sản phẩm để thấy ngay kệ, tầng và ô. Nhân viên mới có điểm bắt đầu rõ ràng.",
                foot: "Tìm hàng → Xem vị trí",
              },
              {
                icon: ScanLine,
                title: "Mỗi vị trí có một tên gọi",
                text: "Bố trí sơ đồ theo kho thực tế, đặt mã vị trí và quét xác minh trước khi cất hoặc lấy hàng.",
                foot: "Sắp xếp → Gán vị trí → Xác minh",
              },
              {
                icon: ShieldCheck,
                title: "Chủ động trước khi có vấn đề",
                text: "Nhìn thấy lô cận hạn và chênh lệch chuyển kho, biết việc nào cần kiểm tra tiếp theo.",
                foot: "Nhận biết → Kiểm tra → Xử lý",
              },
            ].map(({ icon: Icon, title, text, foot }) => (
              <article className="benefit" key={title}>
                <Icon size={27} />
                <h3>{title}</h3>
                <p>{text}</p>
                <small>{foot}</small>
              </article>
            ))}
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
