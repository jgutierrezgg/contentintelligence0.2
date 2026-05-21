import { useState } from 'react'
import { C } from '../../constants/colors'
import Card from '../primitives/Card'
import Btn from '../primitives/Btn'

const CONNECTIONS = [
  {
    id: 'ga',
    name: 'Google Analytics',
    icon: '📊',
    desc: 'Traffic and behavior data across all brands',
  },
  {
    id: 'gsc',
    name: 'Google Search Console',
    icon: '🔍',
    desc: 'Organic search performance and keyword data',
  },
  {
    id: 'semrush',
    name: 'SEMrush',
    icon: '📈',
    desc: 'Competitor analysis and keyword research',
  },
]

export default function StepConnections({ onNext }) {
  const [connected, setConnected] = useState({})

  const toggle = (id) => setConnected(c => ({ ...c, [id]: !c[id] }))
  const allConnected = CONNECTIONS.every(c => connected[c.id])

  return (
    <div style={{ maxWidth: 520, margin: '0 auto' }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Connect your data sources</h2>
      <p style={{ color: C.textMuted, marginBottom: 32 }}>
        All three connections are required to power research and tracking.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
        {CONNECTIONS.map(conn => {
          const isConnected = connected[conn.id]
          return (
            <Card key={conn.id} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{ fontSize: 28 }}>{conn.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, marginBottom: 2 }}>{conn.name}</div>
                <div style={{ fontSize: 12, color: C.textMuted }}>{conn.desc}</div>
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

      <Btn onClick={onNext} disabled={!allConnected}>
        Enter platform →
      </Btn>
      {!allConnected && (
        <p style={{ marginTop: 10, fontSize: 12, color: C.textMuted }}>
          All three connections are required to continue.
        </p>
      )}
    </div>
  )
}
