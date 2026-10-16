import { useRef, useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Grid, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import {
  AlertOctagon,
  ArrowDownToLine,
  ArrowRight,
  ArrowUpFromLine,
  Box,
  Check,
  ClipboardCheck,
  MapPin,
  PackagePlus,
  Plus,
  Route,
  Save,
  ScanLine,
  Sparkles,
  Trash2,
  Truck,
} from 'lucide-react'
import { Btn, MonoLabel } from './shared'
import { WareMapHeader } from './WareMapHeader'

type OperationId = 'import' | 'export' | 'stocktake' | 'transfer' | 'damaged'

interface SkuRow {
  id: number
  sku: string
  name: string
  batch: string
  expiry: string
  quantity: number
  location: string
}

const operations: Array<{
  id: OperationId
  label: string
  description: string
  badge?: number
  icon: typeof PackagePlus
}> = [
  { id: 'import', label: 'Nhập kho mới', description: 'Tạo phiếu nhập hàng', badge: 3, icon: PackagePlus },
  { id: 'export', label: 'Xuất kho bán hàng', description: 'Chuẩn bị đơn xuất', badge: 8, icon: ArrowUpFromLine },
  { id: 'stocktake', label: 'Kiểm kê 3D', description: 'Stocktake theo vị trí', badge: 2, icon: ScanLine },
  { id: 'transfer', label: 'Chuyển kho nội bộ', description: 'Điều chuyển chi nhánh', badge: 5, icon: Truck },
  { id: 'damaged', label: 'Xử lý hàng hỏng/hết hạn', description: 'Kiểm tra và tiêu hủy', badge: 4, icon: AlertOctagon },
]

const initialRows: SkuRow[] = [
  {
    id: 1,
    sku: 'COS-LIP-001',
    name: 'Son Môi A · Màu 01',
    batch: 'LOT-WM-202701',
    expiry: '22/09/2027',
    quantity: 120,
    location: 'A3-L2-B05',
  },
  {
    id: 2,
    sku: 'COS-SKN-014',
    name: 'Kem Dưỡng B 50ml',
    batch: 'LOT-WM-202702',
    expiry: '15/11/2027',
    quantity: 80,
    location: 'A3-L2-B06',
  },
  {
    id: 3,
    sku: 'MOM-MILK-008',
    name: 'Men Vi Sinh Cho Bé',
    batch: 'LOT-WM-202703',
    expiry: '30/12/2027',
    quantity: 60,
    location: 'C1-L1-B02',
  },
]

function OperationMenu({
  active,
  setActive,
}: {
  active: OperationId
  setActive: (id: OperationId) => void
}) {
  return (
    <aside className="io-left">
      <div className="io-panel-title">
        <div><MonoLabel size={9} color="#0891B2">INVENTORY OPERATIONS</MonoLabel><strong>THAO TÁC KHO</strong></div>
        <Box size={18} />
      </div>

      <div className="io-menu">
        {operations.map(({ id, label, description, badge, icon: Icon }) => (
          <div className={active === id ? 'active' : ''} key={id} onClick={() => setActive(id)}>
            <span className="io-menu-icon"><Icon size={16} /></span>
            <span><strong>{label}</strong><small>{description}</small></span>
            {badge && <b>{badge}</b>}
            <ArrowRight size={13} />
          </div>
        ))}
      </div>

      <section className="io-today-card">
        <div><span>HOẠT ĐỘNG HÔM NAY</span><MonoLabel size={8}>22/09/2026</MonoLabel></div>
        <div className="io-today-grid">
          <div><strong>12</strong><span>Phiếu nhập</span></div>
          <div><strong>18</strong><span>Phiếu xuất</span></div>
          <div><strong>04</strong><span>Chờ xử lý</span></div>
        </div>
      </section>

      <div className="io-scanner-note">
        <ScanLine size={17} />
        <div><strong>Quét QR để nhập nhanh</strong><span>Dùng PWA Scanner để thêm SKU và lô hàng vào phiếu.</span></div>
      </div>
    </aside>
  )
}

function EditableCell({
  value,
  mono,
  type = 'text',
  onChange,
}: {
  value: string | number
  mono?: boolean
  type?: string
  onChange: (value: string) => void
}) {
  return (
    <input
      className={mono ? 'mono' : ''}
      type={type}
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  )
}

function ImportForm({
  rows,
  setRows,
  notify,
}: {
  rows: SkuRow[]
  setRows: Dispatch<SetStateAction<SkuRow[]>>
  notify: (message: string) => void
}) {
  const [supplier, setSupplier] = useState('Công ty Mỹ phẩm Ánh Dương')
  const [date, setDate] = useState('2026-09-22')

  const updateRow = (id: number, patch: Partial<SkuRow>) => {
    setRows((current) => current.map((row) => row.id === id ? { ...row, ...patch } : row))
  }

  const addRow = () => {
    const id = rows.length ? Math.max(...rows.map((row) => row.id)) + 1 : 1
    setRows((current) => [
      ...current,
      {
        id,
        sku: 'SKU-MỚI',
        name: 'Sản phẩm mới',
        batch: 'LOT-WM-',
        expiry: '22/09/2027',
        quantity: 1,
        location: 'Chờ gợi ý',
      },
    ])
  }

  return (
    <main className="io-center">
      <div className="io-form-head">
        <div>
          <MonoLabel size={9} color="#0891B2">GOODS RECEIPT</MonoLabel>
          <strong>Phiếu Nhập Kho Mới</strong>
          <span>Thêm hàng hóa, lô và hạn dùng vào kho WareMap.</span>
        </div>
        <div><span>MÃ PHIẾU</span><MonoLabel size={10} color="#0F172A">IMP-WM-20260922-01</MonoLabel></div>
      </div>

      <section className="io-form-card">
        <div className="io-primary-fields">
          <label>
            <span>Nhà cung cấp</span>
            <div><BuildingIcon /><select value={supplier} onChange={(event) => setSupplier(event.target.value)}>
              <option>Công ty Mỹ phẩm Ánh Dương</option>
              <option>Nhà phân phối Mẹ & Bé An Nhiên</option>
              <option>Công ty Dinh dưỡng Việt</option>
            </select></div>
          </label>
          <label>
            <span>Ngày nhập</span>
            <div><ClipboardCheck size={14} /><input type="date" value={date} onChange={(event) => setDate(event.target.value)} /></div>
          </label>
        </div>

        <div className="io-sku-head">
          <div><strong>DANH SÁCH SKU NHẬP KHO</strong><span>{rows.length} dòng · {rows.reduce((sum, row) => sum + Number(row.quantity), 0)} sản phẩm</span></div>
          <Btn
            variant="cyan"
            size="sm"
            onClick={addRow}
            style={{ color: '#FFFFFF', background: '#0891B2', borderColor: '#0891B2' }}
          >
            <Plus size={13} /> Thêm dòng
          </Btn>
        </div>

        <div className="io-table-wrap">
          <table className="io-table">
            <thead>
              <tr>
                <th>SKU</th>
                <th>TÊN HÀNG</th>
                <th>SỐ LÔ</th>
                <th>HẠN SD</th>
                <th>SỐ LƯỢNG</th>
                <th>VỊ TRÍ KỆ GỢI Ý</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td><EditableCell mono value={row.sku} onChange={(sku) => updateRow(row.id, { sku })} /></td>
                  <td><EditableCell value={row.name} onChange={(name) => updateRow(row.id, { name })} /></td>
                  <td><EditableCell mono value={row.batch} onChange={(batch) => updateRow(row.id, { batch })} /></td>
                  <td><EditableCell value={row.expiry} onChange={(expiry) => updateRow(row.id, { expiry })} /></td>
                  <td><EditableCell type="number" value={row.quantity} onChange={(quantity) => updateRow(row.id, { quantity: Number(quantity) })} /></td>
                  <td><span className="io-location-pill"><MapPin size={11} /> {row.location}</span></td>
                  <td>
                    <Btn
                      variant="ghost"
                      size="sm"
                      onClick={() => setRows((current) => current.filter((item) => item.id !== row.id))}
                      style={{ color: '#DC2626', background: '#FFFFFF', borderColor: '#FECACA' }}
                    >
                      <Trash2 size={13} />
                    </Btn>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="io-form-summary">
          <div><span>NHÀ CUNG CẤP</span><strong>{supplier}</strong></div>
          <div><span>TỔNG SKU</span><strong>{rows.length}</strong></div>
          <div><span>TỔNG SỐ LƯỢNG</span><strong>{rows.reduce((sum, row) => sum + Number(row.quantity), 0)} pcs</strong></div>
        </div>
      </section>

      <div className="io-form-actions">
        <Btn
          variant="ghost"
          size="md"
          onClick={() => notify('Đã lưu phiếu nhập kho vào bản nháp')}
          style={{ color: '#475569', background: '#FFFFFF', borderColor: '#CBD5E1' }}
        >
          <Save size={14} /> Lưu nháp
        </Btn>
        <Btn
          variant="cyan"
          size="md"
          onClick={() => notify('Đã xác nhận nhập kho và cập nhật tồn kho')}
          style={{ color: '#FFFFFF', background: '#0891B2', borderColor: '#0891B2' }}
        >
          <ArrowDownToLine size={15} /> Xác nhận Nhập kho
        </Btn>
      </div>
    </main>
  )
}

function BuildingIcon() {
  return <Truck size={14} />
}

function AvailableBin() {
  const material = useRef<THREE.MeshStandardMaterial>(null)

  useFrame(({ clock }) => {
    if (!material.current) return
    const pulse = (Math.sin(clock.elapsedTime * 3.2) + 1) / 2
    material.current.emissiveIntensity = 0.3 + pulse * 1.2
  })

  return (
    <mesh position={[0.7, 1.25, 0]} castShadow>
      <boxGeometry args={[1.2, 0.58, 0.9]} />
      <meshStandardMaterial ref={material} color="#059669" emissive="#059669" emissiveIntensity={.7} roughness={.35} />
    </mesh>
  )
}

function SuggestionScene() {
  return (
    <>
      <color attach="background" args={['#E2E8F0']} />
      <ambientLight intensity={2.1} />
      <directionalLight position={[5, 8, 6]} intensity={3} color="#FFFFFF" />
      <pointLight position={[2, 3, 3]} intensity={4} color="#A7F3D0" distance={10} />
      <OrbitControls enablePan={false} enableDamping minDistance={5} maxDistance={12} target={[0, 1, 0]} />
      <Grid
        position={[0, -0.01, 0]}
        args={[12, 10]}
        cellSize={0.5}
        cellColor="#CBD5E1"
        sectionSize={2}
        sectionColor="#94A3B8"
        fadeDistance={13}
      />
      <group>
        {[-1.55, 1.55].map((x) => (
          <mesh key={x} position={[x, 1.6, 0]}>
            <boxGeometry args={[0.1, 3.3, 1.15]} />
            <meshStandardMaterial color="#64748B" metalness={.65} roughness={.3} />
          </mesh>
        ))}
        {[0, 1, 2, 3].map((level) => (
          <group key={level}>
            <mesh position={[0, level * .84 + .08, 0]}>
              <boxGeometry args={[3.2, .1, 1.25]} />
              <meshStandardMaterial color="#64748B" metalness={.55} roughness={.3} />
            </mesh>
            {level < 3 && [-.75, .75].map((x, index) => (
              <mesh key={x} position={[x, level * .84 + .43, 0]}>
                <boxGeometry args={[1.25, .55, .9]} />
                <meshStandardMaterial color={(level === 1 && index === 1) ? '#E2E8F0' : index ? '#2563EB' : '#D97706'} roughness={.45} />
              </mesh>
            ))}
          </group>
        ))}
        <AvailableBin />
        <mesh position={[0, 1.58, 0]}>
          <boxGeometry args={[3.45, 3.38, 1.48]} />
          <meshBasicMaterial color="#059669" transparent opacity={.045} wireframe />
        </mesh>
      </group>
    </>
  )
}

function LocationSuggestion({ notify }: { notify: (message: string) => void }) {
  return (
    <aside className="io-right">
      <div className="io-panel-title">
        <div><MonoLabel size={9} color="#059669">SMART SLOT SUGGESTION</MonoLabel><strong>GỢI Ý VỊ TRÍ XẾP KỆ</strong></div>
        <Sparkles size={18} />
      </div>

      <div className="io-suggestion-card">
        <div className="io-canvas">
          <Canvas
            dpr={[1, 1.5]}
            camera={{ position: [6, 6, 7], fov: 43 }}
            gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
          >
            <SuggestionScene />
          </Canvas>
          <div className="io-canvas-badge"><i /> Ô trống phù hợp</div>
          <div className="io-canvas-location"><MonoLabel size={8} color="#FFFFFF">A3 · L2 · B05</MonoLabel></div>
        </div>

        <div className="io-suggestion-copy">
          <div className="io-suggestion-icon"><MapPin size={18} /></div>
          <div><span>VỊ TRÍ ĐỀ XUẤT TỐT NHẤT</span><strong>Kệ A3 · Tầng 2 · Ô 05</strong><p>Còn trống và phù hợp với loại hàng <b>Mỹ phẩm</b>.</p></div>
        </div>

        <div className="io-fit-details">
          <div><span>ĐỘ PHÙ HỢP</span><strong>96%</strong></div>
          <div><span>SỨC CHỨA CÒN LẠI</span><strong>180 hộp</strong></div>
          <div><span>NHIỆT ĐỘ</span><strong>18–25°C</strong></div>
        </div>

        <Btn
          variant="cyan"
          size="md"
          full
          onClick={() => notify('Đang chỉ đường đến Kệ A3 · Tầng 2 · Ô 05')}
          style={{ color: '#FFFFFF', background: '#0891B2', borderColor: '#0891B2' }}
        >
          <Route size={15} /> Chỉ đường 3D
        </Btn>
      </div>

      <div className="io-rule-note">
        <Check size={15} />
        <div><strong>Đã kiểm tra quy tắc xếp kệ</strong><span>Không xung đột nhiệt độ, tải trọng hoặc nhóm hàng.</span></div>
      </div>
    </aside>
  )
}

export default function Screen9Inventory() {
  const [activeOperation, setActiveOperation] = useState<OperationId>('import')
  const [rows, setRows] = useState(initialRows)
  const [toast, setToast] = useState('Đã tạo phiếu nhập kho mới')
  const timer = useRef<number | null>(null)

  const notify = (message: string) => {
    setToast(message)
    if (timer.current) window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setToast(''), 2600)
  }

  return (
    <div className="wm-shell wm-light io-shell">
      <WareMapHeader activeScreen="S6" theme="light" notify={notify} />
      <div className="io-layout">
        <OperationMenu
          active={activeOperation}
          setActive={(id) => {
            setActiveOperation(id)
            if (id !== 'import') notify(`Đã chọn ${operations.find((item) => item.id === id)?.label}`)
          }}
        />
        <ImportForm rows={rows} setRows={setRows} notify={notify} />
        <LocationSuggestion notify={notify} />
      </div>
      <div className="io-bottom">
        <span><i /> Phiếu: <strong>IMP-WM-20260922-01</strong></span>
        <span>Tổng: <strong>{rows.length} SKU · {rows.reduce((sum, row) => sum + Number(row.quantity), 0)} pcs</strong></span>
        <MonoLabel size={9}>AUTOSAVE · 11:45:28</MonoLabel>
      </div>
      {toast && <div className="wm-toast"><Check size={15} /> {toast}</div>}
    </div>
  )
}
