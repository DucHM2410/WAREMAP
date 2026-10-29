import type { ReactNode } from "react"
import "./GuestExperience.css"
import { useApp } from "../../app/store"
import { Brand, Button } from "../../app/ui"

export function TrialInfo() {
  const { go, startGuest, setRequestedPlan } = useApp()
  return (
    <main id="main-content" className="guest-info">
      <button className="brand-button" onClick={() => go("home")}>
        <Brand />
      </button>
      <span className="eyebrow">Trải nghiệm trước khi đăng ký</span>
      <h1>Bắt đầu nhỏ. Hiểu rõ trước khi dùng.</h1>
      <p>
        Chưa đăng nhập? Bạn có thể xem kho mẫu, không cần cung cấp thông tin.
      </p>
      <div className="guest-comparison">
        <article>
          <span className="eyebrow">Khám phá kho 3D</span>
          <h2>Xem cách kho hoạt động</h2>
          <p>1 kho mẫu · chỉ xem</p>
          <ul>
            <li>Xoay, phóng to và chọn kệ trong 3D</li>
            <li>Chọn hàng mẫu để xem vị trí và thông tin</li>
            <li>Không mở danh sách quản lý hay chỉnh sửa dữ liệu</li>
          </ul>
          <Button variant="secondary" onClick={() => startGuest("explore")}>
            Khám phá kho 3D
          </Button>
        </article>
        <article>
          <span className="eyebrow">Dùng thử miễn phí · chưa đăng nhập</span>
          <h2>Thử tìm hàng trong kho</h2>
          <p>1 kho mẫu · tối đa 3 mã hàng mẫu · chỉ xem</p>
          <ul>
            <li>Bao gồm trải nghiệm kho 3D</li>
            <li>Xem, tìm kiếm và lọc danh sách hàng mẫu</li>
            <li>Không lưu dữ liệu hay tải dữ liệu riêng lên</li>
          </ul>
          <Button onClick={() => startGuest("trial")}>
            Bắt đầu dùng thử giới hạn
          </Button>
        </article>
      </div>
      <section className="guest-limits">
        <h2>Đăng nhập để thao tác theo quyền</h2>
        <p>
          Thiết kế và lưu sơ đồ, nhập xuất hàng, quét / xuất QR, chuyển kho, báo
          cáo và quản trị tài khoản không có trong trải nghiệm khách. Sau đăng
          nhập, tính năng được mở theo vai trò được cấp.
        </p>
        <p>
          Website hiện là bản demo: tài khoản và yêu cầu đăng ký được mô phỏng
          trên trình duyệt, chưa kết nối dịch vụ tài khoản thực. Gửi yêu cầu
          không tự kích hoạt tài khoản.
        </p>
        <div className="row">
          <Button
            onClick={() => {
              setRequestedPlan("free")
              go("request")
            }}
          >
            Yêu cầu cấp tài khoản miễn phí
          </Button>
          <Button variant="secondary" onClick={() => go("login")}>
            Đã có tài khoản? Đăng nhập
          </Button>
        </div>
      </section>
      <Button variant="ghost" onClick={() => go("home")}>
        ← Về trang chủ
      </Button>
    </main>
  )
}

export function GuestWorkspace({ children }: { children: ReactNode }) {
  const { accessMode, screen, go } = useApp()
  const trial = accessMode === "trial"
  return (
    <div className="guest-workspace">
      <header className="guest-header">
        <button className="brand-button" onClick={() => go("home")}>
          <Brand />
        </button>
        <nav aria-label="Trải nghiệm khách">
          <Button
            variant={screen === "warehouse" ? "primary" : "ghost"}
            onClick={() => go("warehouse")}
          >
            Kho 3D mẫu
          </Button>
          {trial && (
            <Button
              variant={screen === "inventory" ? "primary" : "ghost"}
              onClick={() => go("inventory")}
            >
              Hàng mẫu
            </Button>
          )}
        </nav>
        <Button variant="secondary" onClick={() => go("login")}>
          Đăng nhập
        </Button>
      </header>
      <aside className="guest-banner" aria-label="Giới hạn trải nghiệm">
        <div>
          <strong>
            {trial
              ? "Dùng thử miễn phí · Chưa đăng nhập"
              : "Khám phá kho 3D · Chỉ xem"}
          </strong>
          <p>
            1 kho mẫu · tối đa 3 mã hàng mẫu. Không lưu / sửa sơ đồ, nhập xuất,
            quét QR hoặc quản trị.
          </p>
        </div>
        <Button variant="secondary" onClick={() => go("trial-info")}>
          Xem giới hạn & đăng ký
        </Button>
      </aside>
      <main id="main-content" className="guest-content">
        {children}
      </main>
    </div>
  )
}
