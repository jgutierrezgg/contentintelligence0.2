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

const INITIAL_ITEMS = [
  {
    id: 'b1', type: 'brief', week: 1, status: 'Done', linkedId: 'c1',
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
    id: 'c1', type: 'content', week: 1, status: 'In Progress', linkedId: 'b1',
    title: 'Ultimate Guide to Content Strategy',
    body: '',
  },
  {
    id: 'b2', type: 'brief', week: 1, status: 'In Progress', linkedId: null,
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
    id: 'c2', type: 'content', week: 2, status: 'Pending', linkedId: null,
    title: 'How to Improve Organic Rankings',
    body: '',
  },
  {
    id: 'b3', type: 'brief', week: 2, status: 'Pending', linkedId: 'c3',
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
    id: 'c3', type: 'content', week: 2, status: 'Pending', linkedId: 'b3',
    title: 'Landing Page Optimization Tips',
    body: '',
  },
  {
    id: 'c4', type: 'content', week: 3, status: 'Pending', linkedId: null,
    title: 'Product Comparison Page',
    body: '',
  },
]

export default function CampaignContentPlan({ onApprove }) {
  const [planDone, setPlanDone]   = useState(false)
  const [approved, setApproved]   = useState(false)
  const [items, setItems]         = useState(INITIAL_ITEMS)
  const [selectedId, setSelectedId] = useState(null)
  const [dragOver, setDragOver]   = useState(null)
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
      const targetWeek = arr[toIdx].week
      const [moved] = arr.splice(fromIdx, 1)
      moved.week = targetWeek
      const insertAt = arr.findIndex(i => i.id === targetId)
      arr.splice(insertAt, 0, moved)
      return arr
    })
  }

  if (approved) return <div className={styles.approved}>✓ Content plan approved — execution underway.</div>

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
                    {items.filter(i => i.week === week).map(item => {
                      const linked = items.find(i => i.id === item.linkedId)
                      return (
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
                            item.id === selectedId ? styles.planRowSelected : '',
                            item.id === dragOver   ? styles.planRowDragOver : '',
                          ].filter(Boolean).join(' ')}
                        >
                          <span className={styles.dragHandle}>⠿</span>
                          <span className={item.type === 'brief' ? styles.typeBrief : styles.typeContent}>
                            {item.type === 'brief' ? 'Brief' : 'Content'}
                          </span>
                          <span className={styles.planRowTitle}>{item.title}</span>
                          <div className={styles.planRowMeta}>
                            {linked && (
                              <span
                                className={styles.linkIndicator}
                                title={`Linked to ${linked.type}: ${linked.title}`}
                              >⇄</span>
                            )}
                            <StatusPill status={item.status} />
                          </div>
                        </div>
                      )
                    })}
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
          linked={items.find(i => i.id === selected.linkedId)}
          onClose={() => setSelectedId(null)}
          onUpdate={patch => updateItem(selected.id, patch)}
          onGoToLinked={() => setSelectedId(selected.linkedId)}
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

function DetailPanel({ item, linked, onClose, onUpdate, onGoToLinked }) {
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

        {linked && (
          <Field label={`Linked ${linked.type === 'brief' ? 'Brief' : 'Content'}`}>
            <button className={styles.linkedChip} onClick={onGoToLinked}>
              <span className={linked.type === 'brief' ? styles.typeBrief : styles.typeContent}>
                {linked.type === 'brief' ? 'Brief' : 'Content'}
              </span>
              <span className={styles.linkedChipTitle}>{linked.title}</span>
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
