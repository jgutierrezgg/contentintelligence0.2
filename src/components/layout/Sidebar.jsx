import { C } from '../../constants/colors'

const NAV = [
  { id: 'campaigns', label: 'Campaigns', icon: '◈' },
  { id: 'brands', label: 'Brands', icon: '◉' },
  { id: 'connections', label: 'Connections', icon: '⬡' },
]

export default function Sidebar({ view, onNavigate }) {
  return (
    <div style={{
      width: 220, flexShrink: 0,
      background: C.surface,
      borderRight: `1px solid ${C.border}`,
      display: 'flex', flexDirection: 'column',
      padding: '24px 0',
    }}>
      <div style={{ padding: '0 20px 24px' }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: C.text }}>Content Intelligence</div>
        <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>by Marketfully</div>
      </div>

      <nav style={{ flex: 1 }}>
        {NAV.map(item => {
          const active = view === item.id
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                width: '100%', padding: '10px 20px',
                background: active ? C.accentGlow : 'transparent',
                borderLeft: `2px solid ${active ? C.accent : 'transparent'}`,
                border: 'none', borderLeftStyle: 'solid',
                color: active ? C.accent : C.textMuted,
                fontSize: 14, fontWeight: active ? 600 : 400,
                cursor: 'pointer', fontFamily: 'inherit',
                transition: 'all 0.15s',
              }}
            >
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              {item.label}
            </button>
          )
        })}
      </nav>
    </div>
  )
}
