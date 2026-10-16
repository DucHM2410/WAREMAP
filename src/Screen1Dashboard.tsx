import { useRef, useState } from 'react'
import {
  AlertTriangle, Box, Check, Clock3, Map, Package, Truck,
} from 'lucide-react'
import { Btn, MonoLabel } from './shared'
import { WareMapHeader } from './WareMapHeader'

const lanes = [
  {
    title: 'Khởi tạo', tone: 'slate', count: 3,
    cards: [
      { id: 'TC-2608-018', route: 'Kho Tổng → CN Quận 7', qty: '186 sản phẩm', time: '11:30' },
      { id: 'TC-2608-019', route: 'CN Gò Vấp → Kho Tổng', qty: '64 sản phẩm', time: '12:15' },
    ],
  },
  {
    title: 'Đang nhặt hàng 3D', tone: 'cyan', count: 5,
    cards: [
      { id: 'TC-2608-016', route: 'Kho Tổng → CN Thủ Đức', qty: '242 sản phẩm', time: '10:45', owner: 'Minh Anh' },
      { id: 'TC-2608-017', route: 'Kho Tổng → CN Tân Bình', qty: '98 sản phẩm', time: '11:05', owner: 'Hoàng Nam' },
    ],
  },
  {
    title: 'Đang đi đường', tone: 'amber', count: 8,
    cards: [
      { id: 'TC-2608-014', route: 'Kho Tổng → CN Quận 3', qty: '320 sản phẩm', time: '08:30', progress: 'ETA 12:10' },
      { id: 'TC-2608-015', route: 'CN Quận 7 → Kho Tổng', qty: '115 sản phẩm', time: '09:15', progress: 'ETA 13:20' },
    ],
  },
  {
    title: 'Đã nhận', tone: 'green', count: 8,
    cards: [
      { id: 'TC-2608-012', route: 'Kho Tổng → CN Phú Nhuận', qty: '208 sản phẩm', time: '10:40', progress: 'Đủ hàng' },
      { id: 'TC-2608-011', route: 'CN Tân Bình → Kho Tổng', qty: '76 / 81 sản phẩm', time: '11:05', progress: 'Lệch 05', issue: true },
    ],
  },
]

const audit = [
  ['11:42', 'Nguyễn An cập nhật vị trí', 'SKU WM-0902 → A2-02-08'],
  ['11:28', 'CN Quận 3 đã nhận hàng', 'Phiếu TC-2608-012 · đủ 208 SP'],
  ['10:56', 'Cảnh báo FEFO tự động', 'LOT-WM-202608 · còn 23 ngày'],
  ['10:31', 'Hoàng Nam bắt đầu nhặt', 'Phiếu TC-2608-017'],
]

function navigateTo(screen: string) {
  window.dispatchEvent(new CustomEvent('waremap:navigate', { detail: screen }))
}

function KanbanCard({ card }: { card: (typeof lanes)[number]['cards'][number] }) {
  return (
    <article className={`dk-task ${card.issue ? 'issue' : ''}`}>
      <div><strong>{card.id}</strong><span>{card.time}</span></div>
      <p>{card.route}</p>
      <div className="dk-task-meta"><Package size={13} /><span>{card.qty}</span></div>
      {(card.owner || card.progress) && (
        <div className="dk-task-foot">
          <span>{card.owner ? `Phụ trách: ${card.owner}` : card.progress}</span>
          {card.issue && <b><AlertTriangle size={11} /> BÁO LỆCH</b>}
        </div>
      )}
    </article>
  )
}

function MiniWarehouse() {
  return (
    <div className="dk-map">
      <div className="dk-grid" />
      <div className="dk-rack r1"><i /><i /><i /></div>
      <div className="dk-rack r2 alert"><i /><i /><i /></div>
      <div className="dk-rack r3"><i /><i /><i /></div>
      <div className="dk-rack r4 alert"><i /><i /><i /></div>
      <span className="dk-map-label">KỆ A2 · FEFO 23 NGÀY</span>
    </div>
  )
}

export default function Screen1Dashboard() {
  const [toast, setToast] = useState('Dữ liệu kho đã đồng bộ lúc 11:45')
  const timer = useRef<number | null>(null)
  const notify = (message: string) => {
    setToast(message)
    if (timer.current) window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setToast(''), 2400)
  }

  return (
    <div className="wm-shell wm-light dk-shell">
      <WareMapHeader activeScreen="S1" theme="light" notify={notify} />
      <div className="dk-page">
        <div className="dk-body">
          <main className="dk-main">
            <div className="dk-title">
              <div><MonoLabel size={9} color="#0891B2">TỔNG QUAN VẬN HÀNH</MonoLabel><strong className="dk-page-title">Chào buổi sáng, Quản lý</strong><p>Kiểm soát luồng hàng giữa các chi nhánh theo thời gian thực.</p></div>
              <span><Clock3 size={14} /> Cập nhật 2 phút trước</span>
            </div>
            <div className="dk-kpis">
              <article><span><Truck size={18} /></span><div><small>TỔNG PHIẾU CHUYỂN</small><strong>24</strong><p>+12% so với hôm qua</p></div></article>
              <article><span><Map size={18} /></span><div><small>ĐANG ĐI ĐƯỜNG</small><strong>08</strong><p>3 phiếu sắp đến nơi</p></div></article>
              <article className="danger"><span><AlertTriangle size={18} /></span><div><small>BÁO LỆCH</small><strong>05</strong><p>Cần đối soát ngay</p></div></article>
            </div>
            <section className="dk-flow">
              <div className="dk-section-head"><div><strong className="dk-section-title">Quản lý luồng In-Transit</strong><p>Kéo thả phiếu để cập nhật trạng thái xử lý</p></div><Btn variant="outline" size="sm">Xem tất cả</Btn></div>
              <div className="dk-board">
                {lanes.map((lane) => (
                  <section className={`dk-lane ${lane.tone}`} key={lane.title}>
                    <header><span /><strong>{lane.title}</strong><b>{lane.count}</b></header>
                    <div>{lane.cards.map((card) => <KanbanCard card={card} key={card.id} />)}</div>
                  </section>
                ))}
              </div>
            </section>
          </main>
          <aside className="dk-right">
            <section className="dk-panel">
              <div className="dk-panel-head"><div><MonoLabel size={8} color="#0891B2">LIVE VIEW</MonoLabel><strong className="dk-section-title">Bản đồ kho 3D</strong></div><Btn variant="ghost" size="sm" onClick={() => navigateTo('builder')}><Box size={14} /> Mở 3D</Btn></div>
              <MiniWarehouse />
              <div className="dk-map-legend"><span><i /> Cận hạn FEFO</span><b>2 vị trí cảnh báo</b></div>
            </section>
            <section className="dk-panel dk-audit">
              <div className="dk-panel-head"><div><MonoLabel size={8} color="#64748B">AUDIT LOG</MonoLabel><strong className="dk-section-title">Lịch sử luân chuyển</strong></div><Clock3 size={17} /></div>
              {audit.map(([time, title, meta], index) => (
                <div className={index === 2 ? 'warning' : ''} key={time}>
                  <span>{index === 2 ? <AlertTriangle size={12} /> : <Check size={12} />}</span>
                  <div><strong>{title}</strong><small>{meta}</small></div>
                  <time>{time}</time>
                </div>
              ))}
              <Btn variant="ghost" size="sm" full>Xem toàn bộ lịch sử</Btn>
            </section>
          </aside>
        </div>
      </div>
      {toast && <div className="dk-toast"><Check size={15} /> {toast}</div>}
    </div>
  )
}
