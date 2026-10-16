import { useRef, useState } from 'react'
import {
  AlertTriangle,
  ArrowDown,
  Check,
  CheckCircle2,
  Clock3,
  Download,
  PiggyBank,
  Sparkles,
  Timer,
  TrendingUp,
  Truck,
} from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Btn, MonoLabel } from '../../shared'
import { WareMapHeader } from '../../shared/layout/WareMapHeader'

const pickingData = [
  { label: 'T1', before: 5.4, after: 1.4 },
  { label: 'T2', before: 5.2, after: 1.3 },
  { label: 'T3', before: 5.1, after: 1.2 },
  { label: 'T4', before: 5.3, after: 1.1 },
  { label: 'T5', before: 5.0, after: 1.0 },
  { label: 'T6', before: 4.9, after: 0.9 },
  { label: 'T7', before: 5.0, after: 1.0 },
]

const expiredData = [
  { label: 'T4', before: 18, after: 8 },
  { label: 'T5', before: 21, after: 7 },
  { label: 'T6', before: 20, after: 6 },
  { label: 'T7', before: 22, after: 6 },
  { label: 'T8', before: 19, after: 5 },
  { label: 'T9', before: 20, after: 6 },
]

const kpis = [
  {
    title: 'Giảm thời gian nhặt hàng',
    value: '80%',
    detail: 'Từ 5 phút xuống còn 1 phút/đơn',
    icon: Timer,
  },
  {
    title: 'Giảm lỗi nhặt nhầm',
    value: '90%',
    detail: 'Tỷ lệ sai giảm từ 10% xuống 1%',
    icon: AlertTriangle,
  },
  {
    title: 'Giảm hàng hết hạn',
    value: '70%',
    detail: 'Giảm 14 lô phải tiêu hủy mỗi tháng',
    icon: Clock3,
  },
  {
    title: 'Triệt tiêu thất thoát chuyển kho',
    value: '100%',
    detail: 'Đối soát đầy đủ hàng đi đường',
    icon: Truck,
  },
]

const detailRows = [
  { metric: 'Thời gian tìm hàng', before: '5 phút', after: '1 phút', improvement: '-80%' },
  { metric: 'Tỷ lệ nhặt nhầm', before: '10%', after: '1%', improvement: '-90%' },
  { metric: 'Hàng hết hạn/tháng', before: '20 lô', after: '6 lô', improvement: '-70%' },
  { metric: 'Thất thoát chuyển kho', before: '5%', after: '0%', improvement: '-100%' },
]

const tooltipStyle = {
  background: '#FFFFFF',
  border: '1px solid #E2E8F0',
  borderRadius: 8,
  boxShadow: '0 4px 14px rgba(15,23,42,.10)',
  color: '#0F172A',
  fontSize: 10,
}

function KpiCard({
  title,
  value,
  detail,
  icon: Icon,
}: {
  title: string
  value: string
  detail: string
  icon: typeof Timer
}) {
  return (
    <article className="roi-kpi">
      <div className="roi-kpi-icon"><Icon size={19} /></div>
      <div className="roi-kpi-copy">
        <span>{title}</span>
        <div><strong>{value}</strong><span><ArrowDown size={11} /> so với trước</span></div>
        <small>{detail}</small>
      </div>
      <div className="roi-kpi-spark">
        {[30, 48, 39, 62, 70, 83, 92].map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}
      </div>
    </article>
  )
}

function PickingChart() {
  return (
    <article className="roi-chart-card">
      <div className="roi-card-head">
        <div><MonoLabel size={8} color="#0891B2">PICKING PERFORMANCE</MonoLabel><strong>Thời gian nhặt hàng trung bình</strong><span>Phút trên mỗi đơn hàng · 7 tuần gần nhất</span></div>
        <Timer size={18} />
      </div>
      <div className="roi-chart">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={pickingData} margin={{ top: 8, right: 10, left: -18, bottom: 0 }}>
            <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 9 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 9 }} domain={[0, 6]} />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend iconType="circle" iconSize={7} wrapperStyle={{ color: '#64748B', fontSize: 9 }} />
            <Line name="Trước WareMap" type="monotone" dataKey="before" stroke="#94A3B8" strokeWidth={2} dot={{ r: 3, fill: '#FFFFFF', strokeWidth: 2 }} />
            <Line name="Sau WareMap" type="monotone" dataKey="after" stroke="#0891B2" strokeWidth={3} dot={{ r: 3, fill: '#FFFFFF', strokeWidth: 2 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="roi-chart-insight"><TrendingUp size={13} /><span>Nhân viên hiện hoàn thành trung bình <strong>60 đơn/giờ</strong>, tăng gấp 5 lần.</span></div>
    </article>
  )
}

