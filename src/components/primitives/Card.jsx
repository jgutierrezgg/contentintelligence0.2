import { C } from '../../constants/colors'

export default function Card({ children, style, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: 12,
        padding: 20,
        cursor: onClick ? 'pointer' : 'default',
        transition: onClick ? 'border-color 0.15s' : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  )
}
