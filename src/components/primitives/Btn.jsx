import styles from './Btn.module.css'

export default function Btn({ children, onClick, variant = 'primary', disabled, size = 'md', className = '' }) {
  const cls = [
    styles.btn,
    styles[variant],
    size === 'sm' ? styles.sm : '',
    className,
  ].filter(Boolean).join(' ')

  return (
    <button className={cls} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  )
}
