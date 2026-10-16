import { T } from '../tokens'

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
