import { useState } from 'react'
import { C } from '../../constants/colors'
import AutoProcess from '../primitives/AutoProcess'
import Btn from '../primitives/Btn'
import Card from '../primitives/Card'
import Tag from '../primitives/Tag'

const RESEARCH_STEPS = [
  'Crawling brand site via SEMrush…',
  'Analyzing competitor sites…',
  'Fetching traffic data from Google Analytics…',
  'Fetching organic performance from Search Console…',
  'Mapping topics and content opportunities…',
  'Building site architecture map…',
]

const MOCK_TOPICS = ['SEO Strategy', 'Content Marketing', 'Lead Generation', 'Email Automation', 'Analytics', 'Social Media']
const MOCK_PAGES = [
  { type: 'Category', path: '/blog', count: 48 },
  { type: 'PLP', path: '/products', count: 12 },
  { type: 'PDP', path: '/products/*', count: 87 },
  { type: 'Landing', path: '/solutions/*', count: 9 },
]

export default function CampaignResearch({ onApprove }) {
  const [researchDone, setResearchDone] = useState(false)
  const [approved, setApproved] = useState(false)

  if (approved) {
    return (
      <div style={{ color: C.green, fontWeight: 600, padding: 16 }}>
        ✓ Research approved — proceeding to Opportunity Analysis.
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <PhaseHeader
        icon="🟢"
        title="Research"
        subtitle="Automated data collection across your brand, competitors, and connected sources."
      />

      {!researchDone ? (
        <AutoProcess steps={RESEARCH_STEPS} onComplete={() => setResearchDone(true)} />
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <Card>
              <SectionTitle>Topic Map</SectionTitle>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
                {MOCK_TOPICS.map(t => <Tag key={t} color={C.green} bg={`${C.green}15`}>{t}</Tag>)}
              </div>
            </Card>
            <Card>
              <SectionTitle>Site Architecture</SectionTitle>
              <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {MOCK_PAGES.map(p => (
                  <div key={p.path} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                    <span style={{ color: C.textMuted }}><Tag>{p.type}</Tag> {p.path}</span>
                    <span style={{ color: C.text }}>{p.count}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <ApprovalGate
            label="Approve topic map and site architecture to proceed to Opportunity Analysis"
            onApprove={() => { setApproved(true); onApprove?.() }}
          />
        </>
      )}
    </div>
  )
}

export function PhaseHeader({ icon, title, subtitle }) {
  return (
    <div style={{ marginBottom: 4 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <span>{icon}</span>
        <h2 style={{ fontSize: 18, fontWeight: 700 }}>{title}</h2>
      </div>
      <p style={{ color: C.textMuted, fontSize: 13 }}>{subtitle}</p>
    </div>
  )
}

export function ApprovalGate({ label, onApprove }) {
  return (
    <div style={{
      padding: 16, borderRadius: 10,
      background: `${C.blue}0f`, border: `1px solid ${C.blue}33`,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
    }}>
      <span style={{ fontSize: 13, color: C.text }}>🔵 {label}</span>
      <Btn variant="primary" onClick={onApprove} style={{ flexShrink: 0 }}>Approve →</Btn>
    </div>
  )
}

function SectionTitle({ children }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 600, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
      {children}
    </div>
  )
}
