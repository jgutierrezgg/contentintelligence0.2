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
  {
    id: 'o1', title: 'Ultimate Guide to Content Strategy', workflow: 'Create', volume: 8400, score: 94,
    detail: {
      intent: 'Informational',
      difficulty: 34,
      trafficPotential: 12400,
      keywords: ['content strategy', 'content marketing guide', 'content planning'],
      contentType: 'Long-form article (3,000+ words)',
      competitor: 'hubspot.com/marketing/content-strategy',
      notes: '',
    },
  },
  {
    id: 'o2', title: 'How to Improve Organic Rankings', workflow: 'Optimize', volume: 5200, score: 88,
    detail: {
      url: '/blog/seo-tips',
      position: 14.2,
      traffic: 1240,
      impressions: 18600,
      ctr: 6.7,
      actions: ['Add structured data markup', 'Expand backlink building section', 'Refresh stats and update publish date'],
      notes: '',
    },
  },
  {
    id: 'o3', title: 'Product Comparison Page', workflow: 'Convert', volume: 3100, score: 76,
    detail: {
      url: '/compare',
      traffic: 3100,
      conversionRate: 0.8,
      targetAction: 'Free trial signup',
      changes: ['Add comparison table above the fold', 'Include customer testimonials', 'Add sticky CTA button'],
      notes: '',
    },
  },
  {
    id: 'o4', title: '2021 Marketing Trends (Outdated)', workflow: 'Delete', volume: 210, score: 12,
    detail: {
      url: '/blog/2021-marketing-trends',
      traffic: 210,
      trend: -62,
      reason: 'Content is outdated and declining. Search intent has shifted to current-year content.',
      action: '301 redirect → /blog/marketing-trends',
      notes: '',
    },
  },
  {
    id: 'o5', title: 'Email Marketing Best Practices', workflow: 'Create', volume: 6700, score: 91,
    detail: {
      intent: 'Informational / Commercial',
      difficulty: 41,
      trafficPotential: 9800,
      keywords: ['email marketing best practices', 'email marketing tips', 'email campaign strategy'],
      contentType: 'Comprehensive guide with examples',
      competitor: 'mailchimp.com/resources/email-marketing-best-practices',
      notes: '',
    },
  },
  {
    id: 'o6', title: 'Landing Page Optimization Tips', workflow: 'Optimize', volume: 4400, score: 83,
    detail: {
      url: '/blog/landing-page-tips',
      position: 11.8,
      traffic: 890,
      impressions: 14200,
      ctr: 6.3,
      actions: ['Update title to include current year', 'Add A/B testing case studies', 'Expand CTA section with examples'],
      notes: '',
    },
  },
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
        <CreateForm brands={brands} onSubmit={createSet} onCancel={() => setShowCreateForm(false)} />
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

