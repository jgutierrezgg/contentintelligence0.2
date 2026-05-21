import { useState } from 'react'
import styles from './Sidebar.module.css'

const NAV = [
  { id: 'campaigns',   label: 'Campaigns',   icon: '◈' },
  { id: 'brands',      label: 'Brands',      icon: '◉' },
  { id: 'connections', label: 'Connections', icon: '⬡' },
]

export default function Sidebar({ view, onNavigate, workspaces, activeWsId, onSelectWorkspace, onAddWorkspace }) {
  const [wsOpen, setWsOpen] = useState(false)
  const activeWs = workspaces?.find(w => w.id === activeWsId)

  return (
    <div className={styles.sidebar}>
      <div className={styles.logo}>
        <div className={styles.logoName}>Content Intelligence</div>
        <div className={styles.logoSub}>by Marketfully</div>
      </div>

      <div className={styles.wsSwitcher}>
        <button className={styles.wsButton} onClick={() => setWsOpen(o => !o)}>
          <span className={styles.wsAvatar}>{activeWs?.name?.[0] ?? '?'}</span>
          <span className={styles.wsName}>{activeWs?.name ?? 'Workspace'}</span>
          <span className={styles.wsChevron}>{wsOpen ? '▲' : '▼'}</span>
        </button>

        {wsOpen && (
          <div className={styles.wsDropdown}>
            {workspaces?.map(ws => (
              <button
                key={ws.id}
                className={[styles.wsItem, ws.id === activeWsId ? styles.wsItemActive : ''].filter(Boolean).join(' ')}
                onClick={() => { onSelectWorkspace(ws.id); setWsOpen(false) }}
              >
                <span className={styles.wsItemAvatar}>{ws.name[0]}</span>
                <span className={styles.wsItemName}>{ws.name}</span>
                {ws.id === activeWsId && <span className={styles.wsCheck}>✓</span>}
              </button>
            ))}
            <button
              className={styles.wsAddBtn}
              onClick={() => { onAddWorkspace(); setWsOpen(false) }}
            >
              + New workspace
            </button>
          </div>
        )}
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
