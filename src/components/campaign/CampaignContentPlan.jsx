import { useState, useRef } from 'react'
import styles from './campaign.module.css'
import AutoProcess from '../primitives/AutoProcess'
import { PhaseHeader, ApprovalGate } from './CampaignResearch'

const PLAN_STEPS = [
  'Sorting opportunities by impact score…',
  'Assigning content to weekly schedule…',
  'Generating structured content plan…',
]

const STATUSES = ['Pending', 'In Progress', 'Done']

// Brief → linkedIds: string[]   (one brief can be linked to many content pieces)
// Content → linkedId: string|null  (one content is linked to at most one brief)
const INITIAL_ITEMS = [
  {
    id: 'b1', type: 'brief', week: 1, status: 'Done',
    linkedIds: ['c1', 'c5'],
    title: 'Ultimate Guide to Content Strategy',
    objective: 'Rank for high-volume content strategy keywords and establish thought leadership.',
    keywords: ['content strategy', 'content marketing guide', 'content planning'],
    outline: [
      'What is a content strategy?',
      'Key components of an effective strategy',
      'Building your content calendar',
      'Measuring success with KPIs',
    ],
    notes: 'Target 3,000+ words. Include an infographic and a downloadable template.',
  },
  {
    id: 'c1', type: 'content', week: 1, status: 'In Progress',
    linkedId: 'b1',
    title: 'Ultimate Guide to Content Strategy',
    body: '',
  },
  {
    id: 'c5', type: 'content', week: 1, status: 'Pending',
    linkedId: 'b1',
    title: 'Content Strategy — Case Studies',
    body: '',
  },
  {
    id: 'b2', type: 'brief', week: 1, status: 'In Progress',
    linkedIds: [],
    title: 'Email Marketing Best Practices',
    objective: 'Capture email marketing keywords and drive newsletter signups.',
    keywords: ['email marketing', 'email best practices', 'email campaigns'],
    outline: [
      'Subject line optimization techniques',
      'List segmentation strategies',
      'A/B testing cadence',
      'Key metrics to track',
    ],
    notes: 'Focus on B2B email marketing angle. Cross-link to landing page article.',
  },
  {
    id: 'c2', type: 'content', week: 2, status: 'Pending',
    linkedId: null,
    title: 'How to Improve Organic Rankings',
    body: '',
  },
  {
    id: 'b3', type: 'brief', week: 2, status: 'Pending',
    linkedIds: ['c3'],
    title: 'Landing Page Optimization Tips',
    objective: 'Target CRO and landing page keywords to attract bottom-of-funnel traffic.',
    keywords: ['landing page optimization', 'conversion rate optimization', 'CRO tips'],
    outline: [
      'Above-the-fold design principles',
      'CTA placement and copy',
      'Form length and friction reduction',
      'A/B testing methodology',
    ],
    notes: '',
  },
  {
    id: 'c3', type: 'content', week: 2, status: 'Pending',
    linkedId: 'b3',
    title: 'Landing Page Optimization Tips',
    body: '',
  },
  {
    id: 'c4', type: 'content', week: 3, status: 'Pending',
    linkedId: null,
    title: 'Product Comparison Page',
    body: '',
  },
]

function hasLinks(item) {
  return item.type === 'brief'
    ? item.linkedIds?.length > 0
    : item.linkedId !== null
}

