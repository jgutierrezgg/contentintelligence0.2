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

export default function OpportunitiesView({ opportunities, onUpdate, brands, onCreateCampaign, onGoToCampaigns }) {
  const { objectives = [], isProcessed = false, items = [] } = opportunities ?? {}

  const [localObjectives, setLocalObjectives] = useState(objectives)
  const [running, setRunning]                 = useState(false)
  const [showAddForm, setShowAddForm]         = useState(false)
  const [newTitle, setNewTitle]               = useState('')
  const [newWorkflow, setNewWorkflow]         = useState('Create')
  const [showModal, setShowModal]             = useState(false)

  const toggleObjective = (id) =>
    setLocalObjectives(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

  const handleRunAnalysis = () => {
    onUpdate({ objectives: localObjectives })
    setRunning(true)
  }

  const handleAnalysisComplete = () => {
    setRunning(false)
    onUpdate({ isProcessed: true, items: MOCK_OPPORTUNITIES })
  }

  const dismiss = (id) => onUpdate({ items: items.filter(i => i.id !== id) })

  const handleRerun = () => {
    onUpdate({ isProcessed: false, items: [] })
    setRunning(false)
    setLocalObjectives(objectives)
  }

  const handleAddOpportunity = () => {
    if (!newTitle.trim()) return
    onUpdate({
      items: [...items, {
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
      <div className={styles.viewHeader}>
        <h1 className={styles.viewTitle}>Opportunities</h1>
        <p className={styles.viewSubtitle}>Discover and manage content opportunities across your workspace.</p>
      </div>

      {!isProcessed && !running && (
        <div className={styles.setupCard}>
          <div className={styles.setupLabel}>Select objectives to analyze</div>
          <div className={styles.objectiveTags}>
            {OBJECTIVES.map(obj => (
              <span
                key={obj.id}
                onClick={() => toggleObjective(obj.id)}
                className={[
                  styles.objectiveTag,
                  localObjectives.includes(obj.id) ? styles.objectiveTagSelected : '',
                ].filter(Boolean).join(' ')}
              >
                {localObjectives.includes(obj.id) && <span className={styles.checkMark}>✓</span>}
                {obj.label}
              </span>
            ))}
          </div>
          <Btn onClick={handleRunAnalysis} disabled={localObjectives.length === 0}>
            Run Analysis →
          </Btn>
        </div>
      )}

      {running && (
        <div className={styles.processBox}>
          <AutoProcess steps={ANALYSIS_STEPS} onComplete={handleAnalysisComplete} />
        </div>
      )}

      {isProcessed && !running && (
        <>
          <div className={styles.resultsBar}>
            <span className={styles.resultsCount}>{items.length} opportunities found</span>
            <div className={styles.resultsActions}>
              <Btn variant="secondary" size="sm" onClick={() => setShowAddForm(f => !f)}>
                + Add Opportunity
              </Btn>
              <Btn variant="ghost" size="sm" onClick={handleRerun}>↺ Re-run</Btn>
            </div>
          </div>

          {showAddForm && (
            <div className={styles.addForm}>
              <input
                className={styles.addInput}
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddOpportunity()}
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
              <Btn size="sm" onClick={handleAddOpportunity}>Add</Btn>
              <Btn variant="ghost" size="sm" onClick={() => { setShowAddForm(false); setNewTitle('') }}>Cancel</Btn>
            </div>
          )}

          <div className={styles.oppList}>
            {items.map(opp => (
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
            <Btn onClick={() => setShowModal(true)}>+ Create Campaign from Opportunities</Btn>
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
