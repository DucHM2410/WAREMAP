import { useState } from 'react'
import { T } from '../tokens'

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
