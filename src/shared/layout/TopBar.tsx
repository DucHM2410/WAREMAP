import {
  Search, Bell, Plus, QrCode, User, Box, ArrowUpFromLine
} from 'lucide-react'
import { T } from '../tokens'
import { Btn } from '../ui/Btn'
import { MonoLabel } from '../ui/MonoLabel'
import { Tag } from '../ui/Tag'

// Top bar shell (shared between S1/S5)
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
