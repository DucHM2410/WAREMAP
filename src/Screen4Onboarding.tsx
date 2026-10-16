import { Suspense, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Grid, Line, OrbitControls, PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'
import {
  AlertTriangle,
  BellRing,
  Check,
  Clipboard,
  Download,
  Hourglass,
  MapPin,
  MessageCircle,
  Navigation,
  RotateCcw,
  Route,
  Send,
  ZoomIn,
  ZoomOut,
} from 'lucide-react'
import { Btn, MonoLabel, WebGLFallback } from './shared'
import { WareMapHeader } from './WareMapHeader'

type AlertLevel = 'critical' | 'warning'

const alerts: Array<{
  product: string
  days: number
  lot: string
  location: string
  level: AlertLevel
}> = [
  { product: 'Son Môi A · Màu 01', days: 23, lot: 'LOT-WM-202608', location: 'A1 · Tầng 2 · Ô 03', level: 'critical' },
  { product: 'Kem Dưỡng B · 50ml', days: 45, lot: 'LOT-WM-202611', location: 'A2 · Tầng 3 · Ô 14', level: 'warning' },
  { product: 'Sữa Bột C · 800g', days: 12, lot: 'LOT-WM-202603', location: 'B1 · Tầng 1 · Ô 06', level: 'critical' },
]

function CriticalBin() {
  const material = useRef<THREE.MeshStandardMaterial>(null)

  useFrame(({ clock }) => {
    if (!material.current) return
    const pulse = (Math.sin(clock.elapsedTime * 4) + 1) / 2
    material.current.emissiveIntensity = 0.45 + pulse * 1.6
    material.current.opacity = 0.72 + pulse * 0.28
  })

  return (
    <mesh position={[0.78, 1.25, 0]} castShadow>
      <boxGeometry args={[1.35, 0.58, 1]} />
      <meshStandardMaterial
        ref={material}
        color="#DC2626"
        emissive="#DC2626"
        emissiveIntensity={1}
        transparent
        roughness={0.35}
      />
    </mesh>
  )
}

function FefoRack() {
  const products = ['#2563EB', '#059669', '#D97706', '#CBD5E1', '#2563EB', '#059669']

  return (
    <group position={[1.5, 0, -0.2]}>
      {[-1.7, 1.7].map((x) => (
        <mesh key={x} position={[x, 1.7, 0]} castShadow>
          <boxGeometry args={[0.11, 3.5, 1.32]} />
          <meshStandardMaterial color="#64748B" metalness={0.65} roughness={0.3} />
        </mesh>
      ))}
      {[0, 1, 2, 3].map((level) => (
        <group key={level}>
          <mesh position={[0, level * 0.9 + 0.08, 0]} castShadow>
            <boxGeometry args={[3.5, 0.1, 1.4]} />
            <meshStandardMaterial color="#64748B" metalness={0.6} roughness={0.3} />
          </mesh>
          {level < 3 && [-1, 0, 1].map((slot, slotIndex) => (
            <mesh key={slot} position={[slot * 1.12, level * 0.9 + 0.46, 0]} castShadow>
              <boxGeometry args={[0.94, 0.58, 1]} />
              <meshStandardMaterial color={products[(level * 2 + slotIndex) % products.length]} roughness={0.44} />
            </mesh>
          ))}
        </group>
      ))}
      <CriticalBin />
      <mesh position={[0, 1.67, 0]}>
        <boxGeometry args={[3.72, 3.55, 1.58]} />
        <meshBasicMaterial color="#0891B2" transparent opacity={0.04} wireframe />
      </mesh>
    </group>
  )
}

function NavigationScene({ pathVisible }: { pathVisible: boolean }) {
  const pathPoints: [number, number, number][] = [
    [-5.7, 0.08, 4.2],
    [-3.5, 0.08, 3.1],
    [-2.2, 0.08, 1.1],
    [-0.5, 0.08, 0.6],
    [1.5, 1.25, 0.7],
  ]

  return (
    <>
      <color attach="background" args={['#E2E8F0']} />
      <fog attach="fog" args={['#E2E8F0', 14, 28]} />
      <ambientLight intensity={2.2} />
      <directionalLight position={[5, 10, 7]} intensity={3.5} color="#FFFFFF" castShadow />
      <pointLight position={[1.5, 3, 2]} intensity={5} color="#FCA5A5" distance={10} />
      <PerspectiveCamera makeDefault position={[9, 8, 11]} fov={42} />
      <OrbitControls makeDefault enableDamping minDistance={7} maxDistance={22} maxPolarAngle={Math.PI / 2.08} target={[0, 1.1, 0]} />
      <Grid
        position={[0, -0.02, 0]}
        args={[24, 20]}
        cellSize={0.5}
        cellColor="#CBD5E1"
        cellThickness={0.45}
        sectionSize={2}
        sectionColor="#94A3B8"
        sectionThickness={0.85}
        fadeDistance={23}
        infiniteGrid
      />
      <FefoRack />
      {pathVisible && (
        <>
          <Line points={pathPoints} color="#0891B2" lineWidth={4} dashed dashSize={0.35} gapSize={0.15} />
          {pathPoints.slice(1, -1).map((point, index) => (
            <mesh key={index} position={point} rotation={[0, 0, -Math.PI / 2]}>
              <coneGeometry args={[0.14, 0.34, 3]} />
              <meshBasicMaterial color="#0891B2" />
            </mesh>
          ))}
          <mesh position={[-5.7, 0.18, 4.2]}>
            <cylinderGeometry args={[0.28, 0.28, 0.08, 24]} />
            <meshStandardMaterial color="#0891B2" emissive="#0891B2" emissiveIntensity={0.25} />
          </mesh>
        </>
      )}
    </>
  )
}

function AlertList({
  selected,
  setSelected,
  notify,
}: {
  selected: string
  setSelected: (lot: string) => void
  notify: (message: string) => void
}) {
  return (
    <aside className="wf-left">
      <div className="wf-panel-title">
        <div>
          <MonoLabel size={9} color="#0891B2">FEFO PRIORITY QUEUE</MonoLabel>
          <strong>DANH SÁCH CẢNH BÁO FEFO</strong>
        </div>
        <Hourglass size={18} />
      </div>

      <div className="wf-alert-summary">
        <div><strong>12</strong><span>Lô cận hạn</span></div>
        <div className="danger"><strong>04</strong><span>Khẩn cấp</span></div>
        <div className="warning"><strong>08</strong><span>Cảnh báo</span></div>
      </div>

      <div className="wf-alert-list">
        {alerts.map((alert) => (
          <article
            className={`wf-alert-card ${alert.level} ${selected === alert.lot ? 'selected' : ''}`}
            key={alert.lot}
            onClick={() => setSelected(alert.lot)}
          >
            <div className="wf-alert-top">
              <div className="wf-hourglass"><Hourglass size={15} /></div>
              <div>
                <strong>{alert.product}</strong>
                <MonoLabel size={9}>{alert.lot}</MonoLabel>
              </div>
              <div className="wf-days"><strong>{alert.days}</strong><span>ngày</span></div>
            </div>
            <div className="wf-location"><MapPin size={12} /> {alert.location}</div>
            <div className="wf-alert-actions">
              <Btn
                variant="cyan"
                size="sm"
                full
                onClick={() => notify(`Đang chỉ đường đến ${alert.location}`)}
                style={{ color: '#FFFFFF', background: '#0891B2', borderColor: '#0891B2' }}
              >
                <Route size={13} /> Chỉ đường 3D
              </Btn>
              <Btn
                variant="ghost"
                size="sm"
                full
                onClick={() => notify(`Đã tạo phiếu xuất FEFO cho ${alert.lot}`)}
                style={{ color: '#475569', background: '#FFFFFF', borderColor: '#CBD5E1' }}
              >
                <Download size={13} /> Xuất FEFO
              </Btn>
            </div>
          </article>
        ))}
      </div>
    </aside>
  )
}

function AlertBanner({
  onNavigate,
  onDismiss,
}: {
  onNavigate: () => void
  onDismiss: () => void
}) {
  return (
    <div className="wf-banner">
      <div className="wf-banner-icon"><AlertTriangle size={20} /></div>
      <div>
        <strong>Lô cận hạn · Hạn dùng dưới 30 ngày</strong>
        <span>Son Môi A · Màu 01 (<b>LOT-WM-202608</b>) · Ưu tiên xuất theo FEFO</span>
      </div>
      <div className="wf-banner-actions">
        <Btn
          variant="cyan"
          size="sm"
          onClick={onNavigate}
          style={{ color: '#FFFFFF', background: '#0891B2', borderColor: '#0891B2' }}
        >
          <Navigation size={13} /> Chỉ đường 3D
        </Btn>
        <Btn
          variant="ghost"
          size="sm"
          onClick={onDismiss}
          style={{ color: '#475569', background: '#FFFFFF', borderColor: '#CBD5E1' }}
        >
          Bỏ qua
        </Btn>
      </div>
    </div>
  )
}

function FefoWorkspace({ notify }: { notify: (message: string) => void }) {
  const [pathVisible, setPathVisible] = useState(true)
  const [bannerVisible, setBannerVisible] = useState(true)

  return (
    <main className="wf-center">
      {bannerVisible && (
        <AlertBanner
          onNavigate={() => { setPathVisible(true); notify('Đã bật chỉ đường đến Kệ A1 · Tầng 2 · Ô 03') }}
          onDismiss={() => setBannerVisible(false)}
        />
      )}
      <div className="wf-canvas-head">
        <div>
          <MonoLabel size={9} color="#0891B2">FEFO 3D NAVIGATION</MonoLabel>
          <strong>CHỈ ĐƯỜNG NHẶT HÀNG ƯU TIÊN</strong>
        </div>
        <span><i /> Kệ A1 · Tầng 2 · Ô 03</span>
      </div>
      <div className="wf-viewport">
        <Suspense fallback={<WebGLFallback />}>
          <Canvas shadows dpr={[1, 1.5]} gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}>
            <NavigationScene pathVisible={pathVisible} />
          </Canvas>
        </Suspense>

        <div className="wf-camera-tools">
          <Btn variant="ghost" size="sm" onClick={() => notify('Đã phóng to bản đồ')}><ZoomIn size={14} /></Btn>
          <Btn variant="ghost" size="sm" onClick={() => notify('Đã thu nhỏ bản đồ')}><ZoomOut size={14} /></Btn>
          <Btn variant="ghost" size="sm" onClick={() => notify('Đã xoay góc nhìn')}><RotateCcw size={14} /> Rotate</Btn>
          <Btn variant="ghost" size="sm" onClick={() => notify('Đã đặt lại góc nhìn')}><RotateCcw size={14} /> Reset</Btn>
          <Btn
            variant={pathVisible ? 'cyan' : 'ghost'}
            size="sm"
            onClick={() => setPathVisible((visible) => !visible)}
            style={pathVisible ? { color: '#FFFFFF', background: '#0891B2', borderColor: '#0891B2' } : undefined}
          >
            <Route size={14} /> {pathVisible ? 'Tắt' : 'Bật'} chỉ đường
          </Btn>
        </div>

        <div className="wf-current-position"><Navigation size={13} /><span>VỊ TRÍ HIỆN TẠI</span></div>
        <div className="wf-target-card">
          <div className="wf-pulse-dot" />
          <div><span>ĐIỂM ĐẾN FEFO</span><strong>A1 · Tầng 2 · Ô 03</strong><MonoLabel size={8}>LOT-WM-202608</MonoLabel></div>
        </div>
      </div>
    </main>
  )
}

