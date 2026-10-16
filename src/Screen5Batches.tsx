import { useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Grid, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import {
  AlertTriangle,
  Box,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  MapPin,
  Search,
} from 'lucide-react'
import { Btn, MonoLabel } from './shared'
import { WareMapHeader } from './WareMapHeader'

type BatchStatus = 'expired' | 'critical' | 'warning' | 'ok'
type FilterId = 'all' | 'under30' | '30to90' | 'over90' | 'expired'

interface Batch {
  sku: string
  batchId: string
  expiry: string
  days: number
  qty: number
  location: string
  status: BatchStatus
}

const batches: Batch[] = [
  { sku: 'Clarithromycin', batchId: 'BAT-2025-111', expiry: '03/09/2026', days: -21, qty: 40, location: 'A2-L3-B02', status: 'expired' },
  { sku: 'Cetirizine 10mg', batchId: 'BAT-2025-12E', expiry: '01/09/2026', days: -23, qty: 60, location: 'C2-L2-B02', status: 'expired' },
  { sku: 'Ibuprofen 400mg', batchId: 'BAT-2026-05F', expiry: '10/11/2026', days: 48, qty: 120, location: 'A2-L1-B01', status: 'critical' },
  { sku: 'Paracetamol 500mg', batchId: 'BAT-2026-09A', expiry: '15/11/2026', days: 53, qty: 240, location: 'A1-L2-B03', status: 'critical' },
  { sku: 'Amoxicillin 250mg', batchId: 'BAT-2026-07C', expiry: '28/12/2026', days: 96, qty: 180, location: 'A1-L2-B04', status: 'warning' },
  { sku: 'Amlodipine 5mg', batchId: 'BAT-2026-09J', expiry: '30/12/2026', days: 98, qty: 200, location: 'B2-L1-B04', status: 'warning' },
  { sku: 'Vitamin C 1000mg', batchId: 'BAT-2026-08B', expiry: '05/03/2027', days: 163, qty: 320, location: 'B2-L3-B01', status: 'ok' },
  { sku: 'Metformin 500mg', batchId: 'BAT-2026-08G', expiry: '22/02/2027', days: 151, qty: 280, location: 'B1-L2-B03', status: 'ok' },
  { sku: 'Omeprazole 20mg', batchId: 'BAT-2026-06D', expiry: '20/04/2027', days: 209, qty: 140, location: 'B1-L1-B06', status: 'ok' },
  { sku: 'Atorvastatin 20mg', batchId: 'BAT-2026-07H', expiry: '18/07/2027', days: 297, qty: 100, location: 'C1-L1-B05', status: 'ok' },
]

const filters: Array<{ id: FilterId; label: string; count: number }> = [
  { id: 'all', label: 'Tất cả', count: 10 },
  { id: 'under30', label: '< 30 ngày', count: 2 },
  { id: '30to90', label: '30–90 ngày', count: 2 },
  { id: 'over90', label: '> 90 ngày', count: 4 },
  { id: 'expired', label: 'Hết hạn', count: 2 },
]

const statusConfig = {
  expired: { label: 'HẾT HẠN', className: 'expired' },
  critical: { label: 'CẤP BÁCH', className: 'critical' },
  warning: { label: 'SẮP HẾT', className: 'warning' },
  ok: { label: 'OK', className: 'ok' },
}

type BinStatus = 'selected' | 'critical' | 'warning' | 'ok'

const mapBins: Array<{ position: [number, number, number]; status: BinStatus; location: string }> = [
  { position: [-3.4, 0.35, -1.4], status: 'critical', location: 'A2-L3-B02' },
  { position: [-2.7, 0.35, -1.4], status: 'critical', location: 'A2-L1-B01' },
  { position: [-2, 0.35, -1.4], status: 'warning', location: 'A1-L2-B04' },
  { position: [-3.4, 0.35, -0.7], status: 'ok', location: 'A1-L2-B03' },
  { position: [-2.7, 0.35, -0.7], status: 'ok', location: 'A1-L1-B02' },
  { position: [-2, 0.35, -0.7], status: 'warning', location: 'A1-L3-B01' },
  { position: [0, 0.35, -1.4], status: 'ok', location: 'B1-L2-B03' },
  { position: [0.7, 0.35, -1.4], status: 'ok', location: 'B1-L1-B06' },
  { position: [1.4, 0.35, -1.4], status: 'warning', location: 'B2-L1-B04' },
  { position: [0, 0.35, -0.7], status: 'ok', location: 'B2-L3-B01' },
  { position: [0.7, 0.35, -0.7], status: 'critical', location: 'B3-L1-B02' },
  { position: [1.4, 0.35, -0.7], status: 'ok', location: 'B3-L2-B04' },
  { position: [3, 0.35, -1.4], status: 'critical', location: 'C2-L2-B02' },
  { position: [3.7, 0.35, -1.4], status: 'ok', location: 'C1-L1-B05' },
  { position: [3, 0.35, -0.7], status: 'warning', location: 'C3-L2-B01' },
  { position: [3.7, 0.35, -0.7], status: 'ok', location: 'C3-L3-B03' },
]

function MiniBin({
  position,
  status,
  selected,
}: {
  position: [number, number, number]
  status: BinStatus
  selected: boolean
}) {
  const mesh = useRef<THREE.Mesh>(null)
  const color = selected ? '#94A3B8'
    : status === 'critical' ? '#DC2626'
      : status === 'warning' ? '#D97706'
        : '#059669'

  useFrame(({ clock }) => {
    if (!selected || !mesh.current) return
    const material = mesh.current.material as THREE.MeshStandardMaterial
    material.emissiveIntensity = 0.25 + (Math.sin(clock.elapsedTime * 3) + 1) * 0.2
  })

  return (
    <mesh ref={mesh} position={position} castShadow>
      <boxGeometry args={[0.56, 0.62, 0.56]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={selected ? 0.45 : 0.04}
        roughness={0.42}
        metalness={0.2}
      />
    </mesh>
  )
}

function MiniMapScene({ selectedLocation }: { selectedLocation: string }) {
  return (
    <>
      <color attach="background" args={['#1E293B']} />
      <ambientLight intensity={1.5} />
      <directionalLight position={[5, 8, 6]} intensity={2.2} color="#FFFFFF" />
      <pointLight position={[-4, 3, 2]} intensity={5} color="#0891B2" distance={12} />
      <OrbitControls enablePan={false} enableDamping minDistance={6} maxDistance={15} target={[0, 0.2, -0.4]} />
      <Grid
        position={[0, 0, 0]}
        args={[14, 8]}
        cellSize={0.5}
        cellColor="#334155"
        sectionSize={2}
        sectionColor="#475569"
        fadeDistance={15}
      />
      {[-2.7, 0.7, 3.35].map((x) => (
        <mesh key={x} position={[x, 0.05, -1.05]}>
          <boxGeometry args={[2.4, 0.1, 1.5]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
      ))}
      {mapBins.map((bin) => (
        <MiniBin
          key={bin.location}
          position={bin.position}
          status={bin.status}
          selected={bin.location === selectedLocation}
        />
      ))}
    </>
  )
}

function MiniMap({ selected }: { selected: Batch }) {
  return (
    <aside className="bm-map-panel">
      <div className="bm-map-head">
        <div><MonoLabel size={9} color="#0891B2">WAREHOUSE VIEW</MonoLabel><strong>3D Mini-map</strong></div>
        <span><MapPin size={12} /> {selected.location}</span>
      </div>
      <div className="bm-canvas">
        <Canvas
          shadows
          dpr={[1, 1.5]}
          camera={{ position: [7, 8, 8], fov: 44 }}
          gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
        >
          <MiniMapScene selectedLocation={selected.location} />
        </Canvas>
        <div className="bm-canvas-label"><Box size={13} /> KHO TRUNG TÂM · TẦNG 01</div>
      </div>
      <div className="bm-legend">
        {[
          { color: '#94A3B8', label: 'Được chọn' },
          { color: '#DC2626', label: 'Cấp bách' },
          { color: '#D97706', label: 'Sắp hết' },
          { color: '#059669', label: 'OK' },
        ].map((item) => <span key={item.label}><i style={{ background: item.color }} /> {item.label}</span>)}
      </div>
      <div className="bm-map-hint">
        <MapPin size={15} />
        <div><strong>Click vào hàng để xem chi tiết</strong><span>Vị trí tương ứng sẽ được highlight trên bản đồ 3D</span></div>
      </div>
      <div className="bm-selected-detail">
        <div><span>LÔ ĐANG CHỌN</span><MonoLabel size={9} color="#0F172A">{selected.batchId}</MonoLabel></div>
        <div><span>SẢN PHẨM</span><strong>{selected.sku}</strong></div>
        <div><span>VỊ TRÍ</span><strong>{selected.location}</strong></div>
        <div><span>TỒN KHO</span><strong>{selected.qty} pcs</strong></div>
      </div>
    </aside>
  )
}

function StatusPill({ status }: { status: BatchStatus }) {
  const config = statusConfig[status]
  return <span className={`bm-status ${config.className}`}>{config.label}</span>
}

export default function Screen5Batches() {
  const [activeFilter, setActiveFilter] = useState<FilterId>('all')
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState(batches[0].batchId)
  const [page, setPage] = useState(1)
  const [toast, setToast] = useState('Đã đồng bộ dữ liệu lô và hạn dùng')
  const toastTimer = useRef<number | null>(null)

  const notify = (message: string) => {
    setToast(message)
    if (toastTimer.current) window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(''), 2600)
  }

  const filtered = useMemo(() => {
    const normalized = query.toLowerCase()
    return batches.filter((batch) => {
      const queryMatches = [batch.sku, batch.batchId, batch.location].some((value) => value.toLowerCase().includes(normalized))
      const filterMatches =
        activeFilter === 'all'
        || (activeFilter === 'expired' && batch.days < 0)
        || (activeFilter === 'under30' && batch.days >= 0 && batch.days < 30)
        || (activeFilter === '30to90' && batch.days >= 30 && batch.days <= 90)
        || (activeFilter === 'over90' && batch.days > 90)
      return queryMatches && filterMatches
    })
  }, [activeFilter, query])

  const visibleRows = filtered.slice((page - 1) * 6, page * 6)
  const selected = batches.find((batch) => batch.batchId === selectedId) ?? batches[0]

  return (
    <div className="wm-shell wm-light bm-shell">
      <WareMapHeader activeScreen="S5" theme="light" notify={notify} />

      <div className="bm-content">
        <div className="bm-banner">
          <AlertTriangle size={19} />
          <div>
            <strong>FEFO — First Expired First Out</strong>
            <span>Dữ liệu hiển thị tham khảo. Hệ thống không tự động đề xuất xuất kho. Quyết định xuất kho do nhân viên xác nhận.</span>
          </div>
        </div>

        <div className="bm-toolbar">
          <div className="bm-filter-tabs">
            {filters.map((filter) => (
              <Btn
                key={filter.id}
                variant={activeFilter === filter.id ? 'cyan' : 'ghost'}
                size="sm"
                onClick={() => { setActiveFilter(filter.id); setPage(1) }}
                style={activeFilter === filter.id
                  ? { color: '#FFFFFF', background: '#0891B2', borderColor: '#0891B2' }
                  : { color: '#64748B', background: '#FFFFFF', borderColor: '#E2E8F0' }}
              >
                {filter.label} <span>{filter.count}</span>
              </Btn>
            ))}
          </div>
          <label className="bm-search">
            <Search size={14} />
            <input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1) }} placeholder="Tìm SKU, Batch, Vị trí..." />
            <kbd>⌘ K</kbd>
          </label>
        </div>

        <div className="bm-layout">
          <main className="bm-table-panel">
            <div className="bm-table-head">
              <div><MonoLabel size={9} color="#0891B2">BATCH INVENTORY</MonoLabel><strong>QUẢN LÝ LÔ & HẠN DÙNG</strong></div>
              <span><Clock3 size={13} /> Cập nhật 11:45</span>
            </div>
            <div className="bm-table-wrap">
              <table className="bm-table">
                <thead>
                  <tr>
                    <th>SKU / TÊN</th>
                    <th>BATCH ID</th>
                    <th>HẠN DÙNG</th>
                    <th>CÒN LẠI</th>
                    <th>TỒN (PCS)</th>
                    <th>VỊ TRÍ</th>
                    <th>TRẠNG THÁI</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleRows.map((batch) => (
                    <tr
                      key={batch.batchId}
                      className={selectedId === batch.batchId ? 'selected' : ''}
                      onClick={() => setSelectedId(batch.batchId)}
                    >
                      <td><strong>{batch.sku}</strong></td>
                      <td><MonoLabel size={9} color="#0F172A">{batch.batchId}</MonoLabel></td>
                      <td>{batch.expiry}</td>
                      <td><span className={`bm-days ${batch.days < 0 ? 'expired' : batch.days < 90 ? 'warning' : 'safe'}`}>{batch.days}d</span></td>
                      <td><strong>{batch.qty}</strong></td>
                      <td><span className="bm-location">{batch.location}</span></td>
                      <td><StatusPill status={batch.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bm-pagination">
              <span>Hiển thị <strong>{visibleRows.length}</strong> / {filtered.length || 10} lô hàng</span>
              <div>
                <Btn variant="ghost" size="sm" onClick={() => setPage(Math.max(1, page - 1))}><ChevronLeft size={13} /></Btn>
                {[1, 2].map((number) => (
                  <Btn
                    key={number}
                    variant={page === number ? 'cyan' : 'ghost'}
                    size="sm"
                    onClick={() => setPage(number)}
                    style={page === number
                      ? { color: '#FFFFFF', background: '#0891B2', borderColor: '#0891B2' }
                      : { color: '#64748B', background: '#FFFFFF', borderColor: '#E2E8F0' }}
                  >
                    {number}
                  </Btn>
                ))}
                <Btn variant="ghost" size="sm" onClick={() => setPage(Math.min(2, page + 1))}><ChevronRight size={13} /></Btn>
              </div>
            </div>
          </main>

          <MiniMap selected={selected} />
        </div>
      </div>

      {toast && <div className="wm-toast"><Check size={15} /> {toast}</div>}
    </div>
  )
}
