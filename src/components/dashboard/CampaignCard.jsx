import styles from './dashboard.module.css'
import Card from '../primitives/Card'
import Tag from '../primitives/Tag'
import StatusPill from './StatusPill'
import ProgressBar from '../primitives/ProgressBar'

export default function CampaignCard({ campaign, onClick }) {
  return (
    <Card onClick={onClick} className={styles.card}>
      <div className={styles.cardTop}>
        <div>
          <div className={styles.cardName}>{campaign.name}</div>
          <div className={styles.cardTags}>
            {campaign.brands?.map(b => <Tag key={b} variant="accent">{b}</Tag>)}
            {campaign.markets?.map(m => <Tag key={m}>{m}</Tag>)}
          </div>
        </div>
        <StatusPill status={campaign.status} />
      </div>

      <div className={styles.pipelineWrap}>
        <div className={styles.pipelineLabel}>Pipeline</div>
        <ProgressBar currentStep={campaign.currentStep} />
      </div>

      <div className={styles.cardTags}>
        {campaign.objectives?.map(obj => <Tag key={obj} variant="blue">{obj}</Tag>)}
      </div>
    </Card>
  )
}
