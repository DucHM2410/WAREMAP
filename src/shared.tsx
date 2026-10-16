// ─── Look3D Design Tokens ─────────────────────────────────────────────────────
export const T = {
  blue:    '#0066FF',
  blueDim: '#0052CC',
  blueGlow:'rgba(0,102,255,0.35)',
  cyan:    '#00E5FF',
  cyanDim: '#00B8CC',
  cyanGlow:'rgba(0,229,255,0.4)',
  green:   '#10B981',
  amber:   '#F59E0B',
  red:     '#EF4444',
  canvas:  '#0F172A',
  surface: '#1E293B',
  surf2:   '#263448',
  surf3:   '#334155',
  border:  '#1E3A5F',
  border2: '#2D4A6B',
  panel:   '#F8FAFC',
  text:    '#F1F5F9',
  textSub: '#94A3B8',
  textMut: '#64748B',
  mono:    "'JetBrains Mono', monospace",
}

// ─── Types ────────────────────────────────────────────────────────────────────
export type AppScreen = 'home' | 'login' | 'dashboard' | 'builder' | 'mobile' | 'onboarding' | 'batches' | 'inventory' | 'roi' | 'scanner' | 'account' | 'settings'

export interface BatchRow {
  sku: string
  batchId: string
  expiry: string
  qty: number
  location: string
  daysLeft: number
  status: 'ok' | 'warn' | 'critical' | 'expired' | 'inspect'
}

// ─── Shared UI atoms ─────────────────────────────────────────────────────────

import { useState } from 'react'

export function MonoLabel({ children, color, size = 11 }: { children: React.ReactNode, color?: string, size?: number }) {
  return (
    <span style={{ fontFamily: T.mono, fontSize: size, color: color ?? T.textSub, letterSpacing: '0.04em' }}>
      {children}
    </span>
  )
}

export function Tag({ label, type }: { label: string, type: 'red'|'amber'|'green'|'cyan'|'blue'|'muted'|'dark' }) {
  const map = {
    red:   { bg: 'rgba(239,68,68,0.15)',  border: 'rgba(239,68,68,0.45)',  color: '#FCA5A5' },
    amber: { bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.45)', color: '#FCD34D' },
    green: { bg: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.45)', color: '#6EE7B7' },
    cyan:  { bg: 'rgba(0,229,255,0.12)',  border: 'rgba(0,229,255,0.4)',   color: T.cyan },
    blue:  { bg: 'rgba(0,102,255,0.15)',  border: 'rgba(0,102,255,0.4)',   color: '#93C5FD' },
    muted: { bg: 'rgba(100,116,139,0.2)', border: 'rgba(100,116,139,0.4)', color: T.textSub },
    dark:  { bg: T.surf2,                 border: T.border,                 color: T.text },
  }[type]
  return (
    <span style={{
      background: map.bg, border: `1px solid ${map.border}`, color: map.color,
      borderRadius: 4, padding: '2px 7px', fontSize: 10, fontWeight: 700,
      fontFamily: T.mono, letterSpacing: '0.06em', whiteSpace: 'nowrap', textTransform: 'uppercase',
    }}>{label}</span>
  )
}

