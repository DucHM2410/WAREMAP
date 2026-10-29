import { Building2, Boxes, MapPin, ArrowUpRight } from "lucide-react"
import { WarehousePermissionTable } from "./WarehousePermissionTable"
import { useApp } from "../../app/store"

export function WarehouseLocations({
  overview = false,
}: {
  overview?: boolean
}) {
  const { data, accessibleBranches, branch, setBranch } = useApp()
  return (
    <section
      className={`warehouse-locations ${
        overview ? "warehouse-locations--overview" : ""
      }`}
      aria-label="Cơ sở kho được cấp quyền"
    >
      <div className="warehouse-location-heading">
        <div>
          <span className="eyebrow">CƠ SỞ KHO CỦA BẠN</span>
          <h2>
            {overview
              ? "Mỗi cơ sở, một không gian 3D riêng"
              : "Đang xem sơ đồ cơ sở"}
          </h2>
          <p>
            {accessibleBranches.length > 1
              ? "Chọn cơ sở để xem hàng hóa hoặc bố trí sơ đồ riêng. Thay đổi ở kho này không ảnh hưởng kho khác."
              : "Tài khoản hiện có quyền tại cơ sở này."}
          </p>
        </div>
        {!overview && accessibleBranches.length > 1 && (
          <button className="button secondary" onClick={() => setBranch("all")}>
            Tất cả cơ sở
          </button>
        )}
      </div>
      <div className="warehouse-location-grid">
        {accessibleBranches.map((name) => {
          const items = data.products.filter((p) => p.branch === name)
          const racks = data.racks[name] || []
          return (
            <button
              className={`warehouse-location ${
                branch === name ? "is-active" : ""
              }`}
              aria-pressed={branch === name}
              key={name}
              onClick={() => setBranch(name)}
            >
              {overview && (
                <div className="location-mini-map" aria-hidden="true">
                  {racks.slice(0, 6).map((r, index) => (
                    <span
                      key={r.id}
                      style={{
                        left: `${15 + (index % 3) * 27}%`,
                        top: `${15 + Math.floor(index / 3) * 42}%`,
                      }}
                    >
                      <i />
                      <i />
                      <i />
                    </span>
                  ))}
                </div>
              )}
              <div className="location-name">
                <Building2 size={20} />
                <strong>{name}</strong>
                <ArrowUpRight size={17} />
              </div>
              <div className="location-stats">
                <span>
                  <MapPin size={14} />
                  {racks.length} kệ
                </span>
                <span>
                  <Boxes size={14} />
                  {items.length} dòng hàng
                </span>
              </div>
              <small>{branch === name ? "Đang mở" : "Mở kho 3D"}</small>
            </button>
          )
        })}
      </div>
      {overview && (
        <p className="tiny muted">
          Chỉ hiển thị các cơ sở trong phạm vi tài khoản và số cơ sở của gói
          hiện tại.
        </p>
      )}
      <WarehousePermissionTable />
    </section>
  )
}
