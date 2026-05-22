import { useState } from 'react'
import styles from './campaign.module.css'
import AutoProcess from '../primitives/AutoProcess'
import Btn from '../primitives/Btn'
import Tag from '../primitives/Tag'
import { PhaseHeader, ApprovalGate, RerunBar } from './CampaignResearch'

const ANALYSIS_STEPS = [
  'Crossing GA + Search Console data with SEMrush…',
  'Identifying content gaps vs competitors…',
  'Running AI opportunity classification…',
  'Scoring opportunities by impact…',
]

const WORKFLOW_VARIANT = { Create: 'green', Optimize: 'blue', Convert: 'orange', Delete: 'red' }

const WORKFLOW_COLOR = {
  Create:   'var(--color-green)',
  Optimize: 'var(--color-blue)',
  Convert:  'var(--color-orange)',
  Delete:   'var(--color-red)',
}

const MOCK_OPPORTUNITIES = [
  { id: 1, title: 'Ultimate Guide to Content Strategy',  workflow: 'Create',   volume: 8400, score: 94 },
  { id: 2, title: 'How to Improve Organic Rankings',     workflow: 'Optimize', volume: 5200, score: 88 },
  { id: 3, title: 'Product Comparison Page',             workflow: 'Convert',  volume: 3100, score: 76 },
  { id: 4, title: '2021 Marketing Trends (Outdated)',    workflow: 'Delete',   volume:  210, score: 12 },
  { id: 5, title: 'Email Marketing Best Practices',      workflow: 'Create',   volume: 6700, score: 91 },
  { id: 6, title: 'Landing Page Optimization Tips',      workflow: 'Optimize', volume: 4400, score: 83 },
]

export default function CampaignAnalysis({ onApprove, isProcessed, onProcessed, canAdvance, onRerun }) {
  const [done, setDone]   = useState(isProcessed)
  const [items, setItems] = useState(MOCK_OPPORTUNITIES)

  const handleComplete = () => {
    setDone(true)
    onProcessed()
  }

  const dismiss = (id) => setItems(items.filter(i => i.id !== id))

  return (
    <div className={styles.phaseStack}>
      <PhaseHeader
        icon="🟢"
        title="Analysis"
        subtitle="AI-generated content opportunities classified by workflow type."
      />

      {!done ? (
        <AutoProcess steps={ANALYSIS_STEPS} onComplete={handleComplete} />
      ) : (
        <>
          <div className={styles.oppList}>
            {items.map(opp => (
              <div key={opp.id} className={styles.oppRow}>
                <Tag variant={WORKFLOW_VARIANT[opp.workflow]} style={{ width: 68, justifyContent: 'center' }}>
                  {opp.workflow}
                </Tag>
                <div className={styles.oppTitle}>{opp.title}</div>
                <div className={styles.oppVol}>{opp.volume.toLocaleString()} vol</div>
                <div
                  className={styles.scoreRing}
                  style={{ background: `conic-gradient(${WORKFLOW_COLOR[opp.workflow]} ${opp.score}%, var(--color-border) 0)` }}
                >
                  <div className={styles.scoreInner}>{opp.score}</div>
                </div>
                <Btn variant="ghost" size="sm" onClick={() => dismiss(opp.id)} style={{ padding: '4px 6px' }}>✕</Btn>
              </div>
            ))}
          </div>

          {canAdvance
            ? <ApprovalGate label={`Approve ${items.length} opportunities to generate Content Plan`} onApprove={onApprove} />
            : <RerunBar onRerun={onRerun} />
          }
        </>
      )}
    </div>
  )
}
