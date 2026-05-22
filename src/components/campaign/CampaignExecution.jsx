import styles from './campaign.module.css'
import Tag from '../primitives/Tag'
import { PhaseHeader } from './CampaignResearch'

const METRICS = [
  { label: 'Organic Traffic',  value: '12,480', delta: '+18%', colorVar: 'var(--color-green)',        variant: 'green'  },
  { label: 'Keyword Rankings', value: '284',    delta: '+47',  colorVar: 'var(--color-blue)',         variant: 'blue'   },
  { label: 'Leads Generated',  value: '163',    delta: '+23%', colorVar: 'var(--color-orange)',       variant: 'orange' },
  { label: 'Avg. Position',    value: '8.4',    delta: '↓2.1', colorVar: 'var(--color-accent-soft)', variant: 'accent' },
]

const CONTENT_ITEMS = [
  { title: 'Ultimate Guide to Content Strategy', status: 'Published',   variant: 'green',   progress: 100 },
  { title: 'Email Marketing Best Practices',     status: 'In Progress', variant: 'blue',    progress:  55 },
  { title: 'How to Improve Organic Rankings',    status: 'In Progress', variant: 'blue',    progress:  55 },
  { title: 'Landing Page Optimization Tips',     status: 'Pending',     variant: 'default', progress:   0 },
  { title: 'Product Comparison Page',            status: 'Pending',     variant: 'default', progress:   0 },
]

const PROGRESS_COLOR = {
  Published:    'var(--color-green)',
  'In Progress': 'var(--color-blue)',
  Pending:      'var(--color-text-muted)',
}

export default function CampaignExecution() {
  return (
    <div className={styles.phaseStack}>
      <PhaseHeader icon="🟢" title="Execution" subtitle="Real-time performance metrics and content execution status." />

      <div className={styles.metricsGrid}>
        {METRICS.map(m => (
          <div key={m.label} className={styles.metricCard}>
            <div className={styles.metricValue} style={{ color: m.colorVar }}>{m.value}</div>
            <div className={styles.metricLabel}>{m.label}</div>
            <div className={styles.metricDelta} style={{ color: m.colorVar }}>{m.delta}</div>
          </div>
        ))}
      </div>

      <div className={styles.contentStatusSection}>
        <div className={styles.contentStatusLabel}>Content Status</div>
        <div className={styles.contentList}>
          {CONTENT_ITEMS.map(item => (
            <div key={item.title} className={styles.contentItem}>
              <div className={styles.contentItemTop}>
                <span className={styles.contentItemTitle}>{item.title}</span>
                <Tag variant={item.variant}>{item.status}</Tag>
              </div>
              <div className={styles.progressTrack}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${item.progress}%`, background: PROGRESS_COLOR[item.status] }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