/* ─────────────────────────────────────────────────────────── */
/*  Create form                                                */
/* ─────────────────────────────────────────────────────────── */
function CreateForm({ brands, onSubmit, onCancel }) {
  const [name, setName]                       = useState('')
  const [objectives, setObjectives]           = useState([])
  const [customObjs, setCustomObjs]           = useState([])
  const [customInput, setCustomInput]         = useState('')
  const [showCustomInput, setShowCustomInput] = useState(false)
  const [selectedBrands, setSelectedBrands]   = useState([])

  const toggleObj   = (id) => setObjectives(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  const toggleBrand = (b)  => setSelectedBrands(prev => prev.includes(b) ? prev.filter(x => x !== b) : [...prev, b])

  const addCustom = () => {
    const val = customInput.trim()
    if (!val || customObjs.includes(val)) return
    setCustomObjs(prev => [...prev, val])
    setCustomInput('')
    setShowCustomInput(false)
  }

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

        {(customObjs.length > 0 || showCustomInput) && (
          <div className={styles.customRow}>
            {customObjs.map(label => (
              <span key={label} className={styles.customChip}>
                {label}
                <button className={styles.customChipRemove} onClick={() => setCustomObjs(p => p.filter(x => x !== label))}>✕</button>
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

/* ─────────────────────────────────────────────────────────── */
/*  Set card (list view)                                       */
/* ─────────────────────────────────────────────────────────── */
function SetCard({ set, onClick }) {
  const objLabels    = OBJECTIVES.filter(o => set.objectives.includes(o.id))
  const allObjLabels = [...objLabels.map(o => o.label), ...(set.customObjectives ?? [])]
  const lastRun      = set.lastRunAt
    ? new Date(set.lastRunAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : null

  return (
    <div className={styles.setCard} onClick={onClick}>
      <div className={styles.setCardMain}>
        <div className={styles.setCardName}>{set.name}</div>
        <div className={styles.setCardMeta}>
          {allObjLabels.map(l => <span key={l} className={styles.setCardObj}>{l}</span>)}
          {set.brands?.map(b => <span key={b} className={styles.setCardBrand}>{b}</span>)}
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

/* ─────────────────────────────────────────────────────────── */
/*  Set detail                                                 */
/* ─────────────────────────────────────────────────────────── */
function SetDetail({ set, autoRun, onBack, onUpdate, onDelete, brands, onCreateCampaign, onGoToCampaigns }) {
  const [running, setRunning]           = useState(autoRun ?? false)
  const [showAddForm, setShowAddForm]   = useState(false)
  const [newTitle, setNewTitle]         = useState('')
  const [newWorkflow, setNewWorkflow]   = useState('Create')
  const [showModal, setShowModal]       = useState(false)
  const [selectedOppId, setSelectedOppId] = useState(null)

  const objLabels  = OBJECTIVES.filter(o => set.objectives.includes(o.id))
  const allLabels  = [...objLabels.map(o => o.label), ...(set.customObjectives ?? [])]
  const hasItems   = set.items.length > 0
  const lastRun    = set.lastRunAt
    ? new Date(set.lastRunAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : null

  const selectedOpp = set.items.find(i => i.id === selectedOppId) ?? null

  const updateOpp = (id, patch) =>
    onUpdate({ items: set.items.map(i => i.id === id ? { ...i, ...patch } : i) })

  const handleComplete = () => {
    setRunning(false)
    onUpdate({ items: MOCK_OPPORTUNITIES, lastRunAt: Date.now() })
  }

  const dismiss = (id, e) => {
    e.stopPropagation()
    if (selectedOppId === id) setSelectedOppId(null)
    onUpdate({ items: set.items.filter(i => i.id !== id) })
  }

  const handleAdd = () => {
    if (!newTitle.trim()) return
    onUpdate({
      items: [...set.items, { id: `o${Date.now()}`, title: newTitle.trim(), workflow: newWorkflow, volume: 0, score: 0 }]
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
    <>
      <div className={styles.view}>
        <button className={styles.backLink} onClick={onBack}>← Opportunities</button>

        <div className={styles.detailHeader}>
          <div>
            <h1 className={styles.viewTitle}>{set.name}</h1>
            <div className={styles.detailMeta}>
              {allLabels.map(l => <Tag key={l} variant="accent">{l}</Tag>)}
              {set.brands?.map(b => <Tag key={b}>{b}</Tag>)}
            </div>
            {lastRun && !running && <div className={styles.detailLastRun}>Last run {lastRun}</div>}
          </div>
          <div className={styles.detailActions}>
            <Btn variant={hasItems ? 'secondary' : undefined} onClick={() => setRunning(true)} disabled={running}>
              {running ? 'Running…' : hasItems ? '↺ Re-run Analysis' : 'Run Analysis →'}
            </Btn>
            <Btn variant="ghost" size="sm" onClick={onDelete} style={{ color: 'var(--color-red)' }}>Delete</Btn>
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
              <Btn variant="secondary" size="sm" onClick={() => setShowAddForm(f => !f)}>+ Add Opportunity</Btn>
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
                <select className={styles.addSelect} value={newWorkflow} onChange={e => setNewWorkflow(e.target.value)}>
                  {Object.keys(WORKFLOW_VARIANT).map(w => <option key={w} value={w}>{w}</option>)}
                </select>
                <Btn size="sm" onClick={handleAdd}>Add</Btn>
                <Btn variant="ghost" size="sm" onClick={() => { setShowAddForm(false); setNewTitle('') }}>Cancel</Btn>
              </div>
            )}

            <div className={styles.oppList}>
              {set.items.map(opp => (
                <div
                  key={opp.id}
                  onClick={() => setSelectedOppId(opp.id === selectedOppId ? null : opp.id)}
                  className={[styles.oppRow, opp.id === selectedOppId ? styles.oppRowSelected : ''].filter(Boolean).join(' ')}
                >
                  <Tag variant={WORKFLOW_VARIANT[opp.workflow]} style={{ width: 68, justifyContent: 'center' }}>
                    {opp.workflow}
                  </Tag>
                  <div className={styles.oppTitle}>{opp.title}</div>
                  {opp.volume > 0 && <div className={styles.oppVol}>{opp.volume.toLocaleString()} vol</div>}
                  {opp.score > 0 && (
                    <div
                      className={styles.scoreRing}
                      style={{ background: `conic-gradient(${WORKFLOW_COLOR[opp.workflow]} ${opp.score}%, var(--color-border) 0)` }}
                    >
                      <div className={styles.scoreInner}>{opp.score}</div>
                    </div>
                  )}
                  <button
                    className={styles.dismissBtn}
                    onClick={e => dismiss(opp.id, e)}
                    title="Dismiss"
                  >✕</button>
                </div>
              ))}
            </div>

            <div className={styles.ctaRow}>
              <Btn onClick={() => setShowModal(true)}>+ Create Campaign from this Analysis</Btn>
            </div>
          </>
        )}
      </div>

      {selectedOpp && (
        <OppDetailPanel
          opp={selectedOpp}
          onClose={() => setSelectedOppId(null)}
          onUpdate={patch => updateOpp(selectedOpp.id, patch)}
        />
      )}

      {showModal && (
        <NewCampaignModal brands={brands} onCreate={handleCreate} onClose={() => setShowModal(false)} />
      )}
    </>
  )
}

/* ─────────────────────────────────────────────────────────── */
/*  Opportunity detail panel                                   */
/* ─────────────────────────────────────────────────────────── */
function OppDetailPanel({ opp, onClose, onUpdate }) {
  const d = opp.detail ?? {}

  return (
    <div className={styles.oppPanel}>
      <div className={styles.oppPanelHead}>
        <Tag variant={WORKFLOW_VARIANT[opp.workflow]}>{opp.workflow}</Tag>
        <span className={styles.oppPanelTitle}>{opp.title}</span>
        <button className={styles.oppPanelClose} onClick={onClose}>✕</button>
      </div>

      <div className={styles.oppPanelBody}>

        {/* Common metrics */}
        <div className={styles.oppMetricRow}>
          {opp.volume > 0 && (
            <div className={styles.oppMetric}>
              <div className={styles.oppMetricLabel}>Search Volume</div>
              <div className={styles.oppMetricValue}>{opp.volume.toLocaleString()}</div>
              <div className={styles.oppMetricSrc}>SEMrush</div>
            </div>
          )}
          {opp.score > 0 && (
            <div className={styles.oppMetric}>
              <div className={styles.oppMetricLabel}>Impact Score</div>
              <div className={styles.oppMetricValue} style={{ color: WORKFLOW_COLOR[opp.workflow] }}>{opp.score}</div>
              <div className={styles.oppMetricSrc}>AI</div>
            </div>
          )}
          {d.difficulty != null && (
            <div className={styles.oppMetric}>
              <div className={styles.oppMetricLabel}>KW Difficulty</div>
              <div className={styles.oppMetricValue}>{d.difficulty}</div>
              <div className={styles.oppMetricSrc}>SEMrush</div>
            </div>
          )}
          {d.trafficPotential != null && (
            <div className={styles.oppMetric}>
              <div className={styles.oppMetricLabel}>Traffic Potential</div>
              <div className={styles.oppMetricValue}>{d.trafficPotential.toLocaleString()}</div>
              <div className={styles.oppMetricSrc}>SEMrush</div>
            </div>
          )}
          {d.position != null && (
            <div className={styles.oppMetric}>
              <div className={styles.oppMetricLabel}>Avg. Position</div>
              <div className={styles.oppMetricValue}>{d.position}</div>
              <div className={styles.oppMetricSrc}>GSC</div>
            </div>
          )}
          {d.traffic != null && (
            <div className={styles.oppMetric}>
              <div className={styles.oppMetricLabel}>Monthly Traffic</div>
              <div className={styles.oppMetricValue}>{d.traffic.toLocaleString()}</div>
              <div className={styles.oppMetricSrc}>GA</div>
            </div>
          )}
          {d.impressions != null && (
            <div className={styles.oppMetric}>
              <div className={styles.oppMetricLabel}>Impressions</div>
              <div className={styles.oppMetricValue}>{d.impressions.toLocaleString()}</div>
              <div className={styles.oppMetricSrc}>GSC</div>
            </div>
          )}
          {d.ctr != null && (
            <div className={styles.oppMetric}>
              <div className={styles.oppMetricLabel}>CTR</div>
              <div className={styles.oppMetricValue}>{d.ctr}%</div>
              <div className={styles.oppMetricSrc}>GSC</div>
            </div>
          )}
          {d.conversionRate != null && (
            <div className={styles.oppMetric}>
              <div className={styles.oppMetricLabel}>Conv. Rate</div>
              <div className={styles.oppMetricValue}>{d.conversionRate}%</div>
              <div className={styles.oppMetricSrc}>GA</div>
            </div>
          )}
          {d.trend != null && (
            <div className={styles.oppMetric}>
              <div className={styles.oppMetricLabel}>90-day Trend</div>
              <div className={styles.oppMetricValue} style={{ color: d.trend < 0 ? 'var(--color-red)' : 'var(--color-green)' }}>
                {d.trend > 0 ? '+' : ''}{d.trend}%
              </div>
              <div className={styles.oppMetricSrc}>GA</div>
            </div>
          )}
        </div>

        {/* Create-specific */}
        {opp.workflow === 'Create' && (
          <>
            {d.intent && <PanelField label="Search Intent"><span>{d.intent}</span></PanelField>}
            {d.keywords?.length > 0 && (
              <PanelField label="Target Keywords">
                <div className={styles.kwList}>
                  {d.keywords.map(k => <span key={k} className={styles.kwChip}>{k}</span>)}
                </div>
              </PanelField>
            )}
            {d.contentType && <PanelField label="Suggested Content Type"><span>{d.contentType}</span></PanelField>}
            {d.competitor && (
              <PanelField label="Competing Page">
                <span className={styles.urlText}>{d.competitor}</span>
              </PanelField>
            )}
          </>
        )}

        {/* Optimize-specific */}
        {opp.workflow === 'Optimize' && (
          <>
            {d.url && <PanelField label="Page URL"><span className={styles.urlText}>{d.url}</span></PanelField>}
            {d.actions?.length > 0 && (
              <PanelField label="Suggested Actions">
                <ul className={styles.actionList}>
                  {d.actions.map((a, i) => <li key={i} className={styles.actionItem}>{a}</li>)}
                </ul>
              </PanelField>
            )}
          </>
        )}

        {/* Convert-specific */}
        {opp.workflow === 'Convert' && (
          <>
            {d.url && <PanelField label="Page URL"><span className={styles.urlText}>{d.url}</span></PanelField>}
            {d.targetAction && <PanelField label="Target Action"><span>{d.targetAction}</span></PanelField>}
            {d.changes?.length > 0 && (
              <PanelField label="Suggested Changes">
                <ul className={styles.actionList}>
                  {d.changes.map((c, i) => <li key={i} className={styles.actionItem}>{c}</li>)}
                </ul>
              </PanelField>
            )}
          </>
        )}

        {/* Delete-specific */}
        {opp.workflow === 'Delete' && (
          <>
            {d.url && <PanelField label="Page URL"><span className={styles.urlText}>{d.url}</span></PanelField>}
            {d.reason && <PanelField label="Reason"><span>{d.reason}</span></PanelField>}
            {d.action && <PanelField label="Recommended Action"><span className={styles.urlText}>{d.action}</span></PanelField>}
          </>
        )}

        {/* Notes — always shown, editable */}
        <PanelField label="Notes">
          <textarea
            className={styles.oppPanelNotes}
            value={d.notes ?? ''}
            onChange={e => onUpdate({ detail: { ...d, notes: e.target.value } })}
            placeholder="Add notes…"
          />
        </PanelField>

      </div>
    </div>
  )
}

function PanelField({ label, children }) {
  return (
    <div className={styles.panelField}>
      <div className={styles.panelFieldLabel}>{label}</div>
      <div className={styles.panelFieldBody}>{children}</div>
    </div>
  )
}
