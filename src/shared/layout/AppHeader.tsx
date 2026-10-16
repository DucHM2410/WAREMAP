import {
  Bell,
  MapPin,
  PackagePlus,
  RefreshCw,
  Search,
  ShieldCheck,
} from 'lucide-react'
import { Btn } from '../ui/Btn'
import { navigateTo, tabs } from './Sidebar'
import type { HeaderScreen, WareMapRole } from './Sidebar'

export function AppHeader({
  activeScreen,
  notify,
  theme = 'light',
  role = 'ADMIN_VIP',
}: {
  activeScreen: HeaderScreen
  notify: (msg: string) => void
  theme?: 'light' | 'dark'
  role?: WareMapRole
}) {
  const light = theme === 'light'
  const secondaryAction = role === 'STAFF_SALES' ? 'Tra cứu vị trí' : 'Nhập kho mới'
  const current = tabs.find((tab) => tab.id === activeScreen) ?? tabs[0]

  return (
    <header className={`wm-topbar ${light ? 'wm-topbar-light' : ''}`}>
      <div className="wm-page-context">
        <span>WareMap / {current.section}</span>
        <strong>{current.label}</strong>
      </div>
      <div className="wm-search">
        <Search size={15} />
        <span>Tìm SKU, lô hàng, vị trí...</span>
        <kbd>⌘ K</kbd>
      </div>
      <div className="wm-actions">
        <Btn
          variant="primary"
          size="sm"
          onClick={() => {
            notify('Đang mở trung tâm cảnh báo FEFO')
            navigateTo('onboarding')
          }}
        >
          <RefreshCw size={13} /> Cập nhật FEFO
        </Btn>
        <Btn
          variant="outline"
          size="sm"
          onClick={() => {
            notify(secondaryAction)
            navigateTo('inventory')
          }}
        >
          {role === 'STAFF_SALES' ? <MapPin size={13} /> : <PackagePlus size={13} />} {secondaryAction}
        </Btn>
        <Btn variant="ghost" size="sm" onClick={() => { notify('Bạn có 4 cảnh báo mới'); navigateTo('onboarding') }}>
          <Bell size={15} /><span className="wm-notification-dot" />
        </Btn>
        <div className="wm-system-state">
          <ShieldCheck size={14} />
          <span><strong>Đã đồng bộ</strong><small>11:45:02</small></span>
        </div>
      </div>
    </header>
  )
}
