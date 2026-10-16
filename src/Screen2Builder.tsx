import { Suspense, useMemo, useRef, useState } from 'react'
import type { MutableRefObject } from 'react'
import { Canvas } from '@react-three/fiber'
import { Grid, Line, OrbitControls, PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'
import {
  Box,
  Check,
  Copy,
  Droplets,
  Grid3X3,
  Maximize2,
  Move,
  Plus,
  Printer,
  Redo2,
  Rotate3D,
  RotateCcw,
  Save,
  Scaling,
  ScanLine,
  Snowflake,
  Thermometer,
  Trash2,
  Undo2,
  ZoomIn,
  ZoomOut,
  FileDown,
  Eye,
} from 'lucide-react'
import { Btn, MonoLabel, Tag, WebGLFallback } from './shared'
import { WareMapHeader } from './WareMapHeader'

const C = {
  navy: '#E2E8F0',
  surface: '#FFFFFF',
  slate: '#F8FAFC',
  cyan: '#0891B2',
  blue: '#2563EB',
  red: '#DC2626',
  amber: '#D97706',
  green: '#059669',
  text: '#0F172A',
  sub: '#64748B',
}

type ToolMode = 'select' | 'move' | 'rotate' | 'scale'
type RackStatus = 'selected' | 'warning' | 'available'

interface RackData {
  id: string
  label: string
  position: [number, number, number]
  status: RackStatus
}

const categories = [
  'Kệ Trưng Bày Mỹ Phẩm',
  'Kệ V Lỗ',
  'Tủ Mát Bảo Quản',
  'Khu Tester',
  'Khu Chờ Kiểm Đếm',
]

const templates = [
  { id: 'display', name: 'Kệ Trưng Bày 3 tầng', specs: 'Mỹ phẩm • 5 ô/tầng', capacity: '150 hộp', color: C.cyan, icon: Droplets },
  { id: 'cold', name: 'Tủ Mát 2–8°C', specs: 'Sữa mẹ • Men vi sinh', capacity: 'Kiểm soát nhiệt độ', color: C.blue, icon: Thermometer },
  { id: 'vlo4', name: 'Kệ V Lỗ 4 tầng', specs: 'Tuýp kem • Chai lọ', capacity: '200 tuýp', color: C.green, icon: Box },
]

const initialRacks: RackData[] = [
  { id: 'A1', label: 'Kệ A1', position: [-3.6, 0, 0], status: 'selected' },
  { id: 'A2', label: 'Kệ A2', position: [0, 0, 0], status: 'warning' },
  { id: 'A3', label: 'Kệ A3', position: [3.6, 0, 0], status: 'available' },
]

function RackThumbnail({ color }: { color: string }) {
  return (
    <div className="wb-thumb">
      <div className="wb-thumb-rack" style={{ borderColor: color }}>
        {[0, 1, 2].map((level) => <span key={level} style={{ background: `${color}35` }} />)}
      </div>
      <div className="wb-thumb-grid" />
    </div>
  )
}

function TemplateLibrary({ onAdd }: { onAdd: (name: string) => void }) {
  const [activeCategory, setActiveCategory] = useState(categories[0])

  return (
    <aside className="wb-library">
      <div className="wb-section-head">
        <div>
          <MonoLabel size={9} color={C.cyan}>ASSET LIBRARY</MonoLabel>
          <div>THƯ VIỆN KỆ & THIẾT BỊ</div>
        </div>
        <Tag label="12 MẪU" type="cyan" />
      </div>

      <div className="wb-categories">
        {categories.map((category) => (
          <span key={category} data-active={activeCategory === category}>
            <Btn
              size="sm"
              full
              variant={activeCategory === category ? 'cyan' : 'ghost'}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </Btn>
          </span>
        ))}
      </div>

      <div className="wb-library-label">
        <span>MẪU GỢI Ý</span>
        <small>{activeCategory}</small>
      </div>

      <div className="wb-template-list">
        {templates.map((template) => (
          <div
            className="wb-template-card"
            key={template.id}
            draggable
            onDragStart={(event) => event.dataTransfer.setData('text/plain', template.name)}
          >
            <RackThumbnail color={template.color} />
            <div className="wb-template-copy">
              <strong><template.icon size={12} /> {template.name}</strong>
              <span>{template.specs}</span>
              <MonoLabel size={8}>Sức chứa: {template.capacity}</MonoLabel>
            </div>
            <Btn variant="cyan" size="sm" full onClick={() => onAdd(template.name)}>
              <Plus size={12} /> Thêm vào sơ đồ
            </Btn>
          </div>
        ))}
      </div>
    </aside>
  )
}

function BuilderRack({ rack }: { rack: RackData }) {
  const statusColor = rack.status === 'selected' ? C.cyan : rack.status === 'warning' ? C.red : C.green
  const shelfColors = rack.status === 'warning'
    ? [C.red, C.amber, '#CBD5E1', C.red, '#CBD5E1', C.amber]
    : [C.blue, C.green, '#CBD5E1', C.blue, C.green, '#94A3B8']

  return (
    <group position={rack.position}>
      {[-1.5, 1.5].map((x) => (
        <mesh key={x} position={[x, 1.55, 0]} castShadow>
          <boxGeometry args={[0.1, 3.2, 1.18]} />
          <meshStandardMaterial color={statusColor} metalness={0.7} roughness={0.3} />
        </mesh>
      ))}
      {[0, 1, 2, 3].map((level) => (
        <group key={level}>
          <mesh position={[0, level * 0.8 + 0.08, 0]} castShadow>
            <boxGeometry args={[3.1, 0.1, 1.25]} />
            <meshStandardMaterial color={statusColor} metalness={0.62} roughness={0.3} />
          </mesh>
          {level < 3 && [0, 1].map((slot) => (
            <mesh key={slot} position={[-0.76 + slot * 1.52, level * 0.8 + 0.42, 0]} castShadow>
              <boxGeometry args={[1.25, 0.52, 0.9]} />
              <meshStandardMaterial color={shelfColors[level * 2 + slot]} roughness={0.45} />
            </mesh>
          ))}
        </group>
      ))}
      <mesh position={[0, 1.52, 0]}>
        <boxGeometry args={[3.3, 3.32, 1.42]} />
        <meshBasicMaterial color={statusColor} transparent opacity={0.075} wireframe />
      </mesh>
    </group>
  )
}

function BuilderScene({ racks, orbitRef }: { racks: RackData[]; orbitRef: MutableRefObject<any> }) {
  return (
    <>
      <color attach="background" args={[C.navy]} />
      <fog attach="fog" args={[C.navy, 15, 30]} />
      <ambientLight intensity={2.2} />
      <directionalLight position={[5, 10, 7]} intensity={3.6} color="#FFFFFF" castShadow />
      <pointLight position={[-5, 4, 2]} intensity={5} color="#A5F3FC" distance={14} />
      <PerspectiveCamera makeDefault position={[10, 9, 12]} fov={42} />
      <OrbitControls ref={orbitRef} makeDefault enableDamping minDistance={8} maxDistance={24} maxPolarAngle={Math.PI / 2.05} target={[0, 1.2, 0]} />
      <Grid
        position={[0, -0.02, 0]}
        args={[26, 22]}
        cellSize={0.5}
        cellColor="#CBD5E1"
        cellThickness={0.45}
        sectionSize={2}
        sectionColor="#94A3B8"
        sectionThickness={0.9}
        fadeDistance={24}
        infiniteGrid
      />
      {racks.map((rack) => <BuilderRack key={rack.id} rack={rack} />)}
      <Line points={[[-5.15, 0.16, 1], [-2.05, 0.16, 1]]} color={C.amber} lineWidth={2} />
      <Line points={[[-5.15, 0.05, 0.78], [-5.15, 0.27, 1.22]]} color={C.amber} lineWidth={2} />
      <Line points={[[-2.05, 0.05, 0.78], [-2.05, 0.27, 1.22]]} color={C.amber} lineWidth={2} />
    </>
  )
}

const tools: Array<{ mode: ToolMode; label: string; key: string; icon: typeof ScanLine }> = [
  { mode: 'select', label: 'Select', key: 'V', icon: ScanLine },
  { mode: 'move', label: 'Move', key: 'M', icon: Move },
  { mode: 'rotate', label: 'Rotate', key: 'R', icon: Rotate3D },
  { mode: 'scale', label: 'Scale', key: 'S', icon: Scaling },
]

function BuilderWorkspace({
  racks,
  notify,
  onAdd,
}: {
  racks: RackData[]
  notify: (message: string) => void
  onAdd: (name: string) => void
}) {
  const [tool, setTool] = useState<ToolMode>('select')
  const [snap, setSnap] = useState(true)
  const orbitRef = useRef<any>(null)

  return (
    <main className="wb-center">
      <div className="wb-canvas-head">
        <div>
          <div className="wb-canvas-title">Khung nhìn 3D WareMap <Tag label="EDIT MODE" type="cyan" /></div>
          <MonoLabel size={9}>KHO TRUNG TÂM · FLOOR PLAN A · AUTOSAVE ON</MonoLabel>
        </div>
        <div className="wb-head-status"><span /> 3 KỆ · 52 Ô · SNAP 100MM</div>
      </div>

      <div
        className="wb-viewport"
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          const templateName = event.dataTransfer.getData('text/plain')
          if (templateName) onAdd(templateName)
        }}
      >
        <Suspense fallback={<WebGLFallback />}>
          <Canvas shadows dpr={[1, 1.5]} gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}>
            <BuilderScene racks={racks} orbitRef={orbitRef} />
          </Canvas>
        </Suspense>

        <div className="wb-floating-tools">
          {tools.map(({ mode, label, key, icon: Icon }) => (
            <span key={mode} data-active={tool === mode}>
              <Btn size="sm" variant={tool === mode ? 'cyan' : 'ghost'} onClick={() => setTool(mode)}>
                <Icon size={13} /> {label} <kbd>{key}</kbd>
              </Btn>
            </span>
          ))}
          <div className="wb-tool-separator" />
          <Btn variant="ghost" size="sm" onClick={() => notify('Đã hoàn tác thao tác gần nhất')}><Undo2 size={14} /></Btn>
          <Btn variant="ghost" size="sm" onClick={() => notify('Đã khôi phục thao tác')}><Redo2 size={14} /></Btn>
          <Btn variant={snap ? 'cyan' : 'ghost'} size="sm" onClick={() => setSnap((value) => !value)}>
            <Grid3X3 size={13} /> Snap
          </Btn>
          <Btn variant="cyan" size="sm" onClick={() => notify('Đang ở chế độ 3D Preview')}>
            <Box size={13} /> 3D Preview
          </Btn>
        </div>

        <div className="wb-measure">
          <MonoLabel size={9} color={C.amber}>↔ 3.100 MM · KỆ A1</MonoLabel>
        </div>

        <div className="wb-rack-labels">
          <span className="cyan">KỆ A1 · ĐANG CHỌN</span>
          <span className="red">KỆ A2 · FEFO ALERT</span>
          <span className="green">KỆ A3 · CÒN CHỖ</span>
        </div>

        <div className="wb-camera-controls">
          <Btn variant="ghost" size="sm" onClick={() => notify('Camera đã phóng to')}><ZoomIn size={14} /></Btn>
          <Btn variant="ghost" size="sm" onClick={() => notify('Camera đã thu nhỏ')}><ZoomOut size={14} /></Btn>
          <Btn variant="ghost" size="sm" onClick={() => notify('Đã xoay camera 360°')}><Rotate3D size={14} /></Btn>
          <Btn variant="cyan" size="sm" onClick={() => { orbitRef.current?.reset(); notify('Đã đặt lại góc nhìn') }}>
            <RotateCcw size={14} /> Reset View
          </Btn>
          <Btn variant="ghost" size="sm" onClick={() => notify('Đã mở toàn màn hình')}><Maximize2 size={14} /></Btn>
        </div>

        <div className="wb-expiry-overlay">
          <div className="wb-expiry-icon"><Droplets size={15} /></div>
          <div>
            <span>LÔ CẬN HẠN</span>
            <strong>LOT-WM-202608</strong>
            <small>Son Môi A · còn 23 ngày</small>
          </div>
        </div>
      </div>
    </main>
  )
}

