import { useMemo, useRef, useState } from 'react'
import {
  Building2,
  Check,
  CheckCircle2,
  Crown,
  KeyRound,
  Lock,
  Mail,
  Phone,
  Plus,
  Save,
  Search,
  Shield,
  ShieldCheck,
  UserRound,
  Users,
  X,
} from 'lucide-react'
import { Btn, MonoLabel } from './shared'
import { WareMapHeader } from './WareMapHeader'

type Role = 'ADMIN_VIP' | 'MANAGER' | 'STAFF_WAREHOUSE' | 'STAFF_SALES'
type Permission = 'yes' | 'no' | 'locked'

interface Account {
  id: number
  name: string
  email: string
  phone: string
  branch: string
  role: Role
  active: boolean
  initials: string
  color: string
}

const initialAccounts: Account[] = [
  {
    id: 1,
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@waremap.vn',
    phone: '090 123 4567',
    branch: 'Kho Tổng',
    role: 'MANAGER',
    active: true,
    initials: 'NA',
    color: '#0891B2',
  },
  {
    id: 2,
    name: 'Trần Thị B',
    email: 'tranthib@waremap.vn',
    phone: '091 234 5678',
    branch: 'CN Quận 3',
    role: 'STAFF_WAREHOUSE',
    active: true,
    initials: 'TB',
    color: '#2563EB',
  },
  {
    id: 3,
    name: 'Lê Văn C',
    email: 'levanc@waremap.vn',
    phone: '092 345 6789',
    branch: 'CN Thủ Đức',
    role: 'STAFF_SALES',
    active: false,
    initials: 'LC',
    color: '#64748B',
  },
]

const roles: Role[] = ['ADMIN_VIP', 'MANAGER', 'STAFF_WAREHOUSE', 'STAFF_SALES']

const permissionRows: Array<{ feature: string; values: Record<Role, Permission> }> = [
  { feature: 'Quản lý Tài khoản con', values: { ADMIN_VIP: 'yes', MANAGER: 'locked', STAFF_WAREHOUSE: 'no', STAFF_SALES: 'no' } },
  { feature: 'Xem Doanh thu & Giá vốn', values: { ADMIN_VIP: 'yes', MANAGER: 'yes', STAFF_WAREHOUSE: 'locked', STAFF_SALES: 'yes' } },
  { feature: 'Tự vẽ Sơ đồ Kho 3D', values: { ADMIN_VIP: 'yes', MANAGER: 'yes', STAFF_WAREHOUSE: 'locked', STAFF_SALES: 'no' } },
  { feature: 'Duyệt Phiếu chuyển hàng', values: { ADMIN_VIP: 'yes', MANAGER: 'yes', STAFF_WAREHOUSE: 'locked', STAFF_SALES: 'no' } },
  { feature: 'Tạo Phiếu Nhập/Xuất', values: { ADMIN_VIP: 'yes', MANAGER: 'yes', STAFF_WAREHOUSE: 'yes', STAFF_SALES: 'locked' } },
  { feature: 'Quét mã QR 2 chiều', values: { ADMIN_VIP: 'yes', MANAGER: 'yes', STAFF_WAREHOUSE: 'yes', STAFF_SALES: 'yes' } },
  { feature: 'Quick Scan Mode', values: { ADMIN_VIP: 'yes', MANAGER: 'yes', STAFF_WAREHOUSE: 'yes', STAFF_SALES: 'no' } },
  { feature: 'Tra cứu Vị trí Kệ 3D', values: { ADMIN_VIP: 'yes', MANAGER: 'yes', STAFF_WAREHOUSE: 'yes', STAFF_SALES: 'yes' } },
]

function roleLabel(role: Role) {
  return role.replace('_', ' ')
}

