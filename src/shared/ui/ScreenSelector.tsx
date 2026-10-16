import type { AppScreen } from '../types'
import { T } from '../tokens'

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
