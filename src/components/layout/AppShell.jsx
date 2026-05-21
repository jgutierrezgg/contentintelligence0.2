import styles from './AppShell.module.css'
import Sidebar from './Sidebar'

export default function AppShell({ view, onNavigate, children }) {
  return (
    <div className={styles.shell}>
      <Sidebar view={view} onNavigate={onNavigate} />
      <main className={styles.main}>
        {children}
      </main>
    </div>
  )
}
