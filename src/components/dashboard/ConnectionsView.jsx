import styles from './dashboard.module.css'
import Card from '../primitives/Card'
import Btn from '../primitives/Btn'

const CONNECTIONS = [
  { id: 'ga',      name: 'Google Analytics',     icon: '📊', desc: 'Traffic and behavior data across all brands',             note: 'Workspace-level — shared across all campaigns' },
  { id: 'gsc',     name: 'Google Search Console', icon: '🔍', desc: 'Organic search performance and keyword data',             note: 'Workspace-level — shared across all campaigns' },
  { id: 'semrush', name: 'SEMrush',               icon: '📈', desc: 'Competitor analysis, keyword research, and site crawl',  note: 'Workspace-level — shared across all campaigns' },
]

export default function ConnectionsView({ connections, onToggle }) {
  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Connections</h1>
          <p className={styles.pageSubtitle}>
            Data source connections are workspace-level and apply to all brands and campaigns.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {CONNECTIONS.map(conn => {
          const isConnected = connections[conn.id]
          return (
            <Card key={conn.id} className={styles.connRow}>
              <span className={styles.connIcon}>{conn.icon}</span>
              <div className={styles.connBody}>
                <div className={styles.connName}>{conn.name}</div>
                <div className={styles.connDesc}>{conn.desc}</div>
                <div className={styles.connNote}>{conn.note}</div>
              </div>
              <div className={styles.connActions}>
                {isConnected && <div className={styles.connStatus}>● Connected</div>}
                <Btn variant={isConnected ? 'secondary' : 'primary'} size="sm" onClick={() => onToggle(conn.id)}>
                  {isConnected ? 'Disconnect' : 'Connect'}
                </Btn>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
