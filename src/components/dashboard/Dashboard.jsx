import { useState } from 'react'
import styles from './dashboard.module.css'
import Btn from '../primitives/Btn'
import CampaignCard from './CampaignCard'
import NewCampaignModal from './NewCampaignModal'

export default function Dashboard({ campaigns, brands, onSelectCampaign, onCreateCampaign }) {
  const [showModal, setShowModal] = useState(false)

  const handleCreate = (campaign) => { onCreateCampaign(campaign); setShowModal(false) }

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Campaigns</h1>
          <p className={styles.pageSubtitle}>
            {campaigns.length} campaign{campaigns.length !== 1 ? 's' : ''} running
          </p>
        </div>
        <Btn onClick={() => setShowModal(true)}>+ New Campaign</Btn>
      </div>

      {campaigns.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>◈</div>
          <div className={styles.emptyTitle}>No campaigns yet</div>
          <div>Create your first campaign to get started.</div>
        </div>
      ) : (
        <div className={styles.grid}>
          {campaigns.map(c => (
            <CampaignCard key={c.id} campaign={c} onClick={() => onSelectCampaign(c)} />
          ))}
        </div>
      )}

      {showModal && (
        <NewCampaignModal brands={brands} onCreate={handleCreate} onClose={() => setShowModal(false)} />
      )}
    </div>
  )
}
