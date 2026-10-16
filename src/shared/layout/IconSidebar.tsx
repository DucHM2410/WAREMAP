import { useState } from 'react'
import {
  Map, Package, ArrowDownToLine, ArrowUpFromLine, Wrench, BarChart3, Settings, Box
} from 'lucide-react'
import { T } from '../tokens'

export const NAV_ITEMS = [
  { id: 'map',      icon: Map,             label: '3D Map' },
  { id: 'inv',      icon: Package,         label: 'Inventory' },
  { id: 'inbound',  icon: ArrowDownToLine, label: 'Inbound' },
  { id: 'outbound', icon: ArrowUpFromLine, label: 'Outbound' },
  { id: 'builder',  icon: Wrench,          label: '3D Builder' },
  { id: 'reports',  icon: BarChart3,       label: 'Reports' },
  { id: 'settings', icon: Settings,        label: 'Settings' },
]

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