function FormField({
  label,
  value,
  unit,
  onChange,
}: {
  label: string
  value: string
  unit: string
  onChange: (value: string) => void
}) {
  return (
    <label className="wb-field">
      <span>{label}</span>
      <div>
        <input value={value} onChange={(event) => onChange(event.target.value)} />
        <small>{unit}</small>
      </div>
    </label>
  )
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: string[]
  onChange: (value: string) => void
}) {
  return (
    <label className="wb-select-field">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
    </label>
  )
}

function QRCode({ value }: { value: string }) {
  const cells = useMemo(() => {
    return Array.from({ length: 121 }, (_, index) => {
      const row = Math.floor(index / 11)
      const column = index % 11
      const finder = (row < 3 && column < 3) || (row < 3 && column > 7) || (row > 7 && column < 3)
      const seed = value.charCodeAt(index % value.length)
      return finder || (seed + row * 7 + column * 11) % 3 !== 0
    })
  }, [value])

  return (
    <div className="wb-qr-grid">
      {cells.map((active, index) => <span key={index} className={active ? 'active' : ''} />)}
    </div>
  )
}

function RackInspector({
  notify,
  onDelete,
}: {
  notify: (message: string) => void
  onDelete: () => void
}) {
  const [dimensions, setDimensions] = useState({ length: '3100', width: '1200', height: '3200' })
  const [temperature, setTemperature] = useState('Nhiệt độ phòng')
  const [productType, setProductType] = useState('Mỹ phẩm')
  const [maxLoad, setMaxLoad] = useState('450')
  const [floors, setFloors] = useState('4')
  const [bins, setBins] = useState('20')
  const [fefoAlert, setFefoAlert] = useState(true)
  const qrValue = 'LOC-WM-A1-F2-B03'

  return (
    <aside className="wb-inspector">
      <div className="wb-section-head">
        <div>
          <MonoLabel size={9} color={C.cyan}>RACK INSPECTOR</MonoLabel>
          <div>CHI TIẾT KỆ & MÃ QR</div>
        </div>
        <Tag label="SELECTED" type="cyan" />
      </div>

      <div className="wb-capacity-card">
        <div className="wb-progress-ring">
          <div><strong>85%</strong><span>FULL</span></div>
        </div>
        <div>
          <MonoLabel size={9} color={C.cyan}>VỊ TRÍ ĐANG CHỌN</MonoLabel>
          <strong>Rack A1 · Level 2</strong>
          <span>Bin 03 · Khu trưng bày</span>
        </div>
      </div>

      <section className="wb-form-section">
        <div className="wb-subtitle"><Scaling size={14} /> KÍCH THƯỚC KỆ</div>
        <div className="wb-field-row">
          <FormField label="Dài" value={dimensions.length} unit="mm" onChange={(length) => setDimensions({ ...dimensions, length })} />
          <FormField label="Rộng" value={dimensions.width} unit="mm" onChange={(width) => setDimensions({ ...dimensions, width })} />
          <FormField label="Cao" value={dimensions.height} unit="mm" onChange={(height) => setDimensions({ ...dimensions, height })} />
        </div>
        <div className="wb-field-row two wb-count-fields">
          <FormField label="Số tầng" value={floors} unit="tầng" onChange={setFloors} />
          <FormField label="Số ô" value={bins} unit="ô" onChange={setBins} />
        </div>
      </section>

      <section className="wb-form-section">
        <div className="wb-subtitle"><Snowflake size={14} /> ĐIỀU KIỆN BẢO QUẢN</div>
        <SelectField
          label="Nhiệt độ bảo quản"
          value={temperature}
          options={['Nhiệt độ phòng', 'Mát 2–8°C', 'Lạnh -20°C']}
          onChange={setTemperature}
        />
        <div className="wb-field-row two wb-product-fields">
          <FormField label="Tải trọng tối đa" value={maxLoad} unit="kg" onChange={setMaxLoad} />
          <SelectField
            label="Loại hàng"
            value={productType}
            options={['Mỹ phẩm', 'Sữa bột', 'Bỉm tã', 'TPBS']}
            onChange={setProductType}
          />
        </div>
        <div className="wb-toggle-row">
          <div><Droplets size={14} /><span>Cảnh báo FEFO</span></div>
          <Btn
            variant={fefoAlert ? 'cyan' : 'ghost'}
            size="sm"
            onClick={() => setFefoAlert((enabled) => !enabled)}
            style={{ width: 42, padding: 3, justifyContent: fefoAlert ? 'flex-end' : 'flex-start' }}
          >
            <span className="wb-toggle-knob" />
          </Btn>
        </div>
      </section>

      <section className="wb-qr-card">
        <div className="wb-subtitle"><ScanLine size={14} /> MÃ QR Ô/KỆ WAREMAP</div>
        <div className="wb-qr-content">
          <QRCode value={qrValue} />
          <div>
            <MonoLabel size={10} color={C.cyan}>{qrValue}</MonoLabel>
            <span>Rack A1 · Tầng 2 · Ô 03</span>
            <small>Cập nhật: 11:45 hôm nay</small>
          </div>
        </div>
        <Btn variant="ghost" size="sm" full onClick={() => notify(`Đang xuất ${qrValue}.pdf`)}>
          <Printer size={13} /> In mã QR Kệ
        </Btn>
      </section>

      <div className="wb-inspector-actions">
        <Btn variant="cyan" size="md" full onClick={() => notify('Đã lưu cấu hình Kệ A1')}>
          <Save size={14} /> Lưu cấu hình
        </Btn>
        <Btn variant="danger" size="md" full onClick={onDelete}>
          <Trash2 size={14} /> Xóa Kệ
        </Btn>
      </div>
    </aside>
  )
}

