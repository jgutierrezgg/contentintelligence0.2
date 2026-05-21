import { C } from '../../constants/colors'
import Card from '../primitives/Card'
import Tag from '../primitives/Tag'
import StatusPill from './StatusPill'
import ProgressBar from '../primitives/ProgressBar'

export default function CampaignCard({ campaign, onClick }) {
  return (
    <Card onClick={onClick} style={{ cursor: 'pointer' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>{campaign.name}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {campaign.brands?.map(b => (
              <Tag key={b} color={C.accentSoft} bg={C.accentGlow}>{b}</Tag>
            ))}
            {campaign.markets?.map(m => (
              <Tag key={m}>{m}</Tag>
            ))}
          </div>
        </div>
        <StatusPill status={campaign.status} />
      </div>

      <div style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Pipeline
        </div>
        <ProgressBar currentStep={campaign.currentStep} />
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {campaign.objectives?.map(obj => (
          <Tag key={obj} color={C.blue} bg={`${C.blue}15`}>{obj}</Tag>
        ))}
      </div>
    </Card>
  )
}