export function Btn({
  children, variant = 'primary', size = 'md', onClick, style: s = {}, disabled, full, className,
}: {
  children: React.ReactNode
  variant?: 'primary'|'cyan'|'ghost'|'outline'|'danger'|'success'|'secondary'
  size?: 'sm'|'md'|'lg'
  onClick?: () => void
  style?: React.CSSProperties
  disabled?: boolean
  full?: boolean
  className?: string
}) {
  const [hover, setHover] = useState(false)
  const sz = {
    sm: { padding: '5px 10px', fontSize: 12, height: 30 },
    md: { padding: '0 14px',   height: 36,   fontSize: 13 },
    lg: { padding: '0 20px',   height: 44,   fontSize: 14 },
  }[size]
  const v = {
    primary:   { background: hover ? T.blueDim : T.blue, color: '#fff',         border: 'none' },
    cyan:      { background: hover ? 'rgba(0,229,255,0.22)' : 'rgba(0,229,255,0.12)', color: T.cyan, border: `1px solid rgba(0,229,255,0.45)` },
    ghost:     { background: hover ? T.surf2 : 'transparent', color: T.textSub, border: `1px solid ${T.border}` },
    outline:   { background: hover ? 'rgba(0,102,255,0.12)' : 'transparent', color: T.blue, border: `1px solid ${T.blue}` },
    danger:    { background: hover ? 'rgba(239,68,68,0.22)' : 'rgba(239,68,68,0.1)', color: '#FCA5A5', border: `1px solid rgba(239,68,68,0.4)` },
    success:   { background: hover ? 'rgba(16,185,129,0.22)' : 'rgba(16,185,129,0.1)', color: '#6EE7B7', border: `1px solid rgba(16,185,129,0.4)` },
    secondary: { background: hover ? T.surf3 : T.surf2,  color: T.text,        border: `1px solid ${T.border}` },
  }[variant]
  return (
    <button
      className={className}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ ...sz, ...v, borderRadius: 6, fontWeight: 600, cursor: disabled ? 'not-allowed' : 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'Inter, sans-serif', opacity: disabled ? 0.4 : 1, transition: 'all 0.15s', whiteSpace: 'nowrap', width: full ? '100%' : undefined, justifyContent: full ? 'center' : undefined, ...s }}
      onClick={onClick} disabled={disabled}
    >{children}</button>
  )
}

export function GaugeArc({ pct, color, label = 'OCCUPANCY' }: { pct: number, color: string, label?: string }) {
  const r = 44, cx = 56, cy = 58
  const circ = 2 * Math.PI * r
  const arc = circ * 0.75
  const dash = (pct / 100) * arc
  return (
    <svg width={112} height={88} viewBox="0 0 112 88">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={T.surf3} strokeWidth={10}
        strokeDasharray={`${arc} ${circ}`} strokeLinecap="round" transform={`rotate(135 ${cx} ${cy})`} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={10}
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" transform={`rotate(135 ${cx} ${cy})`}
        style={{ filter: `drop-shadow(0 0 7px ${color})` }} />
      <text x={cx} y={cy - 2} textAnchor="middle" fill={T.text} fontSize={20} fontWeight={800} fontFamily="Inter">{pct}%</text>
      <text x={cx} y={cy + 14} textAnchor="middle" fill={T.textSub} fontSize={8} fontFamily="JetBrains Mono" letterSpacing="2">{label}</text>
    </svg>
  )
}

// WebGL fallback
export function WebGLFallback() {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: T.canvas, color: T.textSub, gap: 12 }}>
      <div style={{ fontSize: 32 }}>⚠️</div>
      <div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>WebGL không được hỗ trợ</div>
      <div style={{ fontSize: 12, color: T.textSub, textAlign: 'center', maxWidth: 280 }}>Trình duyệt này không hỗ trợ WebGL. Vui lòng dùng Chrome, Firefox hoặc Edge phiên bản mới.</div>
    </div>
  )
}

// Screen selector bar
export function ScreenSelector({ cur, set }: { cur: AppScreen, set: (s: AppScreen) => void }) {
  return (
    <div style={{ position: 'fixed', top: 14, left: '50%', transform: 'translateX(-50%)', zIndex: 9999, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: 4, display: 'flex', gap: 2, boxShadow: '0 8px 32px rgba(0,0,0,0.7)' }}>
      {([
        ['dashboard', 'S1 · Dashboard'],
        ['builder',   'S2 · Builder'],
        ['mobile',    'S3 · In-Transit'],
        ['onboarding','S4 · FEFO Alerts'],
        ['batches',   'S5 · Batches'],
        ['inventory', 'S6 · Inventory'],
        ['scanner',   'PWA · Scanner'],
        ['account',   'VIP · RBAC'],
        ['settings',  'Cài đặt'],
      ] as [AppScreen, string][]).map(([id, label]) => (
        <button key={id} onClick={() => set(id)} style={{
          padding: '5px 12px', borderRadius: 7, border: 'none', cursor: 'pointer',
          fontSize: 11, fontWeight: 700, fontFamily: 'Inter, sans-serif',
          background: cur === id ? T.blue : 'transparent',
          color: cur === id ? '#fff' : T.textSub,
          transition: 'all 0.15s',
        }}>{label}</button>
      ))}
    </div>
  )
}

