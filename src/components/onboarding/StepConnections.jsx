import { useState } from 'react'
import styles from './onboarding.module.css'
import Card from '../primitives/Card'
import Btn from '../primitives/Btn'

const CONNECTIONS = [
  { id: 'ga',      name: 'Google Analytics',     icon: '📊', desc: 'Traffic and behavior data across all brands' },
  { id: 'gsc',     name: 'Google Search Console', icon: '🔍', desc: 'Organic search performance and keyword data' },
  { id: 'semrush', name: 'SEMrush',               icon: '📈', desc: 'Competitor analysis and keyword research' },
]

export default function StepConnections({ onNext }) {
  const [connected, setConnected] = useState({})

  const toggle = (id) => setConnected(c => ({ ...c, [id]: !c[id] }))
  const allConnected = CONNECTIONS.every(c => connected[c.id])

  return (
    <div className={styles.containerMd}>
      <h2 className={styles.heading}>Connect your data sources</h2>
      <p className={styles.lead}>All three connections are required to power research and tracking.</p>

      <div className={styles.connList}>
        {CONNECTIONS.map(conn => {
          const isConnected = connected[conn.id]
          return (
            <Card key={conn.id} className={styles.connCard}>
              <span className={styles.connIcon}>{conn.icon}</span>
              <div className={styles.connBody}>
                <div className={styles.connName}>{conn.name}</div>
                <div className={styles.connDesc}>{conn.desc}</div>
              </div>
              <Btn
                variant={isConnected ? 'secondary' : 'primary'}
                size="sm"
                onClick={() => toggle(conn.id)}
              >
                {isConnected ? '✓ Connected' : 'Connect'}
              </Btn>
            </Card>
          )
        })}
      </div>

      <Btn onClick={() => onNext(connected)} disabled={!allConnected}>Enter platform →</Btn>
      {!allConnected && (
        <p className={styles.connWarning}>All three connections are required to continue.</p>
      )}
    </div>
  )
}
