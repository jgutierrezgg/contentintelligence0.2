import styles from './Sidebar.module.css'

const NAV = [
  { id: 'campaigns', label: 'Campaigns', icon: '◈' },
  { id: 'brands',    label: 'Brands',    icon: '◉' },
  { id: 'connections', label: 'Connections', icon: '⬡' },
]

export default function Sidebar({ view, onNavigate }) {
  return (
    <div className={styles.sidebar}>
      <div className={styles.logo}>
        <div className={styles.logoName}>Content Intelligence</div>
        <div className={styles.logoSub}>by Marketfully</div>
      </div>

      <nav className={styles.nav}>
        {NAV.map(item => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={[styles.navItem, view === item.id ? styles.active : ''].filter(Boolean).join(' ')}
          >
            <span className={styles.navIcon}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  )
}
