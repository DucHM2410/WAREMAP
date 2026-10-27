import {
  AlertCircle,
  ArrowLeft,
  Baby,
  BarChart3,
  Bell,
  Building2,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  LayoutDashboard,
  Map,
  Menu,
  Package,
  ScanLine,
  Settings,
  Sparkles,
  Truck,
  Users,
  X,
} from "lucide-react"
import { useEffect, useState, type ReactNode } from "react"
import { branches, roleNames, type Screen } from "./model"
import { useApp } from "./store"
import { useIndustry } from "../shared/context/IndustryContext"
import { Badge, Brand, Button, SearchInput } from "./ui"

interface NavItem {
  screen: Screen
  label: string
  icon: typeof LayoutDashboard
  group: string
  roles?: string[]
}

const primaryNavigation: NavItem[] = [
  {
    screen: "dashboard",
    label: "Tổng quan",
    icon: LayoutDashboard,
    group: "Công việc chính",
  },
  {
    screen: "inventory",
    label: "Sản phẩm & tồn kho",
    icon: Package,
    group: "Công việc chính",
  },
  {
    screen: "onboarding",
    label: "Cảnh báo FEFO",
    icon: AlertCircle,
    group: "Công việc chính",
  },
]

const scanItem: NavItem = {
  screen: "scanner",
  label: "Quét QR nhanh",
  icon: ScanLine,
  group: "Công việc chính",
}

const moreNavigation: NavItem[] = [
  {
    screen: "batches",
    label: "Lô hàng",
    icon: ClipboardList,
    group: "Xem thêm",
  },
  {
    screen: "mobile",
    label: "Chuyển kho",
    icon: Truck,
    group: "Xem thêm",
    roles: ["owner", "manager", "warehouse"],
  },
  {
    screen: "warehouse",
    label: "Bản đồ & Builder",
    icon: Map,
    group: "Xem thêm",
  },
  {
    screen: "roi",
    label: "Báo cáo ROI",
    icon: BarChart3,
    group: "Xem thêm",
    roles: ["owner", "manager"],
  },
  {
    screen: "account",
    label: "Nhân viên & RBAC",
    icon: Users,
    group: "Xem thêm",
    roles: ["owner"],
  },
  {
    screen: "settings",
    label: "Cài đặt",
    icon: Settings,
    group: "Xem thêm",
    roles: ["owner", "manager"],
  },
]

const allNavigation = [...primaryNavigation, scanItem, ...moreNavigation]
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
  const [moreOpen, setMoreOpen] = useState(false)
  const { config } = useIndustry()
  const IndustryIcon = config.icon === "Baby" ? Baby : Sparkles
  const visibleMore = moreNavigation.filter(
    (n) => !n.roles || n.roles.includes(role),
  )
  const current = allNavigation.find((n) => n.screen === screen) || {
    label: screen === "admin" ? "Quản trị WareMap" : "Thiết lập sơ đồ kho",
    group: screen === "admin" ? "Nội bộ" : "Xem thêm",
  }
  const isActive = (target: Screen) =>
    screen === target || (screen === "builder" && target === "warehouse")
  useEffect(() => {
    setMoreOpen(moreNavigation.some((n) => isActive(n.screen)))
    // Only react to screen changes; the menu stays toggleable afterwards.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen])
  const navButton = (n: NavItem) => {
    const Icon = n.icon
    return (
      <button
        key={n.screen}
        className={`nav-item ${isActive(n.screen) ? "active" : ""}`}
        onClick={() => {
          if (n.screen === "scanner") setScanTask({ mode: "lookup" })
          go(n.screen)
          setOpen(false)
        }}
        aria-current={screen === n.screen ? "page" : undefined}
      >
        <Icon size={18} />
        {n.label}
      </button>
    )
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
        {role !== "platform" && (
          <button
            type="button"
            className="industry-pill"
            onClick={() => {
              go("industry-picker")
              setOpen(false)
            }}
            aria-label={`Ngành hàng đang chọn: ${config.label}. Đổi ngành hàng`}
          >
            <span className="industry-pill__icon">
              <IndustryIcon size={16} />
            </span>
            <span className="industry-pill__copy">
              <small>Ngành hàng</small>
              <strong>{config.shortLabel}</strong>
            </span>
            <ChevronDown size={14} />
          </button>
        )}
        <nav>
          {role === "platform" ? (
            <button className="nav-item active" onClick={() => go("admin")}>
              <Users size={18} />
              Quản trị khách hàng
            </button>
          ) : (
            <>
              <div className="nav-group">
                <span className="nav-caption">Công việc chính</span>
                {primaryNavigation
                  .filter((n) => !n.roles || n.roles.includes(role))
                  .map(navButton)}
                <button
                  type="button"
                  className={`nav-item nav-cta ${isActive("scanner") ? "active" : ""}`}
                  onClick={() => {
                    setScanTask({ mode: "lookup" })
                    go("scanner")
                    setOpen(false)
                  }}
                  aria-current={screen === "scanner" ? "page" : undefined}
                >
                  <ScanLine size={18} />
                  Quét QR nhanh
                </button>
              </div>
              <button
                type="button"
                className={`nav-more ${moreOpen ? "is-open" : ""}`}
                aria-expanded={moreOpen}
                aria-controls="nav-more-items"
                onClick={() => setMoreOpen((value) => !value)}
              >
                <ChevronDown size={17} />
                Xem thêm
                <span>{visibleMore.length}</span>
              </button>
              {moreOpen && (
                <div className="nav-group nav-group--more" id="nav-more-items">
                  <span className="nav-caption">Công cụ quản lý</span>
                  {visibleMore.map(navButton)}
                </div>
              )}
            </>
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
