import { C } from '../../constants/colors'
import { PIPELINE_STEPS } from '../../constants/campaign'

export default function ProgressBar({ currentStep }) {
  const stepIndex = PIPELINE_STEPS.findIndex(s => s.id === currentStep)

  return (
    <div style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
      {PIPELINE_STEPS.map((step, i) => (
        <div
          key={step.id}
          title={step.label}
          style={{
            flex: 1, height: 4, borderRadius: 2,
            background: i < stepIndex ? C.green : i === stepIndex ? C.accent : C.border,
            transition: 'background 0.3s',
          }}
        />
      ))}
    </div>
  )
}
