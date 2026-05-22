import { useState } from 'react'
import styles from './campaign.module.css'
import { PIPELINE_STEPS } from '../../constants/campaign'
import Btn from '../primitives/Btn'
import Tag from '../primitives/Tag'
import CampaignResearch from './CampaignResearch'
import CampaignAnalysis from './CampaignAnalysis'
import CampaignPlanning from './CampaignPlanning'
import CampaignExecution from './CampaignExecution'

export default function CampaignDetail({ campaign, onBack, onUpdate, onDelete }) {
  const [activeStep, setActiveStep] = useState(campaign.currentStep ?? 'research')

  const processedSteps = campaign.processedSteps ?? {}
  const currentStepIdx = PIPELINE_STEPS.findIndex(s => s.id === (campaign.currentStep ?? 'research'))

  const advance = (nextStep) => {
    onUpdate({ ...campaign, currentStep: nextStep, status: 'Active' })
    setActiveStep(nextStep)
  }

  const handleProcessed = (stepId) => {
    onUpdate({ ...campaign, processedSteps: { ...processedSteps, [stepId]: true } })
  }

  const handleRerun = (stepId) => {
    const fromIdx  = PIPELINE_STEPS.findIndex(s => s.id === stepId)
    const resetIds = new Set(PIPELINE_STEPS.slice(fromIdx).map(s => s.id))
    const newProcessed = Object.fromEntries(
      Object.entries(processedSteps).filter(([k]) => !resetIds.has(k))
    )
    onUpdate({ ...campaign, currentStep: stepId, processedSteps: newProcessed, status: 'Active' })
    setActiveStep(stepId)
  }

  const isAtFrontier = activeStep === (campaign.currentStep ?? 'research')

  return (
    <div>
      <div className={styles.detailHeader}>
        <Btn variant="ghost" onClick={onBack} style={{ fontSize: 18, padding: '6px 10px' }}>←</Btn>
        <div style={{ flex: 1 }}>
          <h1 className={styles.detailTitle}>{campaign.name}</h1>
          <div className={styles.detailTags}>
            {campaign.brands?.map(b => <Tag key={b} variant="accent">{b}</Tag>)}
            {campaign.markets?.map(m => <Tag key={m}>{m}</Tag>)}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexShrink: 0 }}>
          {campaign.status !== 'Cancelled' ? (
            <Btn
              variant="secondary"
              size="sm"
              onClick={() => onUpdate({ ...campaign, status: 'Cancelled' })}
            >
              Cancel Campaign
            </Btn>
          ) : (
            <Btn
              variant="secondary"
              size="sm"
              onClick={() => onUpdate({ ...campaign, status: 'Active' })}
            >
              Reactivate
            </Btn>
          )}
          <Btn
            variant="ghost"
            size="sm"
            onClick={onDelete}
            style={{ color: 'var(--color-red)' }}
          >
            Delete
          </Btn>
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
        {activeStep === 'research' && (
          <CampaignResearch
            onApprove={() => advance('analysis')}
            isProcessed={!!processedSteps.research}
            onProcessed={() => handleProcessed('research')}
            canAdvance={isAtFrontier}
            onRerun={() => handleRerun('research')}
          />
        )}
        {activeStep === 'analysis' && (
          <CampaignAnalysis
            onApprove={() => advance('planning')}
            isProcessed={!!processedSteps.analysis}
            onProcessed={() => handleProcessed('analysis')}
            canAdvance={isAtFrontier}
            onRerun={() => handleRerun('analysis')}
          />
        )}
        {activeStep === 'planning' && (
          <CampaignPlanning
            onApprove={() => advance('execution')}
            isProcessed={!!processedSteps.planning}
            onProcessed={() => handleProcessed('planning')}
            canAdvance={isAtFrontier}
            onRerun={() => handleRerun('planning')}
            planItems={campaign.planItems ?? null}
            onUpdateItems={(items) => onUpdate({ ...campaign, planItems: items })}
          />
        )}
        {activeStep === 'execution' && <CampaignExecution />}
      </div>
    </div>
  )
}
