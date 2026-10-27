import type { Role } from "../../app/model"

// Local demo identities only. Production authentication must be handled by a backend.
export const DEMO_PASSWORD = "WareMap@123"
export const DEMO_ACCOUNTS = [
  { role: "owner", email: "owner@waremap.demo", label: "Chủ doanh nghiệp", scope: "Tất cả cơ sở", description: "Toàn quyền kho, Builder 3D, báo cáo và yêu cầu cấp tài khoản nhân viên." },
  { role: "manager", email: "manager@waremap.demo", label: "Quản lý kho", scope: "Kho trung tâm", description: "Thiết kế kho 3D, nhập xuất, kiểm kê, chuyển kho và xử lý cảnh báo. Không quản lý tài khoản." },
  { role: "warehouse", email: "warehouse@waremap.demo", label: "Nhân viên kho", scope: "Kho trung tâm", description: "Tra cứu 3D, nhập xuất, kiểm kê và quét QR. Không sửa sơ đồ hoặc xem báo cáo quản trị." },
  { role: "sales", email: "sales@waremap.demo", label: "Nhân viên bán hàng", scope: "Kho trung tâm", description: "Tra cứu sản phẩm, tồn kho, vị trí và QR. Không điều chỉnh tồn, chuyển kho hoặc sửa sơ đồ." },
] satisfies { role: Role; email: string; label: string; scope: string; description: string }[]

export function roleDescription(role: Role) {
  return DEMO_ACCOUNTS.find(account => account.role === role)?.description ?? "Xét duyệt yêu cầu và quản trị khách hàng WareMap."
}
