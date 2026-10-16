import {
  AlertTriangle,
  BarChart3,
  Boxes,
  Building2,
  ChevronDown,
  LayoutDashboard,
  Package,
  Settings,
  Smartphone,
  Truck,
  User,
  Users,
  Warehouse,
} from 'lucide-react'
import { Btn } from '../ui/Btn'

export type WareMapRole = 'ADMIN_VIP' | 'MANAGER' | 'STAFF_WAREHOUSE' | 'STAFF_SALES'
export type HeaderScreen = 'S1' | 'S2' | 'S3' | 'S4' | 'S5' | 'S6' | 'S7' | 'ACCOUNT' | 'SETTINGS'

export const tabs: Array<{
  id: HeaderScreen
  label: string
  section: 'Vận hành' | 'Quản trị'
  icon: typeof LayoutDashboard
  roles: WareMapRole[]
  badge?: number
}> = [
  { id: 'S1', label: 'Tổng quan', section: 'Vận hành', icon: LayoutDashboard, roles: ['ADMIN_VIP', 'MANAGER', 'STAFF_WAREHOUSE', 'STAFF_SALES'] },
  { id: 'S6', label: 'Sản phẩm & tồn kho', section: 'Vận hành', icon: Warehouse, roles: ['ADMIN_VIP', 'MANAGER', 'STAFF_WAREHOUSE', 'STAFF_SALES'] },
  { id: 'S5', label: 'Lô hàng & hạn dùng', section: 'Vận hành', icon: Package, roles: ['ADMIN_VIP', 'MANAGER', 'STAFF_WAREHOUSE'] },
  { id: 'S3', label: 'Chuyển kho', section: 'Vận hành', icon: Truck, roles: ['ADMIN_VIP', 'MANAGER', 'STAFF_WAREHOUSE'] },
  { id: 'S4', label: 'Cảnh báo FEFO', section: 'Vận hành', icon: AlertTriangle, roles: ['ADMIN_VIP', 'MANAGER'], badge: 4 },
  { id: 'S2', label: 'Bản đồ & 3D Builder', section: 'Vận hành', icon: Boxes, roles: ['ADMIN_VIP', 'MANAGER'] },
  { id: 'S7', label: 'Báo cáo ROI', section: 'Quản trị', icon: BarChart3, roles: ['ADMIN_VIP'] },
  { id: 'ACCOUNT', label: 'Nhân viên & RBAC', section: 'Quản trị', icon: Users, roles: ['ADMIN_VIP'] },
  { id: 'SETTINGS', label: 'Cài đặt hệ thống', section: 'Quản trị', icon: Settings, roles: ['ADMIN_VIP', 'MANAGER'] },
]

const screenRoutes: Record<HeaderScreen, string> = {
  S1: 'dashboard',
  S2: 'builder',
  S3: 'mobile',
  S4: 'onboarding',
  S5: 'batches',
  S6: 'inventory',
  S7: 'roi',
  ACCOUNT: 'account',
  SETTINGS: 'settings',
}

export function navigateTo(screen: string) {
  window.dispatchEvent(new CustomEvent('waremap:navigate', { detail: screen }))
}

export function Sidebar({
  activeScreen,
  notify,
  role = 'ADMIN_VIP',
}: {
  activeScreen: HeaderScreen
  notify: (msg: string) => void
  role?: WareMapRole
}) {
  const visibleTabs = tabs.filter((tab) => tab.roles.includes(role))

  return (
    <aside className="wm-sidebar" aria-label="Điều hướng chính">
      <div className="wm-brand">
        <div className="wm-logo"><Warehouse size={19} /></div>
        <div>
          <div className="wm-brand-name">WareMap</div>
          <span className="wm-brand-caption">Warehouse OS · v5.0</span>
        </div>
      </div>

      <Btn className="wm-branch" variant="ghost" full onClick={() => notify('Đã mở bộ chọn chi nhánh')}>
        <span className="wm-branch-icon"><Building2 size={15} /></span>
        <span><strong>HC Cosmetics</strong><small>Kho Trung Tâm</small></span>
        <ChevronDown size={14} />
      </Btn>

      <nav className="wm-side-nav">
        {(['Vận hành', 'Quản trị'] as const).map((section) => {
          const sectionItems = visibleTabs.filter((tab) => tab.section === section)
          if (!sectionItems.length) return null
          return (
            <div className="wm-nav-section" key={section}>
              <span className="wm-nav-label">{section}</span>
              {sectionItems.map((tab) => {
                const Icon = tab.icon
                return (
                  <Btn
                    className={`wm-nav-item ${activeScreen === tab.id ? 'active' : ''}`}
                    variant="ghost"
                    full
                    key={tab.id}
                    onClick={() => {
                      notify(`Đang chuyển đến ${tab.label}`)
                      navigateTo(screenRoutes[tab.id])
                    }}
                  >
                    <Icon size={17} />
                    <span>{tab.label}</span>
                    {tab.badge && <b>{tab.badge}</b>}
                  </Btn>
                )
              })}
            </div>
          )
        })}
      </nav>

      <div className="wm-sidebar-foot">
        <Btn className="wm-scan-link" variant="ghost" full onClick={() => navigateTo('scanner')}>
          <Smartphone size={17} /><span>Quét QR nhanh</span>
        </Btn>
        <div className="wm-side-user">
          <div className="wm-avatar"><User size={15} /></div>
          <div><strong>Nguyễn Q. Lý</strong><span>{role}</span></div>
        </div>
      </div>
    </aside>
  )
}
