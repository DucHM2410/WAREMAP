import type { ReactNode } from "react"

import "./GuestExperience.css"

import { useApp } from "../../app/store"

import { PublicFlowLayout, PublicFlowHeading } from "./PublicFlowLayout"

import { Button } from "../../app/ui"

export function TrialInfo() {
  const { go, startGuest, startTrialDemo, setRequestedPlan } = useApp()

  return (
    <PublicFlowLayout current="Trải nghiệm WareMap">
      <div className="experience-content">
        <PublicFlowHeading
          eyebrow="Trải nghiệm trước khi đăng ký"
          title="Bắt đầu nhỏ. Hiểu rõ trước khi dùng."
          description="Xem kho mẫu hoặc thử vận hành với vai trò Chủ doanh trước khi đăng ký."
        />
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
            <span className="eyebrow">Demo vận hành</span>
            <h2>Trải nghiệm vận hành một cơ sở</h2>
            <p>1 cơ sở · 1 Chủ doanh + 1 Quản lý kho + 3 Nhân viên</p>
            <ul>
              <li>3D Builder, QR Kệ và QR Lô</li>
              <li>Nhập xuất, kiểm kê, lô hàng và cảnh báo FEFO</li>
              <li>Báo cáo và phân quyền theo tài khoản demo</li>
            </ul>
            <p className="tiny">
              Vào ngay dữ liệu mẫu, không cần chờ duyệt. Không tạo tài khoản
              hoặc đếm hạn dùng thử thật.
            </p>
            <Button onClick={startTrialDemo}>
              Xem demo với vai trò Chủ doanh
            </Button>
          </article>
        </div>
        <section className="guest-limits">
          <h2>Muốn dùng thử cho doanh nghiệp của bạn?</h2>
          <p>
            Đăng ký Free Trial 0đ/7 ngày: 1 cơ sở, 1 Chủ doanh + 1 Quản lý kho +
            3 Nhân viên. WareMap tiếp nhận yêu cầu và xét duyệt cấp tài khoản.
          </p>
          <p className="tiny">
            Bản demo chỉ lưu yêu cầu trên trình duyệt. Để thử các vai trò khác,
            chọn tài khoản mẫu tại trang Đăng nhập.
          </p>
          <div className="row">
            <Button
              onClick={() => {
                setRequestedPlan("free")

                go("request")
              }}
            >
              Đăng ký dùng thử miễn phí 7 ngày
            </Button>
            <Button variant="secondary" onClick={() => go("login")}>
              Đã có tài khoản? Đăng nhập
            </Button>
          </div>
        </section>
      </div>
    </PublicFlowLayout>
  )
}

export function GuestWorkspace({ children }: { children: ReactNode }) {
  const { go } = useApp()
  return (
    <PublicFlowLayout current="Khám phá kho 3D" experienceParent wide>
      <PublicFlowHeading
        eyebrow="Kho mẫu · Chỉ xem"
        title="Khám phá kho 3D"
        description="Tìm sản phẩm, chọn kệ để xem hàng đang ở đâu. Kéo để xoay kho và cuộn để phóng to."
      />
      <aside className="guest-banner guest-map-banner" aria-label="Giới hạn trải nghiệm">
        <div>
          <strong>Bạn đang xem kho mẫu</strong>
          <p>1 kho mẫu · tối đa 32 dòng hàng minh họa. Chỉ xem và tìm hàng; chưa thể sửa sơ đồ, nhập xuất hàng hoặc quét QR.</p>
        </div>
        <Button variant="secondary" onClick={() => go("trial-info")}>Xem thêm cách trải nghiệm</Button>
      </aside>
      <div className="guest-map-content guest-workspace">{children}</div>
    </PublicFlowLayout>
  )
}