// Top bar shell (shared between S1/S5)
import {
  Search, Bell, Plus, QrCode, User, Map, Package,
  ArrowDownToLine, ArrowUpFromLine, Wrench, BarChart3, Settings, Box
} from 'lucide-react'

export const NAV_ITEMS = [
  { id: 'map',      icon: Map,             label: '3D Map' },
  { id: 'inv',      icon: Package,         label: 'Inventory' },
  { id: 'inbound',  icon: ArrowDownToLine, label: 'Inbound' },
  { id: 'outbound', icon: ArrowUpFromLine, label: 'Outbound' },
  { id: 'builder',  icon: Wrench,          label: '3D Builder' },
  { id: 'reports',  icon: BarChart3,       label: 'Reports' },
  { id: 'settings', icon: Settings,        label: 'Settings' },
]

export function TopBar({ onInbound, onScan, searchPlaceholder = 'Search SKU, Batch, Rack...' }: {
  onInbound?: () => void, onScan?: () => void, searchPlaceholder?: string
}) {
  return (
    <header style={{ height: 56, background: T.surface, borderBottom: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', padding: '0 20px', gap: 14, flexShrink: 0, zIndex: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 32, height: 32, background: `linear-gradient(135deg,${T.blue},${T.cyan})`, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Box size={16} color="#fff" strokeWidth={2.5} />
        </div>
        <span style={{ fontSize: 16, fontWeight: 800, color: T.text, letterSpacing: -0.3 }}>Look<span style={{ color: T.cyan }}>3D</span></span>
        <Tag label="LIVE" type="green" />
      </div>
      <div style={{ flex: 1, maxWidth: 420, display: 'flex', alignItems: 'center', gap: 8, background: T.canvas, border: `1px solid ${T.border}`, borderRadius: 7, padding: '0 12px', height: 34, marginLeft: 10 }}>
        <Search size={13} color={T.textMut} />
        <input placeholder={searchPlaceholder} style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: 13, color: T.text, fontFamily: 'Inter, sans-serif' }} />
        <MonoLabel>⌘K</MonoLabel>
      </div>
      <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
        <Btn variant="primary" size="sm" onClick={onInbound}><Plus size={13} />Inbound</Btn>
        <Btn variant="ghost"   size="sm"><ArrowUpFromLine size={13} />Outbound Pick</Btn>
        <Btn variant="cyan"    size="sm" onClick={onScan}><QrCode size={13} />Scan QR</Btn>
        <div style={{ width: 1, height: 24, background: T.border }} />
        <button style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', color: T.textSub, padding: 6, minWidth: 44, minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Bell size={18} />
          <span style={{ position: 'absolute', top: 6, right: 6, width: 7, height: 7, background: T.red, borderRadius: '50%', border: `2px solid ${T.surface}` }} />
        </button>
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: `linear-gradient(135deg,${T.blue},${T.cyan})`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', minWidth: 36 }}>
          <User size={15} color="#fff" />
        </div>
      </div>
    </header>
  )
}

