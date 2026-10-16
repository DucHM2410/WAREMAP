import { useMemo, useRef, useState } from 'react'
import {
  AlertTriangle, Check, CheckCircle2, ChevronRight, Copy, Download, Eye, FilePlus2,
  Lock, MoreHorizontal, PackageCheck, PackageSearch, Printer, ScanLine, Search,
  ShieldCheck, Trash2, Truck, Warehouse,
} from 'lucide-react'
import { Btn, MonoLabel } from './shared'
import { WareMapHeader } from './WareMapHeader'

type FilterId = 'all' | 'created' | 'picking' | 'transit' | 'receiving' | 'issue'
type TransferStatus = 'transit' | 'done' | 'issue'

const filters: Array<{ id: FilterId; label: string; count: number; locked?: boolean }> = [
  { id: 'all', label: 'Tất cả', count: 24 },
  { id: 'created', label: 'Khởi tạo', count: 2 },
  { id: 'picking', label: 'Đang nhặt hàng 3D', count: 5 },
  { id: 'transit', label: 'Đang đi đường', count: 8, locked: true },
  { id: 'receiving', label: 'Kiểm đếm nhận', count: 4 },
  { id: 'issue', label: 'Báo lệch', count: 5 },
]

const transfers = [
  { id: 'TRF-WM-20260922-01', source: 'Kho Tổng', destination: 'CN Quận 3', date: '22/09', batches: 12, sku: 48, status: 'transit' as const },
  { id: 'TRF-WM-20260922-02', source: 'Kho Tổng', destination: 'CN Thủ Đức', date: '22/09', batches: 8, sku: 32, status: 'done' as const },
  { id: 'TRF-WM-20260922-03', source: 'Kho Tổng', destination: 'CN Tân Bình', date: '22/09', batches: 5, sku: 20, status: 'issue' as const },
  { id: 'TRF-WM-20260921-08', source: 'Kho Tổng', destination: 'CN Quận 7', date: '21/09', batches: 9, sku: 36, status: 'transit' as const },
  { id: 'TRF-WM-20260921-07', source: 'CN Quận 3', destination: 'Kho Tổng', date: '21/09', batches: 6, sku: 24, status: 'done' as const },
]

const steps = [
  { label: 'Lập lệnh', icon: FilePlus2 },
  { label: 'Nhặt hàng 3D', icon: PackageSearch },
  { label: 'Cho đi', icon: Warehouse },
  { label: 'Đang đi đường', icon: Truck, active: true },
  { label: 'Dỡ hàng', icon: PackageCheck },
  { label: 'Đối soát Lô/Hạn dùng', icon: ScanLine },
  { label: 'Xếp kệ 3D', icon: Warehouse },
]

const history = [
  { time: '11:45', text: 'Kho Tổng xuất phiếu', meta: '48 SKU · Nguyễn Văn A' },
  { time: '09:15', text: 'Đã khóa số lượng', meta: '12 lô · Chờ kho nhận' },
  { time: '08:30', text: 'Hoàn tất nhặt hàng 3D', meta: 'Khu A · 12 lô hàng' },
  { time: '08:00', text: 'Phiếu được khởi tạo', meta: 'Kho Tổng → CN Quận 3' },
]

function QRCode({ value }: { value: string }) {
  const cells = useMemo(() => Array.from({ length: 100 }, (_, index) => {
    const row = Math.floor(index / 10)
    const column = index % 10
    const finder = (row < 3 && column < 3) || (row < 3 && column > 6) || (row > 6 && column < 3)
    return finder || (value.charCodeAt(index % value.length) + row * 5 + column * 11) % 3 !== 0
  }), [value])
  return <div className="wt-qr">{cells.map((active, index) => <span key={index} className={active ? 'active' : ''} />)}</div>
}

function FilterPanel({ active, onChange }: { active: FilterId; onChange: (filter: FilterId) => void }) {
  return (
    <aside className="wt-left">
      <section className="wt-overview">
        <div className="wt-overview-head"><span>TỔNG QUAN HÔM NAY</span><MonoLabel size={8}>22/09</MonoLabel></div>
        <div className="wt-overview-grid">
          <div><strong>24</strong><span>Tổng phiếu</span></div>
          <div><strong>08</strong><span>Đang đi</span></div>
          <div className="danger"><strong>05</strong><span>Báo lệch</span></div>
        </div>
      </section>
      <section className="wt-filter-panel">
        <div className="wt-panel-title"><div><MonoLabel size={8} color="#2563EB">IN-TRANSIT CONTROL</MonoLabel><strong>Phiếu chuyển hàng</strong></div><Truck size={17} /></div>
        <div className="wt-filter-list">
          {filters.map((filter) => (
            <div className={`wt-filter ${active === filter.id ? 'active' : ''}`} key={filter.id} onClick={() => onChange(filter.id)}>
              <span className="wt-check">{active === filter.id && <Check size={11} />}</span>
              <span>{filter.label}</span>
              {filter.locked && <Lock size={11} />}
              <strong>{filter.count}</strong>
            </div>
          ))}
        </div>
      </section>
      <div className="wt-delivery-note"><Truck size={14} /><strong>Chuyến tiếp theo</strong><span>12:30 · Kho Tổng → CN Quận 1</span></div>
    </aside>
  )
}