function ExpiredChart() {
  return (
    <article className="roi-chart-card">
      <div className="roi-card-head">
        <div><MonoLabel size={8} color="#059669">FEFO PERFORMANCE</MonoLabel><strong>Số lô hàng hết hạn phải tiêu hủy</strong><span>So sánh theo tháng · Đơn vị: lô hàng</span></div>
        <Clock3 size={18} />
      </div>
      <div className="roi-chart">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={expiredData} margin={{ top: 8, right: 10, left: -18, bottom: 0 }} barGap={3}>
            <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 9 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 9 }} domain={[0, 25]} />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend iconType="circle" iconSize={7} wrapperStyle={{ color: '#64748B', fontSize: 9 }} />
            <Bar name="Trước WareMap" dataKey="before" fill="#DC2626" radius={[4, 4, 0, 0]} maxBarSize={18} />
            <Bar name="Sau WareMap" dataKey="after" fill="#059669" radius={[4, 4, 0, 0]} maxBarSize={18} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="roi-chart-insight green"><CheckCircle2 size={13} /><span>FEFO và Zalo OA giúp giảm trung bình <strong>14 lô tiêu hủy/tháng</strong>.</span></div>
    </article>
  )
}

function DetailTable() {
  return (
    <section className="roi-table-card">
      <div className="roi-card-head">
        <div><MonoLabel size={8} color="#0891B2">OPERATIONAL COMPARISON</MonoLabel><strong>Chi tiết hiệu quả trước và sau WareMap</strong><span>Dữ liệu tổng hợp từ các quy trình vận hành đã xác nhận</span></div>
        <Sparkles size={18} />
      </div>
      <div className="roi-table-wrap">
        <table className="roi-table">
          <thead>
            <tr><th>CHỈ SỐ</th><th>TRƯỚC WAREMAP</th><th>SAU WAREMAP</th><th>CẢI THIỆN</th><th>TRẠNG THÁI</th></tr>
          </thead>
          <tbody>
            {detailRows.map((row) => (
              <tr key={row.metric}>
                <td><strong>{row.metric}</strong></td>
                <td>{row.before}</td>
                <td><strong>{row.after}</strong></td>
                <td><span className="roi-improvement"><ArrowDown size={11} /> {row.improvement}</span></td>
                <td><span className="roi-achieved"><Check size={11} /> Đạt</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default function Screen10RoiDashboard() {
  const [period, setPeriod] = useState('Tháng')
  const [toast, setToast] = useState('Báo cáo ROI đã cập nhật đến 11:45 hôm nay')
  const timer = useRef<number | null>(null)

  const notify = (message: string) => {
    setToast(message)
    if (timer.current) window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setToast(''), 2600)
  }

  return (
    <div className="wm-shell wm-light roi-shell">
      <WareMapHeader activeScreen="S7" theme="light" notify={notify} />
      <main className="roi-content">
        <header className="roi-page-head">
          <div>
            <MonoLabel size={9} color="#0891B2">RETURN ON INVESTMENT · WAREMAP V5.0</MonoLabel>
            <strong>Báo cáo Hiệu quả Vận hành</strong>
            <span>Đo lường tác động thực tế sau khi triển khai WareMap tại hệ thống cửa hàng.</span>
          </div>
          <div className="roi-head-actions">
            <label>
              <span>KỲ BÁO CÁO</span>
              <select value={period} onChange={(event) => setPeriod(event.target.value)}>
                <option>Tuần</option>
                <option>Tháng</option>
                <option>Quý</option>
              </select>
            </label>
            <Btn
              variant="ghost"
              size="md"
              onClick={() => notify(`Đang xuất báo cáo ROI theo ${period.toLowerCase()} ra PDF`)}
              style={{ color: '#475569', background: '#FFFFFF', borderColor: '#CBD5E1' }}
            >
              <Download size={14} /> Xuất PDF
            </Btn>
          </div>
        </header>

        <section className="roi-kpi-grid">
          {kpis.map((kpi) => <KpiCard key={kpi.title} {...kpi} />)}
        </section>

        <section className="roi-chart-grid">
          <PickingChart />
          <ExpiredChart />
        </section>

        <DetailTable />

        <section className="roi-savings">
          <div className="roi-savings-icon"><PiggyBank size={30} /></div>
          <div>
            <MonoLabel size={9} color="#CFFAFE">TỔNG KẾT GIÁ TRỊ KINH TẾ</MonoLabel>
            <strong>Tiết kiệm ước tính: <span>15.000.000đ/tháng</span></strong>
            <p>Giảm chi phí nhân sự tìm hàng, nhặt nhầm, tiêu hủy lô hết hạn và thất thoát chuyển kho.</p>
          </div>
          <div className="roi-payback"><Sparkles size={15} /><span>Hoàn vốn sau<strong>1 tháng sử dụng</strong></span></div>
        </section>
      </main>
      {toast && <div className="wm-toast"><Check size={15} /> {toast}</div>}
    </div>
  )
}