function BottomToolbar({
  onAdd,
  onDelete,
  notify,
}: {
  onAdd: () => void
  onDelete: () => void
  notify: (message: string) => void
}) {
  return (
    <div className="wb-bottom">
      <div className="wb-bottom-actions">
        <Btn variant="cyan" size="sm" onClick={() => notify('Đã lưu sơ đồ kho')}><Save size={13} /> Lưu sơ đồ</Btn>
        <Btn variant="ghost" size="sm" onClick={() => notify('Đang mở chế độ thực tế 3D')}><Eye size={13} /> Xem thực tế 3D</Btn>
        <Btn variant="ghost" size="sm" onClick={() => notify('Đang xuất PDF toàn bộ mã QR')}><FileDown size={13} /> Xuất PDF toàn bộ Mã QR</Btn>
      </div>
      <div className="wb-selected-text">
        <span /> Đang chọn: <strong>Kệ A1</strong> · Khu trưng bày Mỹ phẩm
      </div>
    </div>
  )
}

export default function Screen2Builder() {
  const [racks, setRacks] = useState(initialRacks)
  const [toast, setToast] = useState('Builder đã tải cấu hình kho gần nhất')
  const toastTimer = useRef<number | null>(null)

  const notify = (message: string) => {
    setToast(message)
    if (toastTimer.current) window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(''), 2600)
  }

  const addRack = (name = 'Kệ Trưng Bày 3 tầng') => {
    const id = `N${racks.length + 1}`
    setRacks((current) => [
      ...current,
      { id, label: name, position: [0, 0, 3.4 + current.length * 0.2], status: 'available' },
    ])
    notify(`Đã thêm ${name} vào sơ đồ`)
  }

  const deleteRack = () => {
    if (racks.length <= 1) return notify('Sơ đồ phải còn ít nhất một kệ')
    setRacks((current) => current.slice(0, -1))
    notify('Đã xóa kệ khỏi sơ đồ')
  }

  return (
    <div className="wm-shell wm-light wb-shell wb-light">
      <WareMapHeader activeScreen="S2" theme="light" notify={notify} />
      <div className="wb-layout">
        <TemplateLibrary onAdd={addRack} />
        <BuilderWorkspace racks={racks} notify={notify} onAdd={addRack} />
        <RackInspector notify={notify} onDelete={deleteRack} />
      </div>
      <BottomToolbar onAdd={() => addRack()} onDelete={deleteRack} notify={notify} />
      {toast && <div className="wm-toast"><Check size={15} /> {toast}</div>}
    </div>
  )
}
