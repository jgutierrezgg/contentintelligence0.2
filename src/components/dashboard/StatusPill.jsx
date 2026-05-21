import styles from './dashboard.module.css'

const VARIANT = {
  Setup:     'setup',
  Active:    'active',
  Completed: 'completed',
}

export default function StatusPill({ status }) {
  const variant = VARIANT[status] ?? ''
  return (
    <span className={[styles.pill, variant ? styles[variant] : ''].filter(Boolean).join(' ')}>
      {status}
    </span>
  )
}
