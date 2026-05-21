import { useState } from 'react'
import { C } from '../../constants/colors'
import { MARKETS, OBJECTIVES, CONFLICTING_PAIRS } from '../../constants/campaign'
import Input from '../primitives/Input'
import Btn from '../primitives/Btn'
import Tag from '../primitives/Tag'

function hasConflict(selected) {
  return CONFLICTING_PAIRS.some(
    ([a, b]) => selected.includes(a) && selected.includes(b)
  )
}

export default function NewCampaignModal({ brands, onCreate, onClose }) {
  const [name, setName] = useState('')
  const [selectedBrands, setSelectedBrands] = useState([])
  const [selectedMarkets, setSelectedMarkets] = useState([])
  const [selectedObjectives, setSelectedObjectives] = useState([])

  const toggleBrand = (b) => setSelectedBrands(s =>
    s.includes(b) ? s.filter(x => x !== b) : [...s, b]
  )
  const toggleMarket = (m) => setSelectedMarkets(s =>
    s.includes(m) ? s.filter(x => x !== m) : [...s, m]
  )
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
    })
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: '#00000088',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
    }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        background: C.surface, border: `1px solid ${C.border}`,
        borderRadius: 16, padding: 28, width: 560, maxHeight: '90vh', overflowY: 'auto',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700 }}>New Campaign</h3>
          <Btn variant="ghost" onClick={onClose} style={{ fontSize: 18, padding: '4px 8px' }}>✕</Btn>
        </div>

        <Section label="Campaign name">
          <Input value={name} onChange={setName} placeholder="e.g. Q3 Organic Growth" />
        </Section>

        <Section label="Brands">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {brands.map(b => (
              <ToggleTag
                key={b.id}
                label={b.name}
                selected={selectedBrands.includes(b.name)}
                onToggle={() => toggleBrand(b.name)}
                activeColor={C.accentSoft}
                activeBg={C.accentGlow}
              />
            ))}
          </div>
        </Section>

        <Section label="Markets">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {MARKETS.map(m => (
              <ToggleTag
                key={m} label={m}
                selected={selectedMarkets.includes(m)}
                onToggle={() => toggleMarket(m)}
              />
            ))}
          </div>
        </Section>

        <Section label={`Objectives (max 2)`}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {OBJECTIVES.map(obj => {
              const sel = selectedObjectives.includes(obj.id)
              const disabled = !sel && selectedObjectives.length >= 2
              return (
                <div
                  key={obj.id}
                  onClick={() => !disabled && toggleObjective(obj.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '9px 14px', borderRadius: 8,
                    background: sel ? C.accentGlow : C.surfaceHigh,
                    border: `1px solid ${sel ? C.accent + '66' : C.border}`,
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    opacity: disabled ? 0.5 : 1,
                    transition: 'all 0.15s',
                    fontSize: 13,
                    color: sel ? C.accentSoft : C.text,
                  }}
                >
                  <span>{sel ? '◉' : '○'}</span>
                  {obj.label}
                </div>
              )
            })}
          </div>
          {conflict && (
            <div style={{
              marginTop: 10, padding: '10px 14px', borderRadius: 8,
              background: `${C.orange}15`, border: `1px solid ${C.orange}44`,
              fontSize: 12, color: C.orange,
            }}>
              ⚠ These objectives may require opposing content strategies. Consider whether both are truly needed.
            </div>
          )}
        </Section>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
          <Btn variant="secondary" onClick={onClose}>Cancel</Btn>
          <Btn onClick={handleCreate} disabled={!canCreate}>Create Campaign</Btn>
        </div>
      </div>
    </div>
  )
}

function Section({ label, children }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
        {label}
      </div>
      {children}
    </div>
  )
}

function ToggleTag({ label, selected, onToggle, activeColor, activeBg }) {
  return (
    <span
      onClick={onToggle}
      style={{
        display: 'inline-flex', alignItems: 'center',
        padding: '5px 12px', borderRadius: 20,
        fontSize: 12, fontWeight: 500,
        cursor: 'pointer',
        color: selected ? (activeColor ?? C.green) : C.textMuted,
        background: selected ? (activeBg ?? `${C.green}15`) : C.surfaceHigh,
        border: `1px solid ${selected ? (activeColor ?? C.green) + '44' : C.border}`,
        transition: 'all 0.15s',
      }}
    >
      {selected && <span style={{ marginRight: 4 }}>✓</span>}
      {label}
    </span>
  )
}