const messageText = `[WAREMAP ALERT] Cửa Hàng Chi Nhánh A

Cảnh báo Lô hàng cận hạn sử dụng:
• Tên sản phẩm: Kem Dưỡng B 50ml
• Mã Lô: LOT-WM-2026
• Hạn SD: 15/10/2026 (Còn 23 ngày)
• Vị trí 3D WareMap: Kệ A1 - Tầng 2 - Ô 03

👉 Bấm để mở Bản đồ 3D WareMap chỉ đường nhặt hàng.`

function NotificationPanel({ notify }: { notify: (message: string) => void }) {
  const copyMessage = async () => {
    try {
      await navigator.clipboard.writeText(messageText)
      notify('Đã sao chép mẫu tin nhắn')
    } catch {
      notify('Đã chọn nội dung mẫu tin nhắn')
    }
  }

  return (
    <aside className="wf-right">
      <div className="wf-panel-title">
        <div>
          <MonoLabel size={9} color="#0891B2">ZALO OA · PWA PUSH</MonoLabel>
          <strong>MẪU TIN NHẮN TỰ ĐỘNG</strong>
        </div>
        <BellRing size={18} />
      </div>

      <div className="wf-channel-tabs">
        <span className="active"><MessageCircle size={13} /> Zalo OA</span>
        <span><BellRing size={13} /> PWA Push</span>
      </div>

      <section className="wf-chat-preview">
        <div className="wf-chat-head">
          <div className="wf-zalo-logo">Z</div>
          <div><strong>WareMap Alert</strong><span>Official Account · vừa xong</span></div>
          <CheckCircleMark />
        </div>
        <div className="wf-chat-body">
          <div className="wf-message-badge"><AlertTriangle size={13} /> FEFO ALERT</div>
          <strong>[WAREMAP ALERT] Cửa Hàng Chi Nhánh A</strong>
          <p>Cảnh báo Lô hàng cận hạn sử dụng:</p>
          <ul>
            <li><span>Tên sản phẩm:</span> Kem Dưỡng B 50ml</li>
            <li><span>Mã Lô:</span> <b>LOT-WM-2026</b></li>
            <li><span>Hạn SD:</span> 15/10/2026 <em>(Còn 23 ngày)</em></li>
            <li><span>Vị trí 3D WareMap:</span> Kệ A1 - Tầng 2 - Ô 03</li>
          </ul>
          <div className="wf-chat-link"><Navigation size={14} /> Bấm để mở Bản đồ 3D WareMap chỉ đường nhặt hàng.</div>
        </div>
        <div className="wf-chat-time">11:45 · Đã gửi tự động</div>
      </section>

      <div className="wf-notification-meta">
        <div><span>ĐỐI TƯỢNG NHẬN</span><strong>Quản lý CN A · 3 thiết bị</strong></div>
        <div><span>LỊCH GỬI</span><strong>Ngay khi lô dưới 30 ngày</strong></div>
      </div>

      <div className="wf-notification-actions">
        <Btn
          variant="ghost"
          size="md"
          full
          onClick={copyMessage}
          style={{ color: '#475569', background: '#FFFFFF', borderColor: '#CBD5E1' }}
        >
          <Clipboard size={14} /> Sao chép
        </Btn>
        <Btn
          variant="primary"
          size="md"
          full
          onClick={() => notify('Đã gửi cảnh báo qua Zalo OA')}
          style={{ color: '#FFFFFF', background: '#0068FF', borderColor: '#0068FF' }}
        >
          <Send size={14} /> Gửi Zalo OA
        </Btn>
      </div>
    </aside>
  )
}

