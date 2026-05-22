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

  const processedSteps = campaign.processedSteps ?? {}
  const currentStepIdx = PIPELINE_STEPS.findIndex(s => s.id === (campaign.currentStep ?? 'setup'))

  const advance = (nextStep) => {
    onUpdate({ ...campaign, currentStep: nextStep, status: 'Active' })
    setActiveStep(nextStep)
  }

  const handleProcessed = (stepId) => {
    onUpdate({ ...campaign, processedSteps: { ...processedSteps, [stepId]: true } })
  }

  // Wipe the step and everything after it, then navigate back to it
  const handleRerun = (stepId) => {
    const fromIdx  = PIPELINE_STEPS.findIndex(s => s.id === stepId)
    const resetIds = new Set(PIPELINE_STEPS.slice(fromIdx).map(s => s.id))
    const newProcessed = Object.fromEntries(
      Object.entries(processedSteps).filter(([k]) => !resetIds.has(k))
    )
    onUpdate({ ...campaign, currentStep: stepId, processedSteps: newProcessed, status: 'Active' })
    setActiveStep(stepId)
  }

  // True only when the viewed tab equals the furthest step reached
  const isAtFrontier = activeStep === (campaign.currentStep ?? 'setup')

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
          const isDone    = i < currentStepIdx
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
        {activeStep === 'setup' && (
          <SetupPhase campaign={campaign} onStart={() => advance('research')} />
        )}
        {activeStep === 'research' && (
          <CampaignResearch
            onApprove={() => advance('opportunities')}
            isProcessed={!!processedSteps.research}
            onProcessed={() => handleProcessed('research')}
            canAdvance={isAtFrontier}
            onRerun={() => handleRerun('research')}
          />
        )}
        {activeStep === 'opportunities' && (
          <CampaignOpportunities
            onApprove={() => advance('content')}
            isProcessed={!!processedSteps.opportunities}
            onProcessed={() => handleProcessed('opportunities')}
            canAdvance={isAtFrontier}
            onRerun={() => handleRerun('opportunities')}
          />
        )}
        {activeStep === 'content' && (
          <CampaignContentPlan
            onApprove={() => advance('tracking')}
            isProcessed={!!processedSteps.content}
            onProcessed={() => handleProcessed('content')}
            canAdvance={isAtFrontier}
            onRerun={() => handleRerun('content')}
          />
        )}
        {activeStep === 'tracking' && <CampaignTracking />}
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
