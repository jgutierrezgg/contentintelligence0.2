import { C } from '../../constants/colors'
import Tag from '../primitives/Tag'
import { PhaseHeader } from './CampaignResearch'

const METRICS = [
  { label: 'Organic Traffic', value: '12,480', delta: '+18%', color: C.green },
  { label: 'Keyword Rankings', value: '284', delta: '+47', color: C.blue },
  { label: 'Leads Generated', value: '163', delta: '+23%', color: C.orange },
  { label: 'Avg. Position', value: '8.4', delta: '↓2.1', color: C.accentSoft },
]

const CONTENT_ITEMS = [
  { title: 'Ultimate Guide to Content Strategy', status: 'Published' },
  { title: 'Email Marketing Best Practices', status: 'In Progress' },
  { title: 'How to Improve Organic Rankings', status: 'In Progress' },
  { title: 'Landing Page Optimization Tips', status: 'Pending' },
  { title: 'Product Comparison Page', status: 'Pending' },
]

const STATUS_COLORS = {
  Published: C.green,
  'In Progress': C.blue,
  Pending: C.textMuted,
}

export default function CampaignTracking() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <PhaseHeader
        icon="🟢"
        title="Tracking"
        subtitle="Real-time performance metrics and content execution status."
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {METRICS.map(m => (
          <div key={m.label} style={{
            padding: 16, borderRadius: 10,
            background: C.surface, border: `1px solid ${C.border}`,
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: m.color }}>{m.value}</div>
            <div style={{ fontSize: 11, color: C.textMuted, margin: '4px 0' }}>{m.label}</div>
            <div style={{ fontSize: 12, color: m.color }}>{m.delta}</div>
          </div>
        ))}
      </div>

      <div>
        <div style={{
          fontSize: 11, fontWeight: 600, color: C.textMuted,
          textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12,
        }}>
          Content Status
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {CONTENT_ITEMS.map(item => {
            const color = STATUS_COLORS[item.status]
            const progress = item.status === 'Published' ? 100 : item.status === 'In Progress' ? 55 : 0
            return (
              <div key={item.title} style={{
                padding: '12px 14px', borderRadius: 8,
                background: C.surfaceHigh, border: `1px solid ${C.border}`,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontSize: 13 }}>{item.title}</span>
                  <Tag color={color} bg={`${color}15`}>{item.status}</Tag>
                </div>
                <div style={{ height: 3, borderRadius: 2, background: C.border, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', width: `${progress}%`,
                    background: color, borderRadius: 2,
                    transition: 'width 0.5s',
                  }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