function CheckCircleMark() {
  return <span className="wf-verified"><Check size={10} /></span>
}

export default function Screen4Onboarding({ onDone: _onDone }: { onDone?: () => void }) {
  const [selected, setSelected] = useState(alerts[0].lot)
  const [toast, setToast] = useState('Đã tải 12 cảnh báo FEFO mới nhất')
  const toastTimer = useRef<number | null>(null)

  const notify = (message: string) => {
    setToast(message)
    if (toastTimer.current) window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(''), 2600)
  }

  return (
    <div className="wm-shell wm-light wf-shell">
      <WareMapHeader activeScreen="S4" theme="light" notify={notify} />
      <div className="wf-layout">
        <AlertList selected={selected} setSelected={setSelected} notify={notify} />
        <FefoWorkspace notify={notify} />
        <NotificationPanel notify={notify} />
      </div>
      <div className="wf-bottom">
        <span>Tổng: <strong>12 lô cận hạn</strong></span>
        <span className="critical"><i /> 4 khẩn cấp</span>
        <span className="warning"><i /> 8 cảnh báo</span>
        <MonoLabel size={9}>FEFO ENGINE · CẬP NHẬT 11:45</MonoLabel>
      </div>
      {toast && <div className="wm-toast"><Check size={15} /> {toast}</div>}
    </div>
  )
}
