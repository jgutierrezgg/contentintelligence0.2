import { C } from '../../constants/colors'

export default function Btn({ children, onClick, variant = 'primary', disabled, style, size = 'md' }) {
  const pad = size === 'sm' ? '6px 14px' : '10px 22px'
  const fs = size === 'sm' ? 13 : 14

  const variants = {
    primary: {
      background: C.accent,
      color: '#fff',
      border: 'none',
    },
    secondary: {
      background: 'transparent',
      color: C.text,
      border: `1px solid ${C.border}`,
    },
    ghost: {
      background: 'transparent',
      color: C.textMuted,
      border: 'none',
    },
    danger: {
      background: 'transparent',
      color: C.red,
      border: `1px solid ${C.red}33`,
    },
    green: {
      background: C.green,
      color: '#000',
      border: 'none',
    },
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        padding: pad, borderRadius: 8, fontSize: fs, fontWeight: 600,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.45 : 1,
        fontFamily: 'inherit',
        transition: 'opacity 0.15s',
        ...variants[variant],
        ...style,
      }}
    >
      {children}
    </button>
  )
}
