import styles from './AppShell.module.css'
import Sidebar from './Sidebar'

export default function AppShell({ view, onNavigate, workspaces, activeWsId, onSelectWorkspace, onAddWorkspace, children }) {
  return (
    <div className={styles.shell}>
      <Sidebar
        view={view}
        onNavigate={onNavigate}
        workspaces={workspaces}
        activeWsId={activeWsId}
        onSelectWorkspace={onSelectWorkspace}
        onAddWorkspace={onAddWorkspace}
      />
      <main className={styles.main}>
        {children}
      </main>
    </div>
  )
}