function AccountList({
  accounts,
  selectedId,
  query,
  setQuery,
  setSelectedId,
  onCreate,
}: {
  accounts: Account[]
  selectedId: number
  query: string
  setQuery: (query: string) => void
  setSelectedId: (id: number) => void
  onCreate: () => void
}) {
  const filtered = accounts.filter((account) => (
    account.name.toLowerCase().includes(query.toLowerCase())
    || account.role.toLowerCase().includes(query.toLowerCase())
  ))

  return (
    <aside className="ra-left">
      <div className="ra-panel-title">
        <div>
          <MonoLabel size={9} color="#0891B2">SUB-ACCOUNTS</MonoLabel>
          <strong>TÀI KHOẢN PHỤ</strong>
          <small>Tạo tài khoản cho nhân viên theo mô hình Cha - Con</small>
        </div>
        <span><Users size={15} /> {accounts.length}/10</span>
      </div>

      <label className="ra-search">
        <Search size={14} />
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm tên hoặc vai trò..." />
        <kbd>⌘ K</kbd>
      </label>

      <Btn
        variant="cyan"
        size="md"
        full
        onClick={onCreate}
        style={{ color: '#FFFFFF', background: '#0891B2', borderColor: '#0891B2' }}
      >
        <Plus size={14} /> Tạo tài khoản mới
      </Btn>

      <div className="ra-list-label"><span>DANH SÁCH NHÂN SỰ</span><small>{filtered.length} tài khoản</small></div>
      <div className="ra-account-list">
        {filtered.map((account) => (
          <article
            className={`ra-account-card ${selectedId === account.id ? 'selected' : ''}`}
            key={account.id}
            onClick={() => setSelectedId(account.id)}
          >
            <div className="ra-avatar" style={{ background: account.color }}>{account.initials}</div>
            <div className="ra-account-copy">
              <strong>{account.name}</strong>
              <MonoLabel size={8}>{account.email}</MonoLabel>
              <span className={`ra-role ${account.role.toLowerCase()}`}>{account.role}</span>
            </div>
            <div className={`ra-account-status ${account.active ? 'active' : 'inactive'}`}>
              <i /> {account.active ? 'Active' : 'Inactive'}
            </div>
          </article>
        ))}
      </div>

      <div className="ra-vip-note">
        <Crown size={17} />
        <div><strong>Gói WareMap ADMIN_VIP</strong><span>Còn 7 vị trí tài khoản phụ có thể sử dụng.</span></div>
      </div>
    </aside>
  )
}

function PermissionCell({ value }: { value: Permission }) {
  if (value === 'yes') return <span className="ra-permission yes"><Check size={13} /></span>
  if (value === 'no') return <span className="ra-permission no"><X size={13} /></span>
  return <span className="ra-permission locked"><Lock size={11} /></span>
}

