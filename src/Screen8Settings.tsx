import { useRef, useState } from 'react'
import type { ReactNode } from 'react'
import {
  Bell,
  Building2,
  Check,
  CheckCircle2,
  ChevronRight,
  CloudCog,
  Database,
  Eye,
  EyeOff,
  KeyRound,
  Link2,
  LockKeyhole,
  MessageCircle,
  PlugZap,
  Save,
  Send,
  Settings2,
  ShieldCheck,
  Smartphone,
  TestTube2,
  UserCog,
} from 'lucide-react'
import { Btn, MonoLabel } from './shared'
import { WareMapHeader } from './WareMapHeader'

type MenuId = 'store' | 'pos' | 'zalo' | 'notifications' | 'rbac' | 'security'

const menuItems: Array<{ id: MenuId; label: string; description: string; icon: typeof Building2 }> = [
  { id: 'store', label: 'Thông tin cửa hàng', description: 'Hồ sơ doanh nghiệp', icon: Building2 },
  { id: 'pos', label: 'Tích hợp POS', description: 'KiotViet, Sapo', icon: PlugZap },
  { id: 'zalo', label: 'Zalo OA', description: 'Cảnh báo tự động', icon: MessageCircle },
  { id: 'notifications', label: 'Thông báo', description: 'PWA, Email, Zalo', icon: Bell },
  { id: 'rbac', label: 'Phân quyền', description: 'Vai trò và truy cập', icon: UserCog },
  { id: 'security', label: 'Sao lưu & Bảo mật', description: 'Dữ liệu và đăng nhập', icon: LockKeyhole },
]

function SettingsMenu({
  active,
  setActive,
}: {
  active: MenuId
  setActive: (id: MenuId) => void
}) {
  return (
    <aside className="si-left">
      <div className="si-panel-title">
        <div><MonoLabel size={9} color="#0891B2">SYSTEM PREFERENCES</MonoLabel><strong>MENU CÀI ĐẶT</strong></div>
        <Settings2 size={18} />
      </div>

      <div className="si-store-card">
        <div className="si-store-logo"><Building2 size={18} /></div>
        <div><strong>Mẹ & Bé Chi Nhánh A</strong><span>WareMap Business · ADMIN_VIP</span></div>
        <CheckCircle2 size={15} />
      </div>

      <nav className="si-menu">
        {menuItems.map(({ id, label, description, icon: Icon }) => (
          <div className={active === id ? 'active' : ''} key={id} onClick={() => setActive(id)}>
            <span className="si-menu-icon"><Icon size={15} /></span>
            <span><strong>{label}</strong><small>{description}</small></span>
            <ChevronRight size={14} />
          </div>
        ))}
      </nav>

      <div className="si-system-status">
        <div><span>TRẠNG THÁI HỆ THỐNG</span><b>ONLINE</b></div>
        <div><i /><span>Đồng bộ POS</span><strong>Bình thường</strong></div>
        <div><i /><span>Zalo OA API</span><strong>Bình thường</strong></div>
        <div><i /><span>Sao lưu gần nhất</span><strong>11:30 hôm nay</strong></div>
      </div>
    </aside>
  )
}

function PosLogo({ type }: { type: 'kiot' | 'sapo' }) {
  return (
    <div className={`si-pos-logo ${type}`}>
      {type === 'kiot' ? <><span>K</span><strong>KiotViet</strong></> : <><span>S</span><strong>Sapo</strong></>}
    </div>
  )
}

function PosIntegrations({
  sapoConnected,
  setSapoConnected,
  notify,
}: {
  sapoConnected: boolean
  setSapoConnected: (connected: boolean) => void
  notify: (message: string) => void
}) {
  return (
    <section className="si-section">
      <div className="si-section-head">
        <div><span>ĐỒNG BỘ BÁN HÀNG</span><strong>TÍCH HỢP POS</strong><small>Kết nối dữ liệu sản phẩm, tồn kho và đơn hàng theo thời gian thực.</small></div>
        <Database size={18} />
      </div>
      <div className="si-pos-grid">
        <article className="si-pos-card connected">
          <PosLogo type="kiot" />
          <div className="si-pos-copy">
            <strong>KiotViet</strong>
            <span>Đồng bộ 1.847 SKU · Cập nhật 2 phút trước</span>
            <div className="si-connected-pill"><i /> Đã kết nối</div>
          </div>
          <Btn
            variant="ghost"
            size="sm"
            onClick={() => notify('Đã mở cấu hình kết nối KiotViet')}
            style={{ color: '#475569', background: '#FFFFFF', borderColor: '#CBD5E1' }}
          >
            <Settings2 size={13} /> Cấu hình
          </Btn>
        </article>

        <article className={`si-pos-card ${sapoConnected ? 'connected' : ''}`}>
          <PosLogo type="sapo" />
          <div className="si-pos-copy">
            <strong>Sapo</strong>
            <span>{sapoConnected ? 'Đồng bộ đã sẵn sàng' : 'Kết nối thêm một nguồn dữ liệu bán hàng'}</span>
            <div className={`si-connected-pill ${sapoConnected ? '' : 'offline'}`}><i /> {sapoConnected ? 'Đã kết nối' : 'Chưa kết nối'}</div>
          </div>
          <Btn
            variant="cyan"
            size="sm"
            onClick={() => {
              setSapoConnected(!sapoConnected)
              notify(sapoConnected ? 'Đã ngắt kết nối Sapo' : 'Đã kết nối Sapo thành công')
            }}
            style={sapoConnected
              ? { color: '#475569', background: '#FFFFFF', borderColor: '#CBD5E1' }
              : { color: '#FFFFFF', background: '#0891B2', borderColor: '#0891B2' }}
          >
            <Link2 size={13} /> {sapoConnected ? 'Ngắt kết nối' : 'Kết nối'}
          </Btn>
        </article>
      </div>
    </section>
  )
}

