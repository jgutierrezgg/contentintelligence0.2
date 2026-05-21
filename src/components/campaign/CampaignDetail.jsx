import { useState } from 'react'
import styles from './campaign.module.css'
import { PIPELINE_STEPS } from '../../constants/campaign'
import Btn from '../primitives/Btn'
import Tag from '../primitives/Tag'
import CampaignResearch from './CampaignResearch'
import CampaignOpportunities from './CampaignOpportunities'
import CampaignContentPlan from './CampaignContentPlan'
import CampaignTracking from './CampaignTracking'
import { ApprovalGate } from './CampaignResearch'

export default function CampaignDetail({ campaign, onBack, onUpdate }) {
  const [activeStep, setActiveStep] = useState(campaign.currentStep ?? 'setup')

  const advance = (nextStep) => {
    onUpdate({ ...campaign, currentStep: nextStep, status: 'Active' })
    setActiveStep(nextStep)
  }

  return (
    <div>
      <div className={styles.detailHeader}>
        <Btn variant="ghost" onClick={onBack} style={{ fontSize: 18, padding: '6px 10px' }}>←</Btn>
        <div>
          <h1 className={styles.detailTitle}>{campaign.name}</h1>
          <div className={styles.detailTags}>
            {campaign.brands?.map(b => <Tag key={b} variant="accent">{b}</Tag>)}
            {campaign.markets?.map(m => <Tag key={m}>{m}</Tag>)}
          </div>
        </div>
      </div>

      <div className={styles.pipelineNav}>
        {PIPELINE_STEPS.map((step, i) => {
          const stepIdx = PIPELINE_STEPS.findIndex(s => s.id === activeStep)
          const isDone    = i < stepIdx
          const isCurrent = step.id === activeStep
          return (
            <button
              key={step.id}
              onClick={() => isDone && setActiveStep(step.id)}
              className={[
                styles.pipelineTab,
                isDone    ? styles.done    : '',
                isCurrent ? styles.current : '',
              ].filter(Boolean).join(' ')}
            >
              {isDone && <span style={{ marginRight: 5 }}>✓</span>}
              {step.label}
            </button>
          )
        })}
      </div>

      <div className={styles.phaseContent}>
        {activeStep === 'setup'         && <SetupPhase campaign={campaign} onStart={() => advance('research')} />}
        {activeStep === 'research'      && <CampaignResearch      onApprove={() => advance('opportunities')} />}
        {activeStep === 'opportunities' && <CampaignOpportunities onApprove={() => advance('content')} />}
        {activeStep === 'content'       && <CampaignContentPlan   onApprove={() => advance('tracking')} />}
        {activeStep === 'tracking'      && <CampaignTracking />}
      </div>
    </div>
  )
}

function SetupPhase({ campaign, onStart }) {
  return (
    <div className={styles.phaseStack}>
      <div>
        <div className={styles.phaseHeaderRow}>
          <span>🔵</span>
          <h2 className={styles.phaseTitle}>Campaign Setup</h2>
        </div>
        <p className={styles.phaseSubtitle}>Review and confirm your campaign configuration before starting research.</p>
      </div>

      <div className={styles.phaseReviewCard}>
        <ReviewRow label="Name"       value={<span>{campaign.name}</span>} />
        <ReviewRow label="Brands"     value={<div className={styles.reviewTags}>{campaign.brands?.map(b    => <Tag key={b} variant="accent">{b}</Tag>)}</div>} />
        <ReviewRow label="Markets"    value={<div className={styles.reviewTags}>{campaign.markets?.map(m   => <Tag key={m}>{m}</Tag>)}</div>} />
        <ReviewRow label="Objectives" value={<div className={styles.reviewTags}>{campaign.objectives?.map(o => <Tag key={o} variant="blue">{o}</Tag>)}</div>} />
      </div>

      <ApprovalGate label="Confirm configuration and start Research phase" onApprove={onStart} />
    </div>
  )
}

function ReviewRow({ label, value }) {
  return (
    <div className={styles.reviewRow}>
      <span className={styles.reviewLabel}>{label}</span>
      <span className={styles.reviewValue}>{value}</span>
    </div>
  )
}
