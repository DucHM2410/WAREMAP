import {
  AlertCircle,
  ArrowLeft,
  BarChart3,
  Bell,
  Building2,
  ChevronDown,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Map,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  PanelsTopLeft,
  Package,
  ScanLine,
  Settings,
  Truck,
  UserRound,
  Users,
  X,
} from "lucide-react"
import { useEffect, useRef, useState, type ReactNode } from "react"
import { daysLeft, roleNames, type Screen } from "./model"
import { useApp } from "./store"
import { useIndustry } from "../shared/context/IndustryContext"
import { Badge, Brand, Button, SearchInput } from "./ui"
import { canAccessScreen } from "./access"
import "./sidebar.css"
import waremapLogo from "../assets/brand/waremap-logo.jpg"


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
    screen: "warehouse",
    label: "Kho 3D",
    icon: Map,
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
    screen: "onboarding",
    label: "Cảnh báo FEFO",
    icon: AlertCircle,
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
const SIDEBAR_STORAGE_KEY = "waremap:sidebar"

function readCollapsedPreference() {
  try {
    return window.localStorage.getItem(SIDEBAR_STORAGE_KEY) === "collapsed"
  } catch {
    return false
  }
}

export function Shell({ children }: { children: ReactNode }) {
  const {
    screen,
    go,
    branch,
    setBranch,
    accessibleBranches,
    role,
    accessMode,
    logout,
    search,
    setSearch,
    storageError,
    data,
    visibleProducts,
    setScanTask,
  } = useApp()
  const [open, setOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const accountPopover = useRef<HTMLDivElement>(null)
  const [accountPosition, setAccountPosition] = useState({ left: 16, bottom: 80, maxHeight: 480, width: 240 })
  useEffect(() => {
    const close = () => accountPopover.current?.hidePopover()
    window.addEventListener("resize", close)
    return () => window.removeEventListener("resize", close)
  }, [])
  const [collapsed, setCollapsed] = useState(readCollapsedPreference)
  const [isMobile, setIsMobile] = useState(
    () => window.matchMedia("(max-width: 700px)").matches,
  )
  const rail = collapsed && !isMobile
  const { config } = useIndustry()
  const fefoAlertCount = visibleProducts.filter(
    (product) =>
      product.qty > 0 && daysLeft(product.expiry) <= data.settings.expiryDays,
  ).length
  const operations = [...primaryNavigation, ...moreNavigation.filter(n => ["batches", "onboarding", "mobile"].includes(n.screen))].filter(n => canAccessScreen(accessMode, role, n.screen))
  const management = moreNavigation.filter(n => ["roi", "account", "settings"].includes(n.screen) && canAccessScreen(accessMode, role, n.screen))
  const accountNavigate = (next: Screen) => { accountPopover.current?.hidePopover(); setOpen(false); go(next) }
  const current = allNavigation.find((n) => n.screen === screen) || {
    label: screen === "putaway" ? "Quét & nhập hàng lên kệ" : screen === "admin" ? "Quản trị WareMap" : screen === "website-editor" ? "Chỉnh sửa trang chủ" : "Thiết lập sơ đồ kho",
    group: screen === "admin" ? "Nội bộ" : "Xem thêm",
  }
  const isActive = (target: Screen) =>
    screen === target || (target === "warehouse" && ["builder", "putaway"].includes(screen))
  useEffect(() => {
    try {
      window.localStorage.setItem(
        SIDEBAR_STORAGE_KEY,
        collapsed ? "collapsed" : "expanded",
      )
    } catch {
      // The sidebar preference simply is not remembered in restricted browsers.
    }
  }, [collapsed])
  useEffect(() => {
    const media = window.matchMedia("(max-width: 700px)")
    const handleChange = () => setIsMobile(media.matches)
    handleChange()
    media.addEventListener("change", handleChange)
    return () => media.removeEventListener("change", handleChange)
  }, [])
  const navButton = (n: NavItem) => {
    const Icon = n.icon
    return (
      <button
        key={n.screen}
        className={`nav-item ${n.screen === "onboarding" ? `nav-item--fefo ${fefoAlertCount ? "has-alerts" : ""}` : ""} ${isActive(n.screen) ? "active" : ""}`}
        onClick={() => {
          if (n.screen === "scanner") setScanTask({ mode: "lookup" })
          go(n.screen)
          setOpen(false)
        }}
        aria-current={screen === n.screen ? "page" : undefined}
        aria-label={
          n.screen === "onboarding" && fefoAlertCount
            ? `${n.label}, ${fefoAlertCount} lô cần chú ý`
            : undefined
        }
        title={n.label}
      >
        <Icon size={18} />
        <span>{n.label === "Nhân viên & RBAC" ? "Nhân viên" : n.label === "Báo cáo ROI" ? "Báo cáo" : n.label}</span>
        {n.screen === "onboarding" && fefoAlertCount > 0 && (
          <span className="nav-item__fefo-count" aria-hidden="true">
            {fefoAlertCount}
          </span>
        )}
      </button>
    )
  }
  return (
    <div className={`workspace ${rail ? "sidebar-collapsed" : ""}`}>
      <aside
        id="app-sidebar"
        className={`sidebar ${open ? "is-open" : ""}`}
        aria-label="Thanh điều hướng"
      >
        <button
          className="brand-button"
          onClick={() => go("home")}
          title="WAREMAP · Về trang chủ"
        >
          <Brand />
          <span className="brand-mark" aria-hidden="true">
            <img src={waremapLogo} alt="" />
          </span>
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
            <span>{role === "platform" ? "Quản trị WareMap" : config.shortLabel}</span>
          </div>
        </div>
        <nav>
          {role === "platform" ? (
            <button
              className={`nav-item ${screen === "admin" ? "active" : ""}`}
              onClick={() => go("admin")}
              title="Quản trị khách hàng"
            >
              <Users size={18} />
              <span>Quản trị khách hàng</span>
            </button>
          ) : (
            <>
              <div className="nav-group"><span className="nav-caption">Vận hành</span>{operations.map(navButton)}</div>
              {management.length > 0 && <div className="nav-group"><span className="nav-caption">Quản lý</span>{management.map(navButton)}</div>}
            </>
          )}
        </nav>
        <div className="sidebar-footer">
          <button className="sidebar-account" popoverTarget="sidebar-account-menu" aria-expanded={accountOpen} aria-controls="sidebar-account-menu" onClick={e => {
            const rect = e.currentTarget.getBoundingClientRect()
            const width = Math.min(rail ? 280 : rect.width, window.innerWidth - 24)
            setAccountPosition({ left: Math.max(12, Math.min(rect.left, window.innerWidth - width - 12)), bottom: window.innerHeight - rect.top + 8, maxHeight: Math.max(120, rect.top - 24), width })
          }} aria-label="Tài khoản và gói dịch vụ" title="Tài khoản và gói dịch vụ">
            <span className="sidebar-account-avatar"><UserRound size={19}/></span>
            {!rail && <span className="sidebar-account-copy"><strong>{roleNames[role]}</strong><small>{role === "platform" ? "Nội bộ WareMap" : data.trialDemo ? "Free Trial · 7 ngày" : data.locations === 1 ? "Gói Đơn lẻ" : "Gói Chuỗi"}</small></span>}
            {!rail && <ChevronDown size={15}/>}
          </button>
        </div>
      </aside>
      <div id="sidebar-account-menu" ref={accountPopover} popover="auto" className="sidebar-account-popover" role="navigation" aria-label="Menu tài khoản"
        style={{ left: accountPosition.left, bottom: accountPosition.bottom, maxHeight: accountPosition.maxHeight, width: accountPosition.width }}
        onToggle={e => setAccountOpen((e.nativeEvent as ToggleEvent).newState === "open")}>
        <div className="account-menu-identity"><span className="sidebar-account-avatar"><UserRound size={18}/></span><div><strong>{roleNames[role]}</strong><small>{role === "platform" ? "Nội bộ WareMap" : data.trialDemo ? "Free Trial · 7 ngày" : data.locations === 1 ? "Gói Đơn lẻ" : "Gói Chuỗi"}</small></div></div>
        <div className="account-menu-divider" />
        {canAccessScreen(accessMode, role, "settings") && <button onClick={() => accountNavigate("settings")}><Settings size={17}/>Cài đặt & gói dịch vụ</button>}
        {canAccessScreen(accessMode, role, "website-editor") && <button onClick={() => accountNavigate("website-editor")}><PanelsTopLeft size={17}/>Chỉnh sửa trang chủ</button>}
        <button onClick={() => accountNavigate("home")}><ArrowLeft size={17}/>Về trang chủ</button>
        <div className="account-menu-divider" />
        <button onClick={() => { accountPopover.current?.hidePopover(); setOpen(false); logout() }}><LogOut size={17}/>Đăng xuất / Đổi tài khoản</button>
      </div>
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
          <button
            type="button"
            className="sidebar-toggle"
            onClick={() => setCollapsed((value) => !value)}
            aria-controls="app-sidebar"
            aria-expanded={!rail}
            aria-label={rail ? "Mở rộng thanh bên" : "Thu gọn thanh bên"}
            title={rail ? "Mở rộng thanh bên" : "Thu gọn thanh bên"}
          >
            {rail ? <PanelLeftOpen size={19} /> : <PanelLeftClose size={19} />}
          </button>
          <div className="breadcrumb"><strong>{current.label}</strong></div>

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
                  {accessibleBranches.length > 1 && (
                    <option value="all">Tất cả cơ sở</option>
                  )}
                  {accessibleBranches.map((b) => (
                    <option key={b}>{b}</option>
                  ))}
                </select>
              </label>
              <Button className="header-qr-action" onClick={() => { setScanTask({ mode: "lookup" }); go("scanner") }} title="Quét QR nhanh" aria-label="Quét QR nhanh"><ScanLine size={18}/><span>Quét QR</span></Button>
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
            {data.trialDemo ? "Free Trial demo · 0đ/7 ngày · 1 cơ sở · 1 Chủ doanh + 1 Quản lý kho + 3 Nhân viên · Không đếm hạn thật" : "Dữ liệu minh họa · Thay đổi lưu trên trình duyệt này"}
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
