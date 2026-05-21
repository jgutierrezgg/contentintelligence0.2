import { C } from '../../constants/colors'

export default function Tag({ children, color, bg, style }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '2px 8px', borderRadius: 20,
      fontSize: 11, fontWeight: 600, letterSpacing: '0.04em',
      color: color ?? C.textMuted,
      background: bg ?? C.surfaceHigh,
      border: `1px solid ${C.border}`,
      ...style,
    }}>
      {children}
    </span>
  )
}
