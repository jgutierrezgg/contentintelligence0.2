import { useState } from 'react'
import { C } from '../../constants/colors'
import Btn from '../primitives/Btn'
import CampaignCard from './CampaignCard'
import NewCampaignModal from './NewCampaignModal'

export default function Dashboard({ campaigns, brands, onSelectCampaign, onCreateCampaign }) {
  const [showModal, setShowModal] = useState(false)

  const handleCreate = (campaign) => {
    onCreateCampaign(campaign)
    setShowModal(false)
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700 }}>Campaigns</h1>
          <p style={{ color: C.textMuted, marginTop: 4, fontSize: 14 }}>
            {campaigns.length} campaign{campaigns.length !== 1 ? 's' : ''} running
          </p>
        </div>
        <Btn onClick={() => setShowModal(true)}>+ New Campaign</Btn>
      </div>

      {campaigns.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '80px 0',
          color: C.textMuted, fontSize: 14,
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>◈</div>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>No campaigns yet</div>
          <div>Create your first campaign to get started.</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 14, gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))' }}>
          {campaigns.map(c => (
            <CampaignCard key={c.id} campaign={c} onClick={() => onSelectCampaign(c)} />
          ))}
        </div>
      )}

      {showModal && (
        <NewCampaignModal
          brands={brands}
          onCreate={handleCreate}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  )
}
