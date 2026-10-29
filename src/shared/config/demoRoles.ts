import type { Role } from "../../app/model"

// Local demo identities only. Production authentication must be handled by a backend.
export const DEMO_PASSWORD = "WareMap@123"
export const DEMO_ACCOUNTS = [
  { role: "platform", email: "admin@waremap.demo", label: "Admin hệ thống", scope: "Quản trị WareMap", description: "Quản trị khách hàng, xét duyệt yêu cầu và chỉnh sửa website. Không có quyền xem hay vận hành kho khách hàng." },
  { role: "owner", email: "owner@waremap.demo", label: "Chủ doanh nghiệp", scope: "Tất cả cơ sở", description: "Xem 3D nhiều cơ sở trong gói, thiết kế kệ, quét nhập thùng lên kệ, báo cáo và quản lý nhân viên." },
  { role: "manager", email: "manager@waremap.demo", label: "Quản lý kho", scope: "Kho trung tâm", description: "Xem và thiết kế Kho 3D, quét nhập thùng, nhập xuất, kiểm kê và chuyển hàng tại kho được phân công." },
  { role: "warehouse", email: "warehouse@waremap.demo", label: "Nhân viên kho", scope: "Kho trung tâm", description: "Xem Kho 3D và quét nhập thùng lên kệ tại kho được phân công. Không sửa kệ hoặc xem báo cáo quản trị." },
  { role: "sales", email: "sales@waremap.demo", label: "Nhân viên bán hàng", scope: "Kho trung tâm", description: "Tra cứu sản phẩm, tồn kho, vị trí và QR. Không điều chỉnh tồn, chuyển kho hoặc sửa sơ đồ." },
] satisfies { role: Role; email: string; label: string; scope: string; description: string }[]

export function roleDescription(role: Role) {
  return DEMO_ACCOUNTS.find(account => account.role === role)?.description ?? "Xét duyệt yêu cầu và quản trị khách hàng WareMap."
}
