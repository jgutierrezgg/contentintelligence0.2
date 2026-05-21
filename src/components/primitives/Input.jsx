import { C } from '../../constants/colors'

export default function Input({ value, onChange, placeholder, type = 'text', style }) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        background: C.surfaceHigh,
        border: `1px solid ${C.border}`,
        borderRadius: 8,
        padding: '10px 14px',
        color: C.text,
        fontSize: 14,
        fontFamily: 'inherit',
        outline: 'none',
        width: '100%',
        transition: 'border-color 0.15s',
        ...style,
      }}
      onFocus={e => e.target.style.borderColor = C.accent}
      onBlur={e => e.target.style.borderColor = C.border}
    />
  )
}
