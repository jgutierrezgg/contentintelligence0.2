import { useState, useRef, useEffect } from 'react'
import styles from './dashboard.module.css'
import Card from '../primitives/Card'
import Tag from '../primitives/Tag'
import StatusPill from './StatusPill'
import ProgressBar from '../primitives/ProgressBar'

export default function CampaignCard({ campaign, onClick, onDelete, onCancel }) {
  const [menuOpen, setMenuOpen]       = useState(false)
  const [confirming, setConfirming]   = useState(false)
  const menuRef                       = useRef(null)

  useEffect(() => {
    if (!menuOpen) return
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
        setConfirming(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [menuOpen])

  const openMenu = (e) => {
    e.stopPropagation()
    setMenuOpen(o => !o)
    setConfirming(false)
  }

  const handleCancel = (e) => {
    e.stopPropagation()
    onCancel(campaign.id)
    setMenuOpen(false)
  }

  const handleDeleteClick = (e) => {
    e.stopPropagation()
    setConfirming(true)
  }

  const handleDeleteConfirm = (e) => {
    e.stopPropagation()
    onDelete(campaign.id)
    setMenuOpen(false)
  }

  const isCancelled = campaign.status === 'Cancelled'

  return (
    <Card onClick={onClick} className={[styles.card, menuOpen ? styles.menuOpen : ''].filter(Boolean).join(' ')}>
      <div className={styles.cardTop}>
        <div>
          <div className={styles.cardName}>{campaign.name}</div>
          <div className={styles.cardTags}>
            {campaign.brands?.map(b => <Tag key={b} variant="accent">{b}</Tag>)}
            {campaign.markets?.map(m => <Tag key={m}>{m}</Tag>)}
          </div>
        </div>

        <div className={styles.cardActions}>
          <StatusPill status={campaign.status} />
          <div className={styles.menuWrap} ref={menuRef}>
            <button className={styles.menuBtn} onClick={openMenu} title="Actions">⋯</button>
            {menuOpen && (
              <div className={styles.menuDropdown}>
                {!confirming ? (
                  <>
                    {!isCancelled && (
                      <button className={styles.menuItem} onClick={handleCancel}>
                        Cancel campaign
                      </button>
                    )}
                    {isCancelled && (
                      <button
                        className={styles.menuItem}
                        onClick={(e) => { e.stopPropagation(); onCancel(campaign.id, 'Active'); setMenuOpen(false) }}
                      >
                        Reactivate campaign
                      </button>
                    )}
                    <button className={[styles.menuItem, styles.menuItemDanger].join(' ')} onClick={handleDeleteClick}>
                      Delete campaign
                    </button>
                  </>
                ) : (
                  <div className={styles.menuConfirm}>
                    <div className={styles.menuConfirmText}>Delete permanently?</div>
                    <button className={[styles.menuItem, styles.menuItemDanger].join(' ')} onClick={handleDeleteConfirm}>
                      Yes, delete
                    </button>
                    <button className={styles.menuItem} onClick={(e) => { e.stopPropagation(); setConfirming(false) }}>
                      Keep it
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
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
