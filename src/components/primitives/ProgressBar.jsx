import styles from './ProgressBar.module.css'
import { PIPELINE_STEPS } from '../../constants/campaign'

export default function ProgressBar({ currentStep }) {
  const stepIndex = PIPELINE_STEPS.findIndex(s => s.id === currentStep)

  return (
    <div className={styles.bar}>
      {PIPELINE_STEPS.map((step, i) => (
        <div
          key={step.id}
          title={step.label}
          className={[
            styles.segment,
            i < stepIndex  ? styles.done    : '',
            i === stepIndex ? styles.current : '',
          ].filter(Boolean).join(' ')}
        />
      ))}
    </div>
  )
}
