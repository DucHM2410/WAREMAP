import { T } from '../tokens'

export function MonoLabel({ children, color, size = 11 }: { children: React.ReactNode, color?: string, size?: number }) {
  return (
    <span style={{ fontFamily: T.mono, fontSize: size, color: color ?? T.textSub, letterSpacing: '0.04em' }}>
      {children}
    </span>
  )
}
