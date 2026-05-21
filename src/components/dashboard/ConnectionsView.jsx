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
    note: 'Workspace-level — shared across all campaigns',
  },
  {
    id: 'gsc',
    name: 'Google Search Console',
    icon: '🔍',
    desc: 'Organic search performance and keyword data',
    note: 'Workspace-level — shared across all campaigns',
  },
  {
    id: 'semrush',
    name: 'SEMrush',
    icon: '📈',
    desc: 'Competitor analysis, keyword research, and site crawl',
    note: 'Workspace-level — shared across all campaigns',
  },
]

export default function ConnectionsView({ connections, onToggle }) {
  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700 }}>Connections</h1>
        <p style={{ color: C.textMuted, marginTop: 4, fontSize: 14 }}>
          Data source connections are workspace-level and apply to all brands and campaigns.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {CONNECTIONS.map(conn => {
          const isConnected = connections[conn.id]
          return (
            <Card key={conn.id} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{ fontSize: 32 }}>{conn.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, marginBottom: 3 }}>{conn.name}</div>
                <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 2 }}>{conn.desc}</div>
                <div style={{ fontSize: 11, color: C.textDim }}>{conn.note}</div>
              </div>
              <div style={{ display: 'flex', flex: 'column', gap: 8, alignItems: 'flex-end' }}>
                {isConnected && (
                  <div style={{ fontSize: 11, color: C.green, marginBottom: 6, textAlign: 'right' }}>
                    ● Connected
                  </div>
                )}
                <Btn
                  variant={isConnected ? 'secondary' : 'primary'}
                  size="sm"
                  onClick={() => onToggle(conn.id)}
                >
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
