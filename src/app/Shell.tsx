import {
  LockKeyhole,
  AlertCircle,
  ArrowLeft,
  Baby,
  BarChart3,
  Bell,
  Building2,
  ChevronDown,
  ClipboardList,
  LayoutDashboard,
  Map,
  Menu,
  PanelsTopLeft,
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

import { roleDescription } from "../shared/config/demoRoles"

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
export function Shell({ children }: { children: ReactNode }) {
  const {
    screen,
    go,
    branch,
    setBranch,
    accessibleBranches,
    role,
    logout,
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
    label: screen === "putaway" ? "Quét & nhập hàng lên kệ" : screen === "admin" ? "Quản trị WareMap" : screen === "website-editor" ? "Chỉnh sửa trang chủ" : "Thiết lập sơ đồ kho",
    group: screen === "admin" ? "Nội bộ" : "Xem thêm",
  }
  const isActive = (target: Screen) =>
    screen === target
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
        <span>{n.label}<small>{n.screen === "warehouse" ? "Kệ · sản phẩm · vị trí" : n.screen === "inventory" ? "Tra cứu và vận hành tồn kho" : n.screen === "dashboard" ? "Việc cần làm hôm nay" : ""}</small></span>
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
          <div
            className="industry-pill"
            aria-label={`Phân hệ doanh nghiệp: ${config.label}. Đã khóa`}
            title="Phân hệ khóa trong phiên demo. Đăng xuất rồi đăng nhập lại Chủ doanh để chọn lại"
          >
            <span className="industry-pill__icon">
              <IndustryIcon size={16} />
            </span>
            <span className="industry-pill__copy">
              <small>Ngành hàng</small>
              <strong>{config.shortLabel}</strong>
            </span>
            <LockKeyhole size={14} />
          </div>
        )}
        <nav>
          {role === "platform" ? (
            <button className={`nav-item ${screen === "admin" ? "active" : ""}`} onClick={() => go("admin")}>
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
                {["owner", "manager"].includes(role) && <button className={`builder-shortcut ${screen === "builder" ? "active" : ""}`} aria-current={screen === "builder" ? "page" : undefined} onClick={() => { go("builder"); setOpen(false) }}>↳ Thiết kế kho 3D</button>}
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
        {["owner", "platform"].includes(role) && <button className={`nav-item website-editor-link ${screen === "website-editor" ? "active" : ""}`} aria-current={screen === "website-editor" ? "page" : undefined} onClick={() => { go("website-editor"); setOpen(false) }}><PanelsTopLeft size={18}/><span>Chỉnh sửa trang chủ<small>Nội dung · hình ảnh · ngành hàng</small></span></button>}
        <div className="sidebar-footer">
          {data.trialDemo && role !== "platform" && (
            <section className="trial-plan-card" aria-label="Quyền lợi Free Trial">
              <strong>Free Trial · 0đ / 7 ngày</strong>
              <span>1 cơ sở · Tổng cộng 5 tài khoản</span>
              <ul>
                <li>1 Chủ doanh</li>
                <li>1 Quản lý kho</li>
                <li>3 Nhân viên</li>
              </ul>
            </section>
          )}
          <div className="demo-label">
            <span />
            Tài khoản demo đã đăng nhập
          </div>
          <Button variant="secondary" onClick={logout}>Đăng xuất / Đổi tài khoản</Button>
          <details className="role-permissions"><summary>Quyền của {roleNames[role]}</summary><p>{roleDescription(role)}</p><small>Phạm vi: {role === "owner" || role === "platform" ? "Tất cả cơ sở" : branches[0]}</small></details>
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
          <div className="breadcrumb"><strong>{current.label}</strong></div>
          {role !== "platform" && <span className="header-industry-pill" title="Phân hệ đã được Chủ doanh xác nhận"><IndustryIcon size={17} />{config.shortLabel}<LockKeyhole size={14} /></span>}
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