export function IconSidebar({ activeId, onNav }: { activeId: string, onNav?: (id: string) => void }) {
  const [hovId, setHovId] = useState<string | null>(null)
  return (
    <aside style={{ width: 72, flexShrink: 0, background: T.surface, borderRight: `1px solid ${T.border}`, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '12px 0', gap: 4, position: 'relative', zIndex: 10 }}>
      <div style={{ width: 44, height: 44, background: `linear-gradient(135deg,${T.blue},${T.cyan})`, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14, boxShadow: `0 0 18px rgba(0,229,255,0.3)` }}>
        <Box size={22} color="#fff" strokeWidth={2.5} />
      </div>
      {NAV_ITEMS.map(n => (
        <div key={n.id} style={{ position: 'relative' }}
          onMouseEnter={() => setHovId(n.id)} onMouseLeave={() => setHovId(null)}>
          <button
            onClick={() => onNav?.(n.id)}
            title={n.label}
            style={{
              width: 48, height: 48, borderRadius: 10, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: activeId === n.id ? 'rgba(0,102,255,0.28)' : hovId === n.id ? T.surf2 : 'transparent',
              color: activeId === n.id ? T.cyan : T.textMut,
              boxShadow: activeId === n.id ? `inset 0 0 0 1.5px rgba(0,229,255,0.35)` : 'none',
              transition: 'all 0.15s',
            }}>
            <n.icon size={20} strokeWidth={1.75} />
          </button>
          {hovId === n.id && (
            <div style={{ position: 'absolute', left: 56, top: '50%', transform: 'translateY(-50%)', background: T.surf3, border: `1px solid ${T.border}`, borderRadius: 6, padding: '4px 10px', fontSize: 11, fontWeight: 600, color: T.text, whiteSpace: 'nowrap', boxShadow: '0 4px 12px rgba(0,0,0,0.5)', pointerEvents: 'none', zIndex: 100 }}>
              {n.label}
            </div>
          )}
        </div>
      ))}
    </aside>
  )
}

// ─── Batch data ───────────────────────────────────────────────────────────────
export const BATCHES: BatchRow[] = [
  { sku: 'Paracetamol 500mg', batchId: 'BAT-2026-09A', expiry: '15/11/2026', qty: 240, location: 'A1-L2-B03', daysLeft: 53,  status: 'critical' },
  { sku: 'Amoxicillin 250mg', batchId: 'BAT-2026-07C', expiry: '28/12/2026', qty: 180, location: 'A1-L2-B04', daysLeft: 96,  status: 'warn' },
  { sku: 'Vitamin C 1000mg',  batchId: 'BAT-2026-08B', expiry: '05/03/2027', qty: 320, location: 'B2-L3-B01', daysLeft: 163, status: 'ok' },
  { sku: 'Omeprazole 20mg',   batchId: 'BAT-2026-06D', expiry: '20/04/2027', qty: 140, location: 'B1-L1-B06', daysLeft: 209, status: 'ok' },
  { sku: 'Cetirizine 10mg',   batchId: 'BAT-2025-12E', expiry: '01/09/2026', qty: 60,  location: 'C2-L2-B02', daysLeft: -23, status: 'expired' },
  { sku: 'Ibuprofen 400mg',   batchId: 'BAT-2026-05F', expiry: '10/11/2026', qty: 120, location: 'A2-L1-B01', daysLeft: 48,  status: 'critical' },
  { sku: 'Metformin 500mg',   batchId: 'BAT-2026-08G', expiry: '22/02/2027', qty: 280, location: 'B1-L2-B03', daysLeft: 151, status: 'ok' },
  { sku: 'Atorvastatin 20mg', batchId: 'BAT-2026-07H', expiry: '18/07/2027', qty: 100, location: 'C1-L1-B05', daysLeft: 297, status: 'ok' },
  { sku: 'Clarithromycin',    batchId: 'BAT-2025-11I', expiry: '03/09/2026', qty: 40,  location: 'A2-L3-B02', daysLeft: -21, status: 'expired' },
  { sku: 'Amlodipine 5mg',    batchId: 'BAT-2026-09J', expiry: '30/12/2026', qty: 200, location: 'B2-L1-B04', daysLeft: 98,  status: 'warn' },
]
