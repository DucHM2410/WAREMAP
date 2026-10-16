import { T } from '../tokens'

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