function PermissionMatrix() {
  return (
    <main className="ra-center">
      <div className="ra-matrix-head">
        <div><MonoLabel size={9} color="#0891B2">ROLE-BASED ACCESS CONTROL</MonoLabel><strong>MA TRẬN PHÂN QUYỀN RBAC</strong></div>
        <span><ShieldCheck size={14} /> 4 vai trò · 8 chức năng</span>
      </div>

      <div className="ra-matrix-wrap">
        <table className="ra-matrix">
          <thead>
            <tr>
              <th>CHỨC NĂNG</th>
              {roles.map((role) => (
                <th key={role}>
                  <span className={`ra-role-icon ${role.toLowerCase()}`}>
                    {role === 'ADMIN_VIP' ? <Crown size={12} /> : role === 'MANAGER' ? <Shield size={12} /> : <UserRound size={12} />}
                  </span>
                  <MonoLabel size={7} color="#475569">{role}</MonoLabel>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {permissionRows.map((row) => (
              <tr key={row.feature}>
                <td>{row.feature}</td>
                {roles.map((role) => <td key={role}><PermissionCell value={row.values[role]} /></td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="ra-legend">
        <span><i className="yes"><Check size={10} /></i> Được phép</span>
        <span><i className="no"><X size={10} /></i> Không được phép</span>
        <span><i className="locked"><Lock size={9} /></i> Khóa theo gói/chi nhánh</span>
      </div>

      <div className="ra-plan-note">
        <Crown size={15} />
        <span><strong>Gói PRO:</strong> Tạo không giới hạn tài khoản phụ. <strong>Gói CHUỖI:</strong> Tạo tài khoản phụ theo từng chi nhánh.</span>
      </div>

      <div className="ra-security-card">
        <KeyRound size={18} />
        <div><strong>Nguyên tắc quyền tối thiểu</strong><span>Mỗi nhân viên chỉ được cấp quyền cần thiết cho công việc tại chi nhánh được phân công.</span></div>
        <span>ENFORCED</span>
      </div>
    </main>
  )
}

function Field({
  label,
  icon: Icon,
  value,
  onChange,
  type = 'text',
}: {
  label: string
  icon: typeof UserRound
  value: string
  onChange: (value: string) => void
  type?: string
}) {
  return (
    <label className="ra-field">
      <span>{label}</span>
      <div><Icon size={13} /><input type={type} value={value} onChange={(event) => onChange(event.target.value)} /></div>
    </label>
  )
}

function SelectField({
  label,
  icon: Icon,
  value,
  options,
  onChange,
}: {
  label: string
  icon: typeof UserRound
  value: string
  options: string[]
  onChange: (value: string) => void
}) {
  return (
    <label className="ra-field">
      <span>{label}</span>
      <div>
        <Icon size={13} />
        <select value={value} onChange={(event) => onChange(event.target.value)}>
          {options.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div>
    </label>
  )
}

function AccountInspector({
  account,
  onSave,
  onLock,
}: {
  account: Account
  onSave: (account: Account) => void
  onLock: () => void
}) {
  const [draft, setDraft] = useState(account)

  const currentDraft = draft.id === account.id ? draft : account
  const update = (patch: Partial<Account>) => setDraft({ ...currentDraft, ...patch })

  return (
    <aside className="ra-right">
      <div className="ra-panel-title">
        <div><MonoLabel size={9} color="#0891B2">ACCOUNT INSPECTOR</MonoLabel><strong>CHI TIẾT TÀI KHOẢN</strong></div>
        <ShieldCheck size={18} />
      </div>

      <div className="ra-profile">
        <div className="ra-profile-avatar" style={{ background: currentDraft.color }}>{currentDraft.initials}</div>
        <div>
          <strong>{currentDraft.name}</strong>
          <MonoLabel size={8}>{currentDraft.email}</MonoLabel>
          <span className={`ra-role ${currentDraft.role.toLowerCase()}`}>{currentDraft.role}</span>
        </div>
        <div className={`ra-account-status ${currentDraft.active ? 'active' : 'inactive'}`}><i /> {currentDraft.active ? 'Active' : 'Inactive'}</div>
      </div>

      <div className="ra-form">
        <div className="ra-parent-id">
          <KeyRound size={13} />
          <span>Parent_Admin_ID</span>
          <MonoLabel size={8} color="#0F172A">ADMIN_VIP_001</MonoLabel>
        </div>
        <Field label="Họ và tên" icon={UserRound} value={currentDraft.name} onChange={(name) => update({ name })} />
        <Field label="Email" icon={Mail} type="email" value={currentDraft.email} onChange={(email) => update({ email })} />
        <Field label="Số điện thoại" icon={Phone} value={currentDraft.phone} onChange={(phone) => update({ phone })} />
        <SelectField
          label="Chi nhánh"
          icon={Building2}
          value={currentDraft.branch}
          options={['Kho Tổng', 'CN Quận 3', 'CN Thủ Đức', 'CN Tân Bình']}
          onChange={(branch) => update({ branch })}
        />
        <SelectField
          label="Vai trò"
          icon={Shield}
          value={currentDraft.role}
          options={roles}
          onChange={(role) => update({ role: role as Role })}
        />
        <div className="ra-toggle-row">
          <div><CheckCircle2 size={14} /><span><strong>Trạng thái tài khoản</strong><small>{currentDraft.active ? 'Được phép đăng nhập hệ thống' : 'Đăng nhập đang bị vô hiệu hóa'}</small></span></div>
          <Btn
            variant={currentDraft.active ? 'success' : 'ghost'}
            size="sm"
            onClick={() => update({ active: !currentDraft.active })}
            style={{
              width: 44,
              height: 25,
              padding: 3,
              justifyContent: currentDraft.active ? 'flex-end' : 'flex-start',
              background: currentDraft.active ? '#059669' : '#E2E8F0',
              borderColor: currentDraft.active ? '#059669' : '#CBD5E1',
            }}
          >
            <span className="ra-toggle-knob" />
          </Btn>
        </div>
      </div>

      <div className="ra-scope">
        <span>PHẠM VI TRUY CẬP</span>
        <div><Building2 size={13} /><strong>{currentDraft.branch}</strong><small>Chỉ xem dữ liệu thuộc chi nhánh này</small></div>
      </div>

      <div className="ra-inspector-actions">
        <Btn
          variant="cyan"
          size="md"
          full
          onClick={() => onSave(currentDraft)}
          style={{ color: '#FFFFFF', background: '#0891B2', borderColor: '#0891B2' }}
        >
          <Save size={14} /> Lưu thay đổi
        </Btn>
        <Btn
          variant="danger"
          size="md"
          full
          onClick={onLock}
          style={{ color: '#DC2626', background: '#FEF2F2', borderColor: '#FECACA' }}
        >
          <Lock size={14} /> Khóa tài khoản
        </Btn>
      </div>
    </aside>
  )
}

export default function Screen7AccountRbac() {
  const [accounts, setAccounts] = useState(initialAccounts)
  const [selectedId, setSelectedId] = useState(1)
  const [query, setQuery] = useState('')
  const [toast, setToast] = useState('RBAC đã được đồng bộ theo gói ADMIN_VIP')
  const timer = useRef<number | null>(null)

  const selectedAccount = useMemo(
    () => accounts.find((account) => account.id === selectedId) ?? accounts[0],
    [accounts, selectedId],
  )

  const notify = (message: string) => {
    setToast(message)
    if (timer.current) window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setToast(''), 2600)
  }

  const createAccount = () => {
    const id = Math.max(...accounts.map((account) => account.id)) + 1
    const account: Account = {
      id,
      name: 'Tài khoản mới',
      email: 'new.staff@waremap.vn',
      phone: '090 000 0000',
      branch: 'Kho Tổng',
      role: 'STAFF_WAREHOUSE',
      active: true,
      initials: 'NEW',
      color: '#0891B2',
    }
    setAccounts((current) => [...current, account])
    setSelectedId(id)
    notify('Đã tạo tài khoản phụ mới')
  }

  const saveAccount = (updated: Account) => {
    setAccounts((current) => current.map((account) => account.id === updated.id ? updated : account))
    notify(`Đã lưu thay đổi cho ${updated.name}`)
  }

  const lockAccount = () => {
    setAccounts((current) => current.map((account) => (
      account.id === selectedId ? { ...account, active: false } : account
    )))
    notify(`Đã khóa tài khoản ${selectedAccount.name}`)
  }

  return (
    <div className="wm-shell wm-light ra-shell">
      <WareMapHeader activeScreen="ACCOUNT" theme="light" notify={notify} />
      <div className="ra-layout">
        <AccountList
          accounts={accounts}
          selectedId={selectedId}
          query={query}
          setQuery={setQuery}
          setSelectedId={setSelectedId}
          onCreate={createAccount}
        />
        <PermissionMatrix />
        <AccountInspector
          key={selectedAccount.id}
          account={selectedAccount}
          onSave={saveAccount}
          onLock={lockAccount}
        />
      </div>
      <div className="ra-bottom">
        <span><i /> Gói hiện tại: <strong>ADMIN_VIP</strong></span>
        <span>Đang sử dụng: <strong>{accounts.length}/10 tài khoản phụ</strong></span>
        <MonoLabel size={9}>RBAC ENGINE · POLICY ENFORCED</MonoLabel>
      </div>
      {toast && <div className="wm-toast"><Check size={15} /> {toast}</div>}
    </div>
  )
}
