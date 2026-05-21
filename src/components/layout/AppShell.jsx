import { C } from '../../constants/colors'
import Sidebar from './Sidebar'

export default function AppShell({ view, onNavigate, children }) {
  return (
    <div style={{ display: 'flex', height: '100vh', background: C.bg, overflow: 'hidden' }}>
      <Sidebar view={view} onNavigate={onNavigate} />
      <main style={{ flex: 1, overflow: 'auto', padding: 32 }}>
        {children}
      </main>
    </div>
  )
}
