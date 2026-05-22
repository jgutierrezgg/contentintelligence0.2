import { useState } from 'react'
import styles from './dashboard.module.css'
import { MARKETS, OBJECTIVES, CONFLICTING_PAIRS } from '../../constants/campaign'
import Input from '../primitives/Input'
import Btn from '../primitives/Btn'

function hasConflict(selected) {
  return CONFLICTING_PAIRS.some(([a, b]) => selected.includes(a) && selected.includes(b))
}

export default function NewCampaignModal({ brands, onCreate, onClose }) {
  const [name, setName] = useState('')
  const [selectedBrands, setSelectedBrands] = useState([])
  const [selectedMarkets, setSelectedMarkets] = useState([])
  const [selectedObjectives, setSelectedObjectives] = useState([])

  const toggleBrand = (b) => setSelectedBrands(s => s.includes(b) ? s.filter(x => x !== b) : [...s, b])
  const toggleMarket = (m) => setSelectedMarkets(s => s.includes(m) ? s.filter(x => x !== m) : [...s, m])
  const toggleObjective = (id) => {
    if (selectedObjectives.includes(id)) {
      setSelectedObjectives(s => s.filter(x => x !== id))
    } else if (selectedObjectives.length < 2) {
      setSelectedObjectives(s => [...s, id])
    }
  }

  const conflict = hasConflict(selectedObjectives)
  const canCreate = name.trim() && selectedBrands.length && selectedMarkets.length && selectedObjectives.length

  const handleCreate = () => {
    if (!canCreate) return
    onCreate({
      id: Date.now(),
      name: name.trim(),
      brands: selectedBrands,
      markets: selectedMarkets,
      objectives: OBJECTIVES.filter(o => selectedObjectives.includes(o.id)).map(o => o.label),
      status: 'Setup',
      currentStep: 'setup',
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

        <div className={styles.section}>
          <div className={styles.sectionLabel}>Objectives (max 2)</div>
          <div className={styles.objectiveList}>
            {OBJECTIVES.map(obj => {
              const sel = selectedObjectives.includes(obj.id)
              const disabled = !sel && selectedObjectives.length >= 2
              return (
                <div
                  key={obj.id}
                  onClick={() => !disabled && toggleObjective(obj.id)}
                  className={[
                    styles.objective,
                    sel      ? styles.selected : '',
                    disabled ? styles.disabled : '',
                  ].filter(Boolean).join(' ')}
                >
                  <span>{sel ? '◉' : '○'}</span>
                  {obj.label}
                </div>
              )
            })}
          </div>
          {conflict && (
            <div className={styles.conflict}>
              ⚠ These objectives may require opposing content strategies. Consider whether both are truly needed.
            </div>
          )}
        </div>

        <div className={styles.modalFooter}>
          <Btn variant="secondary" onClick={onClose}>Cancel</Btn>
          <Btn onClick={handleCreate} disabled={!canCreate}>Create Campaign</Btn>
        </div>
      </div>
    </div>
  )
}
