import {
  AlertCircle,
  ArrowLeft,
  BarChart3,
  Bell,
  Box,
  Building2,
  ChevronRight,
  ClipboardList,
  LayoutDashboard,
  Map,
  Menu,
  Package,
  ScanLine,
  Settings,
  Truck,
  Users,
  X,
} from "lucide-react"
import { useState, type ReactNode } from "react"
import { branches, roleNames, type Screen } from "./model"
import { useApp } from "./store"
import { Badge, Brand, Button, SearchInput } from "./ui"
const navigation: {
  screen: Screen
  label: string
  icon: typeof Box
  group: string
  roles?: string[]
}[] = [
  {
    screen: "dashboard",
    label: "Tổng quan",
    icon: LayoutDashboard,
    group: "Theo dõi",
  },
  { screen: "warehouse", label: "Bản đồ kho", icon: Map, group: "Theo dõi" },
  {
    screen: "inventory",
    label: "Sản phẩm & tồn kho",
    icon: Package,
    group: "Vận hành",
  },
  {
    screen: "batches",
    label: "Lô hàng & hạn dùng",
    icon: ClipboardList,
    group: "Vận hành",
  },
  {
    screen: "mobile",
    label: "Chuyển kho",
    icon: Truck,
    group: "Vận hành",
    roles: ["owner", "manager", "warehouse"],
  },
  {
    screen: "onboarding",
    label: "Hàng cận hạn",
    icon: AlertCircle,
    group: "Vận hành",
  },
  { screen: "scanner", label: "Quét QR", icon: ScanLine, group: "Vận hành" },
  {
    screen: "roi",
    label: "Báo cáo hiệu quả",
    icon: BarChart3,
    group: "Quản lý",
    roles: ["owner", "manager"],
  },
  {
    screen: "account",
    label: "Nhân viên & phân quyền",
    icon: Users,
    group: "Quản lý",
    roles: ["owner"],
  },
  {
    screen: "settings",
    label: "Cài đặt",
    icon: Settings,
    group: "Quản lý",
    roles: ["owner", "manager"],
  },
]
export function Shell({ children }: { children: ReactNode }) {
  const {
    screen,
    go,
    branch,
    setBranch,
    role,
    setRole,
    search,
    setSearch,
    storageError,
    data,
    setScanTask,
  } = useApp()
  const [open, setOpen] = useState(false)
  const current = navigation.find((n) => n.screen === screen) || {
    label: screen === "admin" ? "Quản trị WareMap" : "Thiết lập sơ đồ kho",
    group: screen === "admin" ? "Nội bộ" : "Theo dõi",
  }
  return (
    <div className="workspace">
      <aside className={`sidebar ${open ? "is-open" : ""}`}>
        <button className="brand-button" onClick={() => go("home")}>
          <Brand />
        </button>
        <button
          className="mobile-close"
          aria-label="Đóng menu"
          onClick={() => setOpen(false)}
        >
          <X />
        </button>
        <div className="workspace-name">
          <span className="company-symbol">
            <Building2 size={19} />
          </span>
          <div>
            <strong>{data.company}</strong>
            <span>Không gian doanh nghiệp mẫu</span>
          </div>
        </div>
        <nav>
          {role === "platform" ? (
            <button className="nav-item active" onClick={() => go("admin")}>
              <Users size={18} />
              Quản trị khách hàng
            </button>
          ) : (
            ["Theo dõi", "Vận hành", "Quản lý"].map((group) => (
              <div className="nav-group" key={group}>
                <span className="nav-caption">{group}</span>
                {navigation
                  .filter(
                    (n) =>
                      n.group === group && (!n.roles || n.roles.includes(role)),
                  )
                  .map((n) => (
                    <button
                      key={n.screen}
                      className={`nav-item ${
                        screen === n.screen ||
                        (screen === "builder" && n.screen === "warehouse")
                          ? "active"
                          : ""
                      }`}
                      onClick={() => {
                        if (n.screen === "scanner")
                          setScanTask({ mode: "lookup" })
                        go(n.screen)
                        setOpen(false)
                      }}
                      aria-current={screen === n.screen ? "page" : undefined}
                    >
                      <n.icon size={18} />
                      {n.label}
                    </button>
                  ))}
              </div>
            ))
          )}
        </nav>
        <div className="sidebar-footer">
          <div className="demo-label">
            <span />
            Bản dùng thử
          </div>
          <label className="role-picker">
            Trải nghiệm vai trò
            <select
              aria-label="Trải nghiệm vai trò"
              value={role}
              onChange={(e) => setRole(e.target.value as typeof role)}
            >
              {Object.entries(roleNames).map(([id, name]) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
            </select>
          </label>
          <button className="back-home" onClick={() => go("home")}>
            <ArrowLeft size={15} />
            Về trang chủ
          </button>
        </div>
      </aside>
      {open && (
        <button
          className="mobile-backdrop"
          aria-label="Đóng menu"
          onClick={() => setOpen(false)}
        />
      )}
      <div className="workspace-main">
        <header className="app-header">
          <button
            className="mobile-menu"
            aria-label="Mở menu"
            onClick={() => setOpen(true)}
          >
            <Menu />
          </button>
          <div className="breadcrumb">
            <span>
              WareMap System <ChevronRight size={12} />
              {current.group}
            </span>
            <strong>{current.label}</strong>
          </div>
          {role !== "platform" && (
            <>
              <div className="global-search">
                <SearchInput
                  value={search}
                  onChange={(value) => {
                    if (screen !== "inventory" && screen !== "warehouse")
                      go("inventory")
                    setSearch(value)
                  }}
                  placeholder="Tìm tên hàng, mã hoặc vị trí…"
                />
              </div>
              <label className="branch-picker">
                <Building2 size={16} />
                <select
                  aria-label="Kho đang xem"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                >
                  {role === "owner" && (
                    <option value="all">Tất cả cơ sở</option>
                  )}
                  {(role === "owner" ? branches : [branches[0]]).map((b) => (
                    <option key={b}>{b}</option>
                  ))}
                </select>
              </label>
              <Button
                variant="ghost"
                onClick={() => go("onboarding")}
                aria-label="Xem hàng cận hạn"
              >
                <Bell size={19} />
              </Button>
            </>
          )}
        </header>
        <div className="demo-strip">
          <span>
            <span className="status-dot" />
            Dữ liệu minh họa · Thay đổi lưu trên trình duyệt này
          </span>
          <Badge>{roleNames[role]}</Badge>
        </div>
        {storageError && (
          <div className="callout danger">
            Trình duyệt chưa lưu được thay đổi. Hãy tải dữ liệu hoặc giải phóng
            bộ nhớ trước khi đóng trang.
          </div>
        )}
        <main
          id="main-content"
          className={`page-content ${
            screen === "builder" || screen === "warehouse" ? "map-page" : ""
          }`}
        >
          {children}
        </main>
        <footer className="app-footer">
          <span>WareMap System</span>
          <span>Mỗi mặt hàng, một vị trí rõ ràng.</span>
        </footer>
      </div>
    </div>
  )
}
