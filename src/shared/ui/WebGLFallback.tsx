import { T } from '../tokens'

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