function InputField({
  label,
  icon: Icon,
  value,
  onChange,
  mono,
  type = 'text',
  action,
}: {
  label: string
  icon: typeof Building2
  value: string
  onChange: (value: string) => void
  mono?: boolean
  type?: string
  action?: ReactNode
}) {
  return (
    <label className="si-field">
      <span>{label}</span>
      <div className={mono ? 'mono' : ''}>
        <Icon size={14} />
        <input type={type} value={value} onChange={(event) => onChange(event.target.value)} />
        {action}
      </div>
    </label>
  )
}

function ZaloConfiguration({
  notify,
}: {
  notify: (message: string) => void
}) {
  const [oaId, setOaId] = useState('3865472901285471092')
  const [token, setToken] = useState('zalo_oa_wm_live_9f82b4e7')
  const [oaName, setOaName] = useState('Mẹ & Bé Chi Nhánh A')
  const [tokenVisible, setTokenVisible] = useState(false)
  const [autoFefo, setAutoFefo] = useState(true)

  return (
    <section className="si-section">
      <div className="si-section-head">
        <div><span>AUTOMATED MESSAGING</span><strong>ZALO OFFICIAL ACCOUNT</strong><small>Gửi cảnh báo FEFO và thông báo vận hành đến quản lý chi nhánh.</small></div>
        <MessageCircle size={18} />
      </div>

      <div className="si-zalo-form">
        <div className="si-zalo-fields">
          <InputField label="Zalo OA ID" icon={Smartphone} value={oaId} onChange={setOaId} mono />
          <InputField
            label="Access Token"
            icon={KeyRound}
            value={token}
            onChange={setToken}
            mono
            type={tokenVisible ? 'text' : 'password'}
            action={
              <span className="si-token-eye" onClick={() => setTokenVisible((visible) => !visible)}>
                {tokenVisible ? <EyeOff size={13} /> : <Eye size={13} />}
              </span>
            }
          />
          <InputField label="Tên OA" icon={Building2} value={oaName} onChange={setOaName} />
        </div>

        <div className="si-auto-fefo">
          <div className="si-auto-icon"><ShieldCheck size={17} /></div>
          <div><strong>Gửi cảnh báo FEFO tự động</strong><span>Tự động gửi Zalo khi lô hàng còn dưới 30 ngày sử dụng.</span></div>
          <Btn
            variant={autoFefo ? 'success' : 'ghost'}
            size="sm"
            onClick={() => setAutoFefo((enabled) => !enabled)}
            style={{
              width: 45,
              height: 25,
              padding: 3,
              justifyContent: autoFefo ? 'flex-end' : 'flex-start',
              background: autoFefo ? '#059669' : '#E2E8F0',
              borderColor: autoFefo ? '#059669' : '#CBD5E1',
            }}
          >
            <span className="si-toggle-knob" />
          </Btn>
        </div>

        <div className="si-form-actions">
          <Btn
            variant="ghost"
            size="md"
            onClick={() => notify('Kết nối Zalo OA hoạt động bình thường · 186ms')}
            style={{ color: '#475569', background: '#FFFFFF', borderColor: '#CBD5E1' }}
          >
            <TestTube2 size={14} /> Kiểm tra kết nối
          </Btn>
          <Btn
            variant="cyan"
            size="md"
            onClick={() => notify('Đã lưu cấu hình Zalo OA')}
            style={{ color: '#FFFFFF', background: '#0891B2', borderColor: '#0891B2' }}
          >
            <Save size={14} /> Lưu cấu hình
          </Btn>
        </div>
      </div>
    </section>
  )
}

