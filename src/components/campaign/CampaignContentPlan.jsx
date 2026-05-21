import { useState } from 'react'
import { C } from '../../constants/colors'
import AutoProcess from '../primitives/AutoProcess'
import Tag from '../primitives/Tag'
import { PhaseHeader, ApprovalGate } from './CampaignResearch'

const PLAN_STEPS = [
  'Sorting opportunities by impact score…',
  'Assigning content to weekly schedule…',
  'Generating structured content plan…',
]

const MOCK_PLAN = [
  { week: 1, items: ['Ultimate Guide to Content Strategy', 'Email Marketing Best Practices'] },
  { week: 2, items: ['How to Improve Organic Rankings', 'Landing Page Optimization Tips'] },
  { week: 3, items: ['Product Comparison Page'] },
]

export default function CampaignContentPlan({ onApprove }) {
  const [planDone, setPlanDone] = useState(false)
  const [approved, setApproved] = useState(false)

  if (approved) {
    return (
      <div style={{ color: C.green, fontWeight: 600, padding: 16 }}>
        ✓ Content plan approved — execution underway.
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <PhaseHeader
        icon="🟢"
        title="Content Plan"
        subtitle="Opportunities sorted by impact and assigned to a weekly execution schedule."
      />

      {!planDone ? (
        <AutoProcess steps={PLAN_STEPS} onComplete={() => setPlanDone(true)} />
      ) : (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {MOCK_PLAN.map(week => (
              <div key={week.week}>
                <div style={{
                  fontSize: 11, fontWeight: 600, color: C.textMuted,
                  textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8,
                }}>
                  Week {week.week}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {week.items.map(item => (
                    <div
                      key={item}
                      style={{
                        padding: '10px 14px', borderRadius: 8,
                        background: C.surfaceHigh, border: `1px solid ${C.border}`,
                        fontSize: 13, display: 'flex', alignItems: 'center', gap: 10,
                      }}
                    >
                      <span style={{ color: C.textMuted }}>≡</span>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <ApprovalGate
            label="Approve content plan to begin execution"
            onApprove={() => { setApproved(true); onApprove?.() }}
          />
        </>
      )}
    </div>
  )
}
