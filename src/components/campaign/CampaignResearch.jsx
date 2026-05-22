import { useState } from 'react'
import styles from './campaign.module.css'
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
  { type: 'Category', path: '/blog',        count: 48 },
  { type: 'PLP',      path: '/products',    count: 12 },
  { type: 'PDP',      path: '/products/*',  count: 87 },
  { type: 'Landing',  path: '/solutions/*', count:  9 },
]

export default function CampaignResearch({ onApprove, isProcessed, onProcessed, canAdvance, onRerun }) {
  // Start as done if already processed — never re-run the animation automatically
  const [done, setDone] = useState(isProcessed)

  const handleComplete = () => {
    setDone(true)
    onProcessed()
  }

  return (
    <div className={styles.phaseStack}>
      <PhaseHeader
        icon="🟢"
        title="Research"
        subtitle="Automated data collection across your brand, competitors, and connected sources."
        onRerun={done && !canAdvance ? onRerun : undefined}
      />

      {!done ? (
        <AutoProcess steps={RESEARCH_STEPS} onComplete={handleComplete} />
      ) : (
        <>
          <div className={styles.twoCol}>
            <Card>
              <div className={styles.sectionTitle}>Topic Map</div>
              <div className={styles.topicTags}>
                {MOCK_TOPICS.map(t => <Tag key={t} variant="green">{t}</Tag>)}
              </div>
            </Card>
            <Card>
              <div className={styles.sectionTitle}>Site Architecture</div>
              <div className={styles.archList}>
                {MOCK_PAGES.map(p => (
                  <div key={p.path} className={styles.archRow}>
                    <span className={styles.archPath}><Tag>{p.type}</Tag> {p.path}</span>
                    <span className={styles.archCount}>{p.count}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {canAdvance
            ? <ApprovalGate label="Approve topic map and site architecture to proceed to Opportunity Analysis" onApprove={onApprove} />
            : <RerunBar onRerun={onRerun} />
          }
        </>
      )}
    </div>
  )
}

export function PhaseHeader({ icon, title, subtitle }) {
  return (
    <div className={styles.phaseHeaderWrap}>
      <div className={styles.phaseHeaderRow}>
        <span>{icon}</span>
        <h2 className={styles.phaseTitle}>{title}</h2>
      </div>
      <p className={styles.phaseSubtitle}>{subtitle}</p>
    </div>
  )
}

export function ApprovalGate({ label, onApprove }) {
  return (
    <div className={styles.gate}>
      <span className={styles.gateLabel}>🔵 {label}</span>
      <Btn onClick={onApprove} style={{ flexShrink: 0 }}>Approve →</Btn>
    </div>
  )
}

export function RerunBar({ onRerun }) {
  return (
    <div className={styles.rerunBar}>
      <span className={styles.rerunNote}>This step has already been completed.</span>
      <Btn variant="ghost" size="sm" onClick={onRerun}>↺ Re-run step</Btn>
    </div>
  )
}
