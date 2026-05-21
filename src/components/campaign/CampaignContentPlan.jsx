import { useState } from 'react'
import styles from './campaign.module.css'
import AutoProcess from '../primitives/AutoProcess'
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

  if (approved) return <div className={styles.approved}>✓ Content plan approved — execution underway.</div>

  return (
    <div className={styles.phaseStack}>
      <PhaseHeader icon="🟢" title="Content Plan" subtitle="Opportunities sorted by impact and assigned to a weekly execution schedule." />

      {!planDone ? (
        <AutoProcess steps={PLAN_STEPS} onComplete={() => setPlanDone(true)} />
      ) : (
        <>
          <div className={styles.weekSection}>
            {MOCK_PLAN.map(week => (
              <div key={week.week}>
                <div className={styles.weekLabel}>Week {week.week}</div>
                <div className={styles.planItems}>
                  {week.items.map(item => (
                    <div key={item} className={styles.planItem}>
                      <span className={styles.planHandle}>≡</span>
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