function ZaloPreview({ notify }: { notify: (message: string) => void }) {
  return (
    <aside className="si-right">
      <div className="si-panel-title">
        <div><MonoLabel size={9} color="#0068FF">MESSAGE PREVIEW</MonoLabel><strong>XEM TRƯỚC TIN NHẮN ZALO</strong></div>
        <MessageCircle size={18} />
      </div>

      <div className="si-preview-device">
        <div className="si-preview-head">
          <div className="si-zalo-avatar">Z</div>
          <div><strong>WareMap Alert</strong><span>Official Account</span></div>
          <span className="si-oa-verified"><Check size={10} /></span>
        </div>
        <div className="si-chat-bg">
          <div className="si-chat-date">HÔM NAY · 11:45</div>
          <div className="si-chat-bubble">
            <div className="si-alert-label"><Bell size={12} /> WAREMAP ALERT</div>
            <strong>[WAREMAP ALERT] Cửa Hàng Chi Nhánh A</strong>
            <p>Cảnh báo Lô hàng cận hạn sử dụng:</p>
            <ul>
              <li><span>Tên sản phẩm:</span> Kem Dưỡng B 50ml</li>
              <li><span>Mã Lô:</span> <b>LOT-WM-2026</b></li>
              <li><span>Hạn SD:</span> 15/10/2026 <em>(Còn 23 ngày)</em></li>
              <li><span>Vị trí 3D WareMap:</span> Kệ A1 - Tầng 2 - Ô 03</li>
            </ul>
            <div className="si-map-link">👉 Bấm để mở Bản đồ 3D WareMap chỉ đường nhặt hàng.</div>
            <small>11:45 · Đã gửi</small>
          </div>
        </div>
      </div>

      <div className="si-preview-info">
        <div><span>KÊNH GỬI</span><strong><MessageCircle size={12} /> Zalo OA</strong></div>
        <div><span>ĐỐI TƯỢNG</span><strong>Quản lý Chi nhánh A</strong></div>
        <div><span>TRIGGER</span><strong>Lô dưới 30 ngày</strong></div>
      </div>

      <Btn
        variant="primary"
        size="md"
        full
        onClick={() => notify('Đã gửi thử tin nhắn Zalo OA')}
        style={{ color: '#FFFFFF', background: '#0068FF', borderColor: '#0068FF' }}
      >
        <Send size={14} /> Gửi thử
      </Btn>

      <div className="si-delivery-note">
        <CloudCog size={16} />
        <div><strong>Chế độ thử nghiệm</strong><span>Tin nhắn chỉ được gửi đến số điện thoại quản trị viên.</span></div>
      </div>
    </aside>
  )
}

export default function Screen8Settings() {
  const [activeMenu, setActiveMenu] = useState<MenuId>('pos')
  const [sapoConnected, setSapoConnected] = useState(false)
  const [toast, setToast] = useState('Cấu hình hệ thống đã được tải')
  const timer = useRef<number | null>(null)

  const notify = (message: string) => {
    setToast(message)
    if (timer.current) window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setToast(''), 2600)
  }

  return (
    <div className="wm-shell wm-light si-shell">
      <WareMapHeader activeScreen="SETTINGS" theme="light" notify={notify} />
      <div className="si-layout">
        <SettingsMenu
          active={activeMenu}
          setActive={(id) => {
            setActiveMenu(id)
            if (id !== 'pos' && id !== 'zalo') notify(`Đã chọn ${menuItems.find((item) => item.id === id)?.label}`)
          }}
        />
        <main className="si-center">
          <div className="si-content-head">
            <div><MonoLabel size={9} color="#0891B2">INTEGRATION CENTER</MonoLabel><strong>KẾT NỐI & TỰ ĐỘNG HÓA</strong><span>Quản lý hệ thống bán hàng và kênh cảnh báo khách hàng.</span></div>
            <span><i /> Mọi dịch vụ hoạt động bình thường</span>
          </div>
          <PosIntegrations sapoConnected={sapoConnected} setSapoConnected={setSapoConnected} notify={notify} />
          <ZaloConfiguration notify={notify} />
        </main>
        <ZaloPreview notify={notify} />
      </div>
      <div className="si-bottom">
        <span><i /> Hệ thống tích hợp: <strong>Ổn định</strong></span>
        <span>KiotViet: <strong>Đã kết nối</strong></span>
        <span>Zalo OA: <strong>Đã xác thực</strong></span>
        <MonoLabel size={9}>CONFIG VERSION · 5.0.24</MonoLabel>
      </div>
      {toast && <div className="wm-toast"><Check size={15} /> {toast}</div>}
    </div>
  )
}