export default function CampaignContentPlan({ onApprove }) {
  const [planDone, setPlanDone]     = useState(false)
  const [approved, setApproved]     = useState(false)
  const [items, setItems]           = useState(INITIAL_ITEMS)
  const [selectedId, setSelectedId] = useState(null)
  const [dragOver, setDragOver]     = useState(null)
  const dragging = useRef(null)

  const selected = items.find(i => i.id === selectedId) ?? null
  const weeks    = [...new Set(items.map(i => i.week))].sort((a, b) => a - b)

  const updateItem = (id, patch) =>
    setItems(prev => prev.map(i => i.id === id ? { ...i, ...patch } : i))

  const onDragStart = (e, id) => {
    dragging.current = id
    e.dataTransfer.effectAllowed = 'move'
  }
  const onDragOver = (e, id) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOver(id)
  }
  const onDrop = (e, targetId) => {
    e.preventDefault()
    const fromId = dragging.current
    dragging.current = null
    setDragOver(null)
    if (!fromId || fromId === targetId) return
    setItems(prev => {
      const arr = [...prev]
      const fromIdx = arr.findIndex(i => i.id === fromId)
      const toIdx   = arr.findIndex(i => i.id === targetId)
      const [moved] = arr.splice(fromIdx, 1)
      moved.week    = arr[Math.min(toIdx, arr.length - 1)]?.week ?? moved.week
      const insertAt = arr.findIndex(i => i.id === targetId)
      arr.splice(insertAt < 0 ? arr.length : insertAt, 0, moved)
      return arr
    })
  }

  if (approved) return <div className={styles.approved}>✓ Content plan approved — execution underway.</div>

  // Resolve linked items for the selected panel
  const linkedItems = selected
    ? selected.type === 'brief'
      ? (selected.linkedIds ?? []).map(id => items.find(i => i.id === id)).filter(Boolean)
      : items.filter(i => i.id === selected.linkedId)
    : []

  return (
    <>
      <div className={styles.phaseStack}>
        <PhaseHeader
          icon="🟢"
          title="Content Plan"
          subtitle="Opportunities sorted by impact and assigned to a weekly execution schedule."
        />

        {!planDone ? (
          <AutoProcess steps={PLAN_STEPS} onComplete={() => setPlanDone(true)} />
        ) : (
          <>
            <div className={styles.weekSection}>
              {weeks.map(week => (
                <div key={week}>
                  <div className={styles.weekLabel}>Week {week}</div>
                  <div className={styles.planItems}>
                    {items.filter(i => i.week === week).map(item => (
                      <div
                        key={item.id}
                        draggable
                        onDragStart={e => onDragStart(e, item.id)}
                        onDragOver={e => onDragOver(e, item.id)}
                        onDragLeave={() => setDragOver(null)}
                        onDrop={e => onDrop(e, item.id)}
                        onDragEnd={() => { setDragOver(null); dragging.current = null }}
                        onClick={() => setSelectedId(item.id === selectedId ? null : item.id)}
                        className={[
                          styles.planRow,
                          item.id === selectedId ? styles.planRowSelected  : '',
                          item.id === dragOver   ? styles.planRowDragOver  : '',
                        ].filter(Boolean).join(' ')}
                      >
                        <span className={styles.dragHandle}>⠿</span>
                        <span className={item.type === 'brief' ? styles.typeBrief : styles.typeContent}>
                          {item.type === 'brief' ? 'Brief' : 'Content'}
                        </span>
                        <span className={styles.planRowTitle}>{item.title}</span>
                        <div className={styles.planRowMeta}>
                          {hasLinks(item) && (
                            <span
                              className={styles.linkIndicator}
                              title={
                                item.type === 'brief'
                                  ? `${item.linkedIds.length} linked content piece${item.linkedIds.length !== 1 ? 's' : ''}`
                                  : 'Linked to brief'
                              }
                            >
                              {item.type === 'brief' && item.linkedIds.length > 1
                                ? `⇄ ${item.linkedIds.length}`
                                : '⇄'}
                            </span>
                          )}
                          <StatusPill status={item.status} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <ApprovalGate
              label={`Approve ${items.length} items to begin execution`}
              onApprove={() => { setApproved(true); onApprove?.() }}
            />
          </>
        )}
      </div>

      {selected && (
        <DetailPanel
          item={selected}
          linkedItems={linkedItems}
          onClose={() => setSelectedId(null)}
          onUpdate={patch => updateItem(selected.id, patch)}
          onGoTo={id => setSelectedId(id)}
        />
      )}
    </>
  )
}

function StatusPill({ status }) {
  const cls = {
    'Pending':     styles.statusPending,
    'In Progress': styles.statusInProgress,
    'Done':        styles.statusDone,
  }[status] ?? styles.statusPending
  return <span className={[styles.statusPill, cls].join(' ')}>{status}</span>
}

function DetailPanel({ item, linkedItems, onClose, onUpdate, onGoTo }) {
  return (
    <div className={styles.detailPanel}>
      <div className={styles.detailPanelHead}>
        <span className={item.type === 'brief' ? styles.typeBrief : styles.typeContent}>
          {item.type === 'brief' ? 'Brief' : 'Content'}
        </span>
        <span className={styles.detailPanelHeadTitle}>{item.title}</span>
        <button className={styles.detailPanelClose} onClick={onClose}>✕</button>
      </div>

      <div className={styles.detailPanelBody}>
        <Field label="Title">
          <input
            className={styles.fieldInput}
            value={item.title}
            onChange={e => onUpdate({ title: e.target.value })}
          />
        </Field>

        <Field label="Status">
          <div className={styles.statusSelector}>
            {STATUSES.map(s => (
              <button
                key={s}
                onClick={() => onUpdate({ status: s })}
                className={[styles.statusOption, item.status === s ? styles.statusOptionActive : ''].filter(Boolean).join(' ')}
              >
                {s}
              </button>
            ))}
          </div>
        </Field>

        {/* Brief → list of linked content pieces */}
        {item.type === 'brief' && linkedItems.length > 0 && (
          <Field label={`Linked Content (${linkedItems.length})`}>
            <div className={styles.linkedList}>
              {linkedItems.map(c => (
                <button key={c.id} className={styles.linkedChip} onClick={() => onGoTo(c.id)}>
                  <span className={styles.typeContent}>Content</span>
                  <span className={styles.linkedChipTitle}>{c.title}</span>
                  <StatusPill status={c.status} />
                  <span className={styles.linkedChipArrow}>→</span>
                </button>
              ))}
            </div>
          </Field>
        )}

        {/* Content → single linked brief */}
        {item.type === 'content' && linkedItems.length > 0 && (
          <Field label="Linked Brief">
            <button className={styles.linkedChip} onClick={() => onGoTo(linkedItems[0].id)}>
              <span className={styles.typeBrief}>Brief</span>
              <span className={styles.linkedChipTitle}>{linkedItems[0].title}</span>
              <span className={styles.linkedChipArrow}>→</span>
            </button>
          </Field>
        )}

        {item.type === 'brief' && (
          <>
            <Field label="Objective">
              <textarea
                className={styles.fieldTextarea}
                value={item.objective ?? ''}
                onChange={e => onUpdate({ objective: e.target.value })}
              />
            </Field>

            <Field label="Target Keywords">
              <input
                className={styles.fieldInput}
                value={item.keywords?.join(', ') ?? ''}
                onChange={e => onUpdate({ keywords: e.target.value.split(',').map(k => k.trim()).filter(Boolean) })}
                placeholder="keyword one, keyword two…"
              />
            </Field>

            {item.outline?.length > 0 && (
              <Field label="Outline">
                <div className={styles.outlineList}>
                  {item.outline.map((pt, i) => (
                    <div key={i} className={styles.outlineItem}>
                      <span className={styles.outlineDot} />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </Field>
            )}

            <Field label="Notes">
              <textarea
                className={styles.fieldTextarea}
                value={item.notes ?? ''}
                onChange={e => onUpdate({ notes: e.target.value })}
                placeholder="Additional notes…"
              />
            </Field>
          </>
        )}

        {item.type === 'content' && (
          <Field label={item.body?.trim() ? `Draft · ${item.body.trim().split(/\s+/).length} words` : 'Draft'}>
            <textarea
              className={styles.fieldDraft}
              value={item.body ?? ''}
              onChange={e => onUpdate({ body: e.target.value })}
              placeholder="Start writing or paste content here…"
            />
          </Field>
        )}
      </div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div className={styles.field}>
      <div className={styles.fieldLabel}>{label}</div>
      {children}
    </div>
  )
}
