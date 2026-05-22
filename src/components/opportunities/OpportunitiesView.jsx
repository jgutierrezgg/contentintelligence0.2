import { useState } from 'react'
import styles from './opportunities.module.css'
import AutoProcess from '../primitives/AutoProcess'
import Btn from '../primitives/Btn'
import Tag from '../primitives/Tag'
import NewCampaignModal from '../dashboard/NewCampaignModal'
import { OBJECTIVES } from '../../constants/campaign'

const ANALYSIS_STEPS = [
  'Crossing GA + Search Console data with SEMrush…',
  'Identifying content gaps vs competitors…',
  'Running AI opportunity classification…',
  'Scoring opportunities by impact…',
]

const WORKFLOW_VARIANT = { Create: 'green', Optimize: 'blue', Convert: 'orange', Delete: 'red' }

const WORKFLOW_COLOR = {
  Create:   'var(--color-green)',
  Optimize: 'var(--color-blue)',
  Convert:  'var(--color-orange)',
  Delete:   'var(--color-red)',
}

const MOCK_OPPORTUNITIES = [
  { id: 'o1', title: 'Ultimate Guide to Content Strategy', workflow: 'Create',   volume: 8400, score: 94 },
  { id: 'o2', title: 'How to Improve Organic Rankings',    workflow: 'Optimize', volume: 5200, score: 88 },
  { id: 'o3', title: 'Product Comparison Page',            workflow: 'Convert',  volume: 3100, score: 76 },
  { id: 'o4', title: '2021 Marketing Trends (Outdated)',   workflow: 'Delete',   volume:  210, score: 12 },
  { id: 'o5', title: 'Email Marketing Best Practices',     workflow: 'Create',   volume: 6700, score: 91 },
  { id: 'o6', title: 'Landing Page Optimization Tips',     workflow: 'Optimize', volume: 4400, score: 83 },
]

