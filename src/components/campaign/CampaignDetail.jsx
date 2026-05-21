import { useState } from 'react'
import { C } from '../../constants/colors'
import { PIPELINE_STEPS } from '../../constants/campaign'
import Btn from '../primitives/Btn'
import Tag from '../primitives/Tag'
import CampaignResearch from './CampaignResearch'
import CampaignOpportunities from './CampaignOpportunities'
import CampaignContentPlan from './CampaignContentPlan'
import CampaignTracking from './CampaignTracking'

export default function CampaignDetail({ campaign, onBack, onUpdate }) {
  const [activeStep, setActiveStep] = useState(campaign.currentStep ?? 'setup')

  const advance = (nextStep) => {
    onUpdate({ ...campaign, currentStep: nextStep, status: 'Active' })
    setActiveStep(nextStep)
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
        <Btn variant="ghost" onClick={onBack} style={{ padding: '6px 10px', fontSize: 18 }}>←</Btn>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700 }}>{campaign.name}</h1>
          <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
            {campaign.brands?.map(b => <Tag key={b} color={C.accentSoft} bg={C.accentGlow}>{b}</Tag>)}
            {campaign.markets?.map(m => <Tag key={m}>{m}</Tag>)}
          </div>
        </div>
      </div>

      {/* Pipeline nav */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 28, borderBottom: `1px solid ${C.border}` }}>
        {PIPELINE_STEPS.map((step, i) => {
          const stepIdx = PIPELINE_STEPS.findIndex(s => s.id === activeStep)
          const isDone = i < stepIdx
          const isCurrent = step.id === activeStep
          return (
            <button
              key={step.id}
              onClick={() => isDone && setActiveStep(step.id)}
              style={{
                padding: '10px 18px',
                background: 'transparent',
                border: 'none',
                borderBottom: `2px solid ${isCurrent ? C.accent : 'transparent'}`,
                color: isCurrent ? C.accent : isDone ? C.green : C.textMuted,
                fontFamily: 'inherit', fontSize: 13, fontWeight: isCurrent ? 600 : 400,
                cursor: isDone ? 'pointer' : 'default',
                transition: 'all 0.15s',
              }}
            >
              {isDone && <span style={{ marginRight: 5 }}>✓</span>}
              {step.label}
            </button>
          )
        })}
      </div>

      {/* Phase content */}
      <div style={{ maxWidth: 720 }}>
        {activeStep === 'setup' && (
          <SetupPhase campaign={campaign} onStart={() => advance('research')} />
        )}
        {activeStep === 'research' && (
          <CampaignResearch onApprove={() => advance('opportunities')} />
        )}
        {activeStep === 'opportunities' && (
          <CampaignOpportunities onApprove={() => advance('content')} />
        )}
        {activeStep === 'content' && (
          <CampaignContentPlan onApprove={() => advance('tracking')} />
        )}
        {activeStep === 'tracking' && (
          <CampaignTracking />
        )}
      </div>
    </div>
  )
}

function SetupPhase({ campaign, onStart }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <span>🔵</span>
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>Campaign Setup</h2>
        </div>
        <p style={{ color: C.textMuted, fontSize: 13 }}>
          Review and confirm your campaign configuration before starting research.
        </p>
      </div>

      <div style={{
        background: C.surface, border: `1px solid ${C.border}`,
        borderRadius: 10, padding: 20,
        display: 'flex', flexDirection: 'column', gap: 14,
      }}>
        <Row label="Name" value={campaign.name} />
        <Row label="Brands" value={
          <div style={{ display: 'flex', gap: 6 }}>
            {campaign.brands?.map(b => <Tag key={b} color={C.accentSoft} bg={C.accentGlow}>{b}</Tag>)}
          </div>
        } />
        <Row label="Markets" value={
          <div style={{ display: 'flex', gap: 6 }}>
            {campaign.markets?.map(m => <Tag key={m}>{m}</Tag>)}
          </div>
        } />
        <Row label="Objectives" value={
          <div style={{ display: 'flex', gap: 6 }}>
            {campaign.objectives?.map(o => <Tag key={o} color={C.blue} bg={`${C.blue}15`}>{o}</Tag>)}
          </div>
        } />
      </div>

      <div style={{
        padding: 16, borderRadius: 10,
        background: `${C.blue}0f`, border: `1px solid ${C.blue}33`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <span style={{ fontSize: 13, color: C.text }}>🔵 Confirm configuration and start Research phase</span>
        <Btn onClick={onStart}>Start Research →</Btn>
      </div>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', fontSize: 13 }}>
      <span style={{ color: C.textMuted, width: 90, flexShrink: 0 }}>{label}</span>
      <span style={{ color: C.text }}>{value}</span>
    </div>
  )
}
