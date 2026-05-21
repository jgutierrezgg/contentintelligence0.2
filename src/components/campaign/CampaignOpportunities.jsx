import { useState } from 'react'
import { C } from '../../constants/colors'
import AutoProcess from '../primitives/AutoProcess'
import Btn from '../primitives/Btn'
import Tag from '../primitives/Tag'
import { PhaseHeader, ApprovalGate } from './CampaignResearch'

const ANALYSIS_STEPS = [
  'Crossing GA + Search Console data with SEMrush…',
  'Identifying content gaps vs competitors…',
  'Running AI opportunity classification…',
  'Scoring opportunities by impact…',
]

const WORKFLOW_COLORS = {
  Create: C.green,
  Optimize: C.blue,
  Convert: C.orange,
  Delete: C.red,
}

const MOCK_OPPORTUNITIES = [
  { id: 1, title: 'Ultimate Guide to Content Strategy', workflow: 'Create', volume: 8400, score: 94 },
  { id: 2, title: 'How to Improve Organic Rankings', workflow: 'Optimize', volume: 5200, score: 88 },
  { id: 3, title: 'Product Comparison Page', workflow: 'Convert', volume: 3100, score: 76 },
  { id: 4, title: '2021 Marketing Trends (Outdated)', workflow: 'Delete', volume: 210, score: 12 },
  { id: 5, title: 'Email Marketing Best Practices', workflow: 'Create', volume: 6700, score: 91 },
  { id: 6, title: 'Landing Page Optimization Tips', workflow: 'Optimize', volume: 4400, score: 83 },
]

export default function CampaignOpportunities({ onApprove }) {
  const [analysisDone, setAnalysisDone] = useState(false)
  const [items, setItems] = useState(MOCK_OPPORTUNITIES)
  const [approved, setApproved] = useState(false)

  const dismiss = (id) => setItems(items.filter(i => i.id !== id))

  if (approved) {
    return (
      <div style={{ color: C.green, fontWeight: 600, padding: 16 }}>
        ✓ Opportunities approved — proceeding to Content Plan.
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <PhaseHeader
        icon="🟢"
        title="Opportunity Analysis"
        subtitle="AI-generated content opportunities classified by workflow type."
      />

      {!analysisDone ? (
        <AutoProcess steps={ANALYSIS_STEPS} onComplete={() => setAnalysisDone(true)} />
      ) : (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {items.map(opp => {
              const color = WORKFLOW_COLORS[opp.workflow]
              return (
                <div
                  key={opp.id}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '12px 14px', borderRadius: 8,
                    background: C.surfaceHigh, border: `1px solid ${C.border}`,
                  }}
                >
                  <Tag color={color} bg={`${color}15`} style={{ width: 68, justifyContent: 'center' }}>
                    {opp.workflow}
                  </Tag>
                  <div style={{ flex: 1, fontSize: 13 }}>{opp.title}</div>
                  <div style={{ fontSize: 12, color: C.textMuted, width: 90, textAlign: 'right' }}>
                    {opp.volume.toLocaleString()} vol
                  </div>
                  <div style={{
                    width: 38, height: 38, borderRadius: '50%',
                    background: `conic-gradient(${color} ${opp.score}%, ${C.border} 0)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 10, fontWeight: 700, color: C.text,
                    position: 'relative',
                  }}>
                    <div style={{
                      position: 'absolute', inset: 4, borderRadius: '50%',
                      background: C.surfaceHigh, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 10, fontWeight: 700,
                    }}>
                      {opp.score}
                    </div>
                  </div>
                  <Btn variant="ghost" size="sm" onClick={() => dismiss(opp.id)}
                    style={{ color: C.textMuted, padding: '4px 6px' }}>
                    ✕
                  </Btn>
                </div>
              )
            })}
          </div>

          <ApprovalGate
            label={`Approve ${items.length} opportunities to generate Content Plan`}
            onApprove={() => { setApproved(true); onApprove?.() }}
          />
        </>
      )}
    </div>
  )
}
