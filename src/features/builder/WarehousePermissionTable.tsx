import { roleNames, type Role } from "../../app/model"
import { WAREHOUSE_PERMISSIONS } from "../../app/warehousePermissions"
export function WarehousePermissionTable() {
  return <details className="warehouse-permission-table"><summary>Ai được xem và thao tác Kho 3D?</summary><div className="table-scroll"><table><thead><tr><th>Vai trò</th><th>Xem 3D</th><th>Sửa kệ</th><th>Nhập lên kệ</th><th>Phạm vi</th></tr></thead><tbody>{Object.entries(WAREHOUSE_PERMISSIONS).map(([role,p]) => <tr key={role}><td>{roleNames[role as Role]}</td><td>{p.view ? "Có" : "Không"}</td><td>{p.design ? "Có" : "Không"}</td><td>{p.putaway ? "Có" : "Không"}</td><td>{p.scope}</td></tr>)}</tbody></table></div><p className="tiny muted">Khách chưa đăng nhập chỉ xem kho mẫu. Tài khoản demo quản lý/nhân viên hiện được gán Kho trung tâm.</p></details>
}