export default function OpportunitiesView({ opportunitySets, onUpdateSets, brands, onCreateCampaign, onGoToCampaigns }) {
  const [selectedSetId, setSelectedSetId] = useState(null)
  const [autoRunId, setAutoRunId]         = useState(null)
  const [showCreateForm, setShowCreateForm] = useState(false)

  const selectedSet = opportunitySets.find(s => s.id === selectedSetId) ?? null

  const updateSet = (id, patch) =>
    onUpdateSets(opportunitySets.map(s => s.id === id ? { ...s, ...patch } : s))

  const createSet = ({ name, objectives, customObjectives, brands: setB }) => {
    const newSet = {
      id: `os_${Date.now()}`,
      name,
      objectives,
      customObjectives: customObjectives ?? [],
      brands: setB ?? [],
      createdAt: Date.now(),
      lastRunAt: null,
      items: [],
    }
    onUpdateSets([...opportunitySets, newSet])
    setShowCreateForm(false)
    setAutoRunId(newSet.id)
    setSelectedSetId(newSet.id)
  }

  const deleteSet = (id) => {
    onUpdateSets(opportunitySets.filter(s => s.id !== id))
    if (selectedSetId === id) setSelectedSetId(null)
  }

  if (selectedSet) {
    return (
      <SetDetail
        set={selectedSet}
        autoRun={autoRunId === selectedSet.id}
        onBack={() => { setSelectedSetId(null); setAutoRunId(null) }}
        onUpdate={patch => updateSet(selectedSet.id, patch)}
        onDelete={() => deleteSet(selectedSet.id)}
        brands={brands}
        onCreateCampaign={onCreateCampaign}
        onGoToCampaigns={onGoToCampaigns}
      />
    )
  }

  return (
    <div className={styles.view}>
      <div className={styles.viewHeader}>
        <div>
          <h1 className={styles.viewTitle}>Opportunities</h1>
          <p className={styles.viewSubtitle}>Create and run opportunity analyses for your workspace.</p>
        </div>
        {!showCreateForm && (
          <Btn onClick={() => setShowCreateForm(true)}>+ New Analysis</Btn>
        )}
      </div>

      {showCreateForm && (
        <CreateForm
          brands={brands}
          onSubmit={createSet}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      {opportunitySets.length === 0 && !showCreateForm ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>◎</div>
          <div className={styles.emptyText}>No opportunity analyses yet.</div>
          <Btn onClick={() => setShowCreateForm(true)}>Create your first analysis</Btn>
        </div>
      ) : (
        <div className={styles.setsList}>
          {opportunitySets.map(set => (
            <SetCard key={set.id} set={set} onClick={() => setSelectedSetId(set.id)} />
          ))}
        </div>
      )}
    </div>
  )
}

function CreateForm({ brands, onSubmit, onCancel }) {
  const [name, setName]                   = useState('')
  const [objectives, setObjectives]       = useState([])
  const [customObjs, setCustomObjs]       = useState([])
  const [customInput, setCustomInput]     = useState('')
  const [showCustomInput, setShowCustomInput] = useState(false)
  const [selectedBrands, setSelectedBrands] = useState([])

  const toggleObj = (id) =>
    setObjectives(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

  const toggleBrand = (b) =>
    setSelectedBrands(prev => prev.includes(b) ? prev.filter(x => x !== b) : [...prev, b])

  const addCustom = () => {
    const val = customInput.trim()
    if (!val || customObjs.includes(val)) return
    setCustomObjs(prev => [...prev, val])
    setCustomInput('')
    setShowCustomInput(false)
  }

  const removeCustom = (label) =>
    setCustomObjs(prev => prev.filter(x => x !== label))

  const canSubmit = name.trim() && (objectives.length > 0 || customObjs.length > 0)

  return (
    <div className={styles.createForm}>
      <div className={styles.formGroup}>
        <div className={styles.formLabel}>Analysis name</div>
        <input
          className={styles.formInput}
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="e.g. Q3 Organic Growth"
          autoFocus
        />
      </div>

      <div className={styles.formGroup}>
        <div className={styles.formLabel}>Objectives</div>
        <div className={styles.objectiveGrid}>
          {OBJECTIVES.map(obj => {
            const sel = objectives.includes(obj.id)
            return (
              <div
                key={obj.id}
                onClick={() => toggleObj(obj.id)}
                className={[styles.objectiveCard, sel ? styles.objectiveCardSelected : ''].filter(Boolean).join(' ')}
              >
                <div className={styles.objectiveCardLabel}>
                  <span className={styles.objectiveCardDot}>{sel ? '◉' : '○'}</span>
                  {obj.label}
                </div>
                <div className={styles.objectiveCardDesc}>{obj.description}</div>
              </div>
            )
          })}
        </div>

        {/* Custom objectives */}
        {(customObjs.length > 0 || showCustomInput) && (
          <div className={styles.customRow}>
            {customObjs.map(label => (
              <span key={label} className={styles.customChip}>
                {label}
                <button className={styles.customChipRemove} onClick={() => removeCustom(label)}>✕</button>
              </span>
            ))}
            {showCustomInput && (
              <div className={styles.customInputRow}>
                <input
                  className={styles.customInput}
                  value={customInput}
                  onChange={e => setCustomInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') addCustom(); if (e.key === 'Escape') setShowCustomInput(false) }}
                  placeholder="Custom objective…"
                  autoFocus
                />
                <Btn size="sm" onClick={addCustom}>Add</Btn>
                <Btn variant="ghost" size="sm" onClick={() => { setShowCustomInput(false); setCustomInput('') }}>✕</Btn>
              </div>
            )}
          </div>
        )}

        {!showCustomInput && (
          <button className={styles.addCustomBtn} onClick={() => setShowCustomInput(true)}>
            + Add custom objective
          </button>
        )}
      </div>

      {brands?.length > 0 && (
        <div className={styles.formGroup}>
          <div className={styles.formLabel}>Brands</div>
          <div className={styles.brandTags}>
            {brands.map(b => (
              <span
                key={b.id}
                onClick={() => toggleBrand(b.name)}
                className={[styles.brandTag, selectedBrands.includes(b.name) ? styles.brandTagSelected : ''].filter(Boolean).join(' ')}
              >
                {selectedBrands.includes(b.name) && <span className={styles.checkMark}>✓ </span>}
                {b.name}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className={styles.formActions}>
        <Btn variant="secondary" onClick={onCancel}>Cancel</Btn>
        <Btn
          onClick={() => onSubmit({ name: name.trim(), objectives, customObjectives: customObjs, brands: selectedBrands })}
          disabled={!canSubmit}
        >
          Create Analysis
        </Btn>
      </div>
    </div>
  )
}

function SetCard({ set, onClick }) {
  const objLabels     = OBJECTIVES.filter(o => set.objectives.includes(o.id))
  const allObjLabels  = [...objLabels.map(o => o.label), ...(set.customObjectives ?? [])]
  const lastRun       = set.lastRunAt
    ? new Date(set.lastRunAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : null

  return (
    <div className={styles.setCard} onClick={onClick}>
      <div className={styles.setCardMain}>
        <div className={styles.setCardName}>{set.name}</div>
        <div className={styles.setCardMeta}>
          {allObjLabels.map(l => (
            <span key={l} className={styles.setCardObj}>{l}</span>
          ))}
          {set.brands?.map(b => (
            <span key={b} className={styles.setCardBrand}>{b}</span>
          ))}
        </div>
      </div>
      <div className={styles.setCardRight}>
        {set.items.length > 0 ? (
          <div className={styles.setCardStats}>
            <span className={styles.setCardCount}>{set.items.length} opportunities</span>
            {lastRun && <span className={styles.setCardDate}>Last run {lastRun}</span>}
          </div>
        ) : (
          <span className={styles.setCardEmpty}>Not run yet</span>
        )}
        <span className={styles.setCardArrow}>→</span>
      </div>
    </div>
  )
}

function SetDetail({ set, autoRun, onBack, onUpdate, onDelete, brands, onCreateCampaign, onGoToCampaigns }) {
  const [running, setRunning]           = useState(autoRun ?? false)
  const [showAddForm, setShowAddForm]   = useState(false)
  const [newTitle, setNewTitle]         = useState('')
  const [newWorkflow, setNewWorkflow]   = useState('Create')
  const [showModal, setShowModal]       = useState(false)

  const objLabels     = OBJECTIVES.filter(o => set.objectives.includes(o.id))
  const allObjLabels  = [...objLabels.map(o => o.label), ...(set.customObjectives ?? [])]
  const hasItems      = set.items.length > 0
  const lastRun       = set.lastRunAt
    ? new Date(set.lastRunAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : null

  const handleRun = () => setRunning(true)

  const handleComplete = () => {
    setRunning(false)
    onUpdate({ items: MOCK_OPPORTUNITIES, lastRunAt: Date.now() })
  }

  const dismiss = (id) => onUpdate({ items: set.items.filter(i => i.id !== id) })

  const handleAdd = () => {
    if (!newTitle.trim()) return
    onUpdate({
      items: [...set.items, {
        id: `o${Date.now()}`,
        title: newTitle.trim(),
        workflow: newWorkflow,
        volume: 0,
        score: 0,
      }]
    })
    setNewTitle('')
    setShowAddForm(false)
  }

  const handleCreate = (c) => {
    onCreateCampaign(c)
    setShowModal(false)
    onGoToCampaigns()
  }

  return (
    <div className={styles.view}>
      <button className={styles.backLink} onClick={onBack}>← Opportunities</button>

      <div className={styles.detailHeader}>
        <div>
          <h1 className={styles.viewTitle}>{set.name}</h1>
          <div className={styles.detailMeta}>
            {allObjLabels.map(l => <Tag key={l} variant="accent">{l}</Tag>)}
            {set.brands?.map(b => <Tag key={b}>{b}</Tag>)}
          </div>
          {lastRun && !running && (
            <div className={styles.detailLastRun}>Last run {lastRun}</div>
          )}
        </div>
        <div className={styles.detailActions}>
          <Btn
            variant={hasItems ? 'secondary' : undefined}
            onClick={handleRun}
            disabled={running}
          >
            {running ? 'Running…' : hasItems ? '↺ Re-run Analysis' : 'Run Analysis →'}
          </Btn>
          <Btn variant="ghost" size="sm" onClick={onDelete} style={{ color: 'var(--color-red)' }}>
            Delete
          </Btn>
        </div>
      </div>

      {running && (
        <div className={styles.processBox}>
          <AutoProcess steps={ANALYSIS_STEPS} onComplete={handleComplete} />
        </div>
      )}

      {!running && !hasItems && (
        <div className={styles.emptyDetail}>
          No results yet — click "Run Analysis" to discover opportunities.
        </div>
      )}

      {!running && hasItems && (
        <>
          <div className={styles.resultsBar}>
            <span className={styles.resultsCount}>{set.items.length} opportunities</span>
            <Btn variant="secondary" size="sm" onClick={() => setShowAddForm(f => !f)}>
              + Add Opportunity
            </Btn>
          </div>

          {showAddForm && (
            <div className={styles.addForm}>
              <input
                className={styles.addInput}
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAdd()}
                placeholder="Opportunity title…"
                autoFocus
              />
              <select
                className={styles.addSelect}
                value={newWorkflow}
                onChange={e => setNewWorkflow(e.target.value)}
              >
                {Object.keys(WORKFLOW_VARIANT).map(w => (
                  <option key={w} value={w}>{w}</option>
                ))}
              </select>
              <Btn size="sm" onClick={handleAdd}>Add</Btn>
              <Btn variant="ghost" size="sm" onClick={() => { setShowAddForm(false); setNewTitle('') }}>Cancel</Btn>
            </div>
          )}

          <div className={styles.oppList}>
            {set.items.map(opp => (
              <div key={opp.id} className={styles.oppRow}>
                <Tag variant={WORKFLOW_VARIANT[opp.workflow]} style={{ width: 68, justifyContent: 'center' }}>
                  {opp.workflow}
                </Tag>
                <div className={styles.oppTitle}>{opp.title}</div>
                {opp.volume > 0 && (
                  <div className={styles.oppVol}>{opp.volume.toLocaleString()} vol</div>
                )}
                {opp.score > 0 && (
                  <div
                    className={styles.scoreRing}
                    style={{ background: `conic-gradient(${WORKFLOW_COLOR[opp.workflow]} ${opp.score}%, var(--color-border) 0)` }}
                  >
                    <div className={styles.scoreInner}>{opp.score}</div>
                  </div>
                )}
                <Btn variant="ghost" size="sm" onClick={() => dismiss(opp.id)} style={{ padding: '4px 6px' }}>✕</Btn>
              </div>
            ))}
          </div>

          <div className={styles.ctaRow}>
            <Btn onClick={() => setShowModal(true)}>+ Create Campaign from this Analysis</Btn>
          </div>
        </>
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
