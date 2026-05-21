import styles from './Tag.module.css'

export default function Tag({ children, variant = 'default', onClick, className = '' }) {
  const cls = [
    styles.tag,
    variant !== 'default' ? styles[variant] : '',
    onClick ? styles.clickable : '',
    className,
  ].filter(Boolean).join(' ')

  return (
    <span className={cls} onClick={onClick}>
      {children}
    </span>
  )
}