function StatusPill({ status }: { status: TransferStatus }) {
  const config = {
    transit: ['ĐANG ĐI ĐƯỜNG', 'transit'],
    done: ['HOÀN THÀNH', 'done'],
    issue: ['BÁO LỆCH', 'issue'],
  }[status]
  return <span className={`wt-status ${config[1]}`}>{config[0]}</span>
}

function RowActions({ id, notify }: { id: string; notify: (message: string) => void }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="wt-row-actions">
      <Btn variant="ghost" size="sm" onClick={() => setOpen((value) => !value)}><MoreHorizontal size={17} /></Btn>
      {open && (
        <div className="wt-action-menu">
          <Btn variant="ghost" size="sm" onClick={() => notify(`Đang mở ${id}`)}><Eye size={13} /> Xem</Btn>
          <Btn variant="ghost" size="sm" onClick={() => notify(`Đang in ${id}`)}><Printer size={13} /> In</Btn>
          <Btn variant="danger" size="sm" onClick={() => notify(`Đã gửi yêu cầu hủy ${id}`)}><Trash2 size={13} /> Hủy</Btn>
        </div>
      )}
    </div>
  )
}

function TransferTable({
  query, setQuery, selected, setSelected, notify, activeFilter,
}: {
  query: string
  setQuery: (query: string) => void
  selected: string
  setSelected: (id: string) => void
  notify: (message: string) => void
  activeFilter: FilterId
}) {
  const visibleTransfers = transfers.filter((transfer) => (
    (
      transfer.id.toLowerCase().includes(query.toLowerCase())
      || transfer.destination.toLowerCase().includes(query.toLowerCase())
      || transfer.source.toLowerCase().includes(query.toLowerCase())
    )
    && (
      activeFilter === 'all'
      || (activeFilter === 'transit' && transfer.status === 'transit')
      || (activeFilter === 'issue' && transfer.status === 'issue')
      || (activeFilter === 'receiving' && transfer.status === 'done')
    )
  ))
  return (
    <main className="wt-center">
      <div className="wt-table-heading">
        <div><MonoLabel size={8} color="#2563EB">TRANSFER MANIFEST</MonoLabel><strong>DANH SÁCH CHUYỂN KHO</strong><span>Quản lý luồng hàng giữa kho tổng và các chi nhánh</span></div>
        <div className="wt-table-count"><strong>24</strong><span>phiếu tháng 09</span></div>
      </div>
      <div className="wt-table-toolbar">
        <label className="wt-search"><Search size={14} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm mã phiếu, lộ trình..." /><kbd>⌘ K</kbd></label>
        <Btn variant="ghost" size="sm" onClick={() => notify('Đã xuất danh sách phiếu chuyển kho ra Excel')}><Download size={14} /> Xuất Excel</Btn>
      </div>
      <div className="wt-table-wrap">
        <table className="wt-table">
          <thead><tr><th>MÃ PHIẾU</th><th>LỘ TRÌNH</th><th>NGÀY ĐI</th><th>SỐ LÔ / SKU</th><th>TRẠNG THÁI</th><th>THAO TÁC</th></tr></thead>
          <tbody>
            {visibleTransfers.map((transfer) => (
              <tr key={transfer.id} className={selected === transfer.id ? 'selected' : ''} onClick={() => setSelected(transfer.id)}>
                <td><MonoLabel size={9} color="#0F172A">{transfer.id}</MonoLabel></td>
                <td><span className="wt-route"><strong>{transfer.source}</strong><i>→</i><span>{transfer.destination}</span></span></td>
                <td>{transfer.date}</td>
                <td><span className="wt-batch-count">{transfer.batches} Lô</span> / {transfer.sku} SKU</td>
                <td><StatusPill status={transfer.status} /></td>
                <td onClick={(event) => event.stopPropagation()}><RowActions id={transfer.id} notify={notify} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="wt-table-footer"><span>Hiển thị 1–{visibleTransfers.length} trong 24 phiếu</span><div><Btn variant="ghost" size="sm">Trước</Btn><span>1</span><Btn variant="ghost" size="sm">Sau</Btn></div></div>
    </main>
  )
}

function ReconciliationPanel({ selected, notify }: { selected: string; notify: (message: string) => void }) {
  const [tab, setTab] = useState<'process' | 'history'>('process')
  const copyId = async () => {
    try { await navigator.clipboard.writeText(selected) } catch { /* Clipboard may be unavailable in preview. */ }
    notify('Đã sao chép mã phiếu')
  }
  return (
    <aside className="wt-right">
      <div className="wt-transfer-id">
        <div><span>PHIẾU ĐANG CHỌN</span><strong>{selected}</strong></div>
        <Btn variant="ghost" size="sm" onClick={copyId}><Copy size={14} /></Btn>
      </div>
      <div className="wt-detail-scroll">
        <div className="wt-detail-tabs">
          <span data-active={tab === 'process'}><Btn variant="ghost" size="sm" onClick={() => setTab('process')}>Quy trình</Btn></span>
          <span data-active={tab === 'history'}><Btn variant="ghost" size="sm" onClick={() => setTab('history')}>Lịch sử</Btn></span>
        </div>
        {tab === 'process' ? (
          <div className="wt-stepper">
            {steps.map((step, index) => {
              const complete = index < 3
              const Icon = step.icon
              return (
                <div className={`wt-step ${step.active ? 'active' : ''} ${complete ? 'complete' : ''}`} key={step.label}>
                  <div className="wt-step-node">{complete ? <Check size={12} /> : <Icon size={12} />}</div>
                  <div><span>BƯỚC {index + 1}</span><strong>{step.label}</strong></div>
                  {step.active && <span className="wt-live">HIỆN TẠI</span>}
                </div>
              )
            })}
          </div>
        ) : (
          <section className="wt-transfer-history">
            <div className="wt-history-head"><strong>TRANSFER AUDIT</strong><span>4 sự kiện</span></div>
            <div className="wt-history-timeline">
              {history.map((event, index) => (
                <div className={`wt-history-item ${index === 0 ? 'active' : ''}`} key={`${event.time}-${event.text}`}>
                  <div className="wt-history-node"><span /></div><div><strong>{event.text}</strong><span>{event.meta}</span></div><MonoLabel size={7}>{event.time}</MonoLabel>
                </div>
              ))}
            </div>
            <Btn variant="outline" size="sm" full onClick={() => notify('Đã mở toàn bộ lịch sử luân chuyển')}>Xem toàn bộ <ChevronRight size={13} /></Btn>
          </section>
        )}
        <div className="wt-lock-box"><ShieldCheck size={17} /><div><strong>Số lượng đã bị khóa</strong><span>Chờ Kho Nhận quét đối soát</span></div><Lock size={12} /></div>
        <section className="wt-qr-box">
          <div className="wt-qr-pair">
            <div><QRCode value="LOC-WM-A1-F2-B03" /><span>QR VỊ TRÍ KỆ</span><MonoLabel size={7}>A1-F2-B03</MonoLabel></div>
            <div><QRCode value="LOT-WM-202608" /><span>QR LÔ HÀNG</span><MonoLabel size={7}>LOT-WM-202608</MonoLabel></div>
          </div>
          <Btn variant="ghost" size="sm" full onClick={() => notify('Đã mở camera quét đối soát kép')}><ScanLine size={14} /> Quét đối soát</Btn>
        </section>
      </div>
      <div className="wt-sticky-actions">
        <Btn variant="primary" size="md" full onClick={() => notify('Đã duyệt nhận hàng tại CN Quận 3')}><CheckCircle2 size={15} /> Duyệt</Btn>
        <Btn variant="danger" size="md" full onClick={() => notify('Đã mở biểu mẫu báo lệch')}><AlertTriangle size={15} /> Báo lệch</Btn>
      </div>
    </aside>
  )
}

export default function Screen3Mobile() {
  const [activeFilter, setActiveFilter] = useState<FilterId>('all')
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(transfers[0].id)
  const [toast, setToast] = useState('Dữ liệu chuyển kho đã được đồng bộ')
  const toastTimer = useRef<number | null>(null)
  const notify = (message: string) => {
    setToast(message)
    if (toastTimer.current) window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(''), 3000)
  }
  return (
    <div className="wm-shell wm-light wt-shell">
      <WareMapHeader activeScreen="S3" theme="light" notify={notify} />
      <div className="wt-layout">
        <FilterPanel active={activeFilter} onChange={setActiveFilter} />
        <TransferTable query={query} setQuery={setQuery} selected={selected} setSelected={setSelected} notify={notify} activeFilter={activeFilter} />
        <ReconciliationPanel selected={selected} notify={notify} />
      </div>
      <div className="wt-bottom"><span><i /> Đang xem: <strong>24 phiếu chuyển kho</strong></span><MonoLabel size={9}>CẬP NHẬT: 11:45 · 22/09/2026</MonoLabel></div>
      {toast && <div className="wm-toast wt-toast"><Check size={14} /> {toast}</div>}
    </div>
  )
}
