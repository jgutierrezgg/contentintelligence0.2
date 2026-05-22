import { useState } from 'react'
import styles from './dashboard.module.css'
import { MARKETS } from '../../constants/campaign'
import Input from '../primitives/Input'
import Btn from '../primitives/Btn'

export default function NewCampaignModal({ brands, onCreate, onClose }) {
  const [name, setName]                     = useState('')
  const [selectedBrands, setSelectedBrands] = useState([])
  const [selectedMarkets, setSelectedMarkets] = useState([])

  const toggleBrand  = (b) => setSelectedBrands(s  => s.includes(b)  ? s.filter(x => x !== b)  : [...s, b])
  const toggleMarket = (m) => setSelectedMarkets(s => s.includes(m) ? s.filter(x => x !== m) : [...s, m])

  const canCreate = name.trim() && selectedBrands.length && selectedMarkets.length

  const handleCreate = () => {
    if (!canCreate) return
    onCreate({
      id: Date.now(),
      name: name.trim(),
      brands: selectedBrands,
      markets: selectedMarkets,
      objectives: [],
      status: 'Active',
      currentStep: 'research',
      processedSteps: {},
    })
  }

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>New Campaign</h3>
          <Btn variant="ghost" onClick={onClose} style={{ fontSize: 18, padding: '4px 8px' }}>✕</Btn>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionLabel}>Campaign name</div>
          <Input value={name} onChange={setName} placeholder="e.g. Q3 Organic Growth" />
        </div>

        <div className={styles.section}>
          <div className={styles.sectionLabel}>Brands</div>
          <div className={styles.tagRow}>
            {brands.map(b => (
              <span
                key={b.id}
                onClick={() => toggleBrand(b.name)}
                className={[styles.toggleTag, selectedBrands.includes(b.name) ? styles.selectedAccent : ''].filter(Boolean).join(' ')}
              >
                {selectedBrands.includes(b.name) && <span style={{ marginRight: 4 }}>✓</span>}
                {b.name}
              </span>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionLabel}>Markets</div>
          <div className={styles.tagRow}>
            {MARKETS.map(m => (
              <span
                key={m}
                onClick={() => toggleMarket(m)}
                className={[styles.toggleTag, selectedMarkets.includes(m) ? styles.selectedGreen : ''].filter(Boolean).join(' ')}
              >
                {selectedMarkets.includes(m) && <span style={{ marginRight: 4 }}>✓</span>}
                {m}
              </span>
            ))}
          </div>
        </div>

        <div className={styles.modalFooter}>
          <Btn variant="secondary" onClick={onClose}>Cancel</Btn>
          <Btn onClick={handleCreate} disabled={!canCreate}>Create Campaign</Btn>
        </div>
      </div>
    </div>
  )
}
