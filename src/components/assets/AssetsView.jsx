import { useState } from 'react'
import styles from './assets.module.css'
import Btn from '../primitives/Btn'
import Tag from '../primitives/Tag'

const ASSET_TYPES = [
  'Blog Post', 'Landing Page', 'Guide', 'Email',
  'eBook', 'Case Study', 'Infographic', 'Social Post', 'Video', 'Webinar',
  'Brief', 'Content',
]

const TYPE_VARIANT = {
  'Blog Post':    'accent',
  'Landing Page': 'blue',
  'Guide':        'green',
  'Email':        'orange',
  'eBook':        'green',
  'Case Study':   'blue',
  'Infographic':  'accent',
  'Social Post':  'orange',
  'Video':        'red',
  'Webinar':      'blue',
  'Brief':        'blue',
  'Content':      'accent',
}

const TABS = [
  { id: 'all',       label: 'All'     },
  { id: 'published', label: 'On Site' },
  { id: 'draft',     label: 'Drafts'  },
]

function deriveCampaignAssets(campaigns) {
  return (campaigns ?? []).flatMap(c =>
    (c.planItems ?? []).map(item => ({
      _source: 'campaign',
      id: `${c.id}__${item.id}`,
      title: item.title,
      type: item.type === 'brief' ? 'Brief' : 'Content',
      status: item.status === 'Done' ? 'published' : 'draft',
      url: null,
      brandName: null,
      campaignId: c.id,
      campaignName: c.name,
      updatedAt: 0,
    }))
  )
}

export default function AssetsView({ assets, onUpdateAssets, brands, campaigns }) {
  const [tab, setTab]               = useState('all')
  const [search, setSearch]         = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [showForm, setShowForm]     = useState(false)

  const campaignAssets = deriveCampaignAssets(campaigns)
  const allAssets      = [...assets, ...campaignAssets]

  const filtered = allAssets.filter(a => {
    if (tab === 'published' && a.status !== 'published') return false
    if (tab === 'draft'     && a.status !== 'draft')     return false
    if (typeFilter && a.type !== typeFilter)              return false
    if (search && !a.title.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const counts = {
    all:       allAssets.length,
    published: allAssets.filter(a => a.status === 'published').length,
    draft:     allAssets.filter(a => a.status === 'draft').length,
  }

  const addAsset = (asset) => {
    onUpdateAssets([
      { ...asset, id: `a_${Date.now()}`, createdAt: Date.now(), updatedAt: Date.now() },
      ...assets,
    ])
    setShowForm(false)
  }

  const removeAsset = (id) => onUpdateAssets(assets.filter(a => a.id !== id))

  return (
    <div className={styles.view}>
      <div className={styles.viewHeader}>
        <div>
          <h1 className={styles.viewTitle}>Assets</h1>
          <p className={styles.viewSubtitle}>All brand content — drafts and pages live on the site.</p>
        </div>
        {!showForm && <Btn onClick={() => setShowForm(true)}>+ Add Asset</Btn>}
      </div>

      {showForm && (
        <AddAssetForm
          brands={brands}
          campaigns={campaigns}
          onSubmit={addAsset}
          onCancel={() => setShowForm(false)}
        />
      )}

      <div className={styles.filterRow}>
        <div className={styles.tabs}>
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={[styles.tab, tab === t.id ? styles.tabActive : ''].filter(Boolean).join(' ')}
            >
              {t.label}
              <span className={styles.tabCount}>{counts[t.id]}</span>
            </button>
          ))}
        </div>
        <div className={styles.filterControls}>
          <input
            className={styles.searchInput}
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search…"
          />
          <select
            className={styles.typeSelect}
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
          >
            <option value="">All types</option>
            {ASSET_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>◫</div>
          <div className={styles.emptyText}>
            {allAssets.length === 0
              ? 'No assets yet. Assets created in campaign planning will appear here automatically.'
              : 'No assets match your filters.'}
          </div>
          {allAssets.length === 0 && (
            <Btn onClick={() => setShowForm(true)}>Add your first asset</Btn>
          )}
        </div>
      ) : (
        <div className={styles.assetList}>
          {filtered.map(asset => (
            <AssetRow
              key={asset.id}
              asset={asset}
              campaigns={campaigns}
              onRemove={asset._source === 'campaign' ? null : () => removeAsset(asset.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────── */
/*  Asset row                                                   */
/* ─────────────────────────────────────────────────────────── */
function AssetRow({ asset, campaigns, onRemove }) {
  const linkedCampaign = asset._source !== 'campaign'
    ? campaigns?.find(c => c.id === asset.campaignId)
    : null
  const date = asset.updatedAt
    ? new Date(asset.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : null

  return (
    <div className={styles.assetRow}>
      <Tag
        variant={TYPE_VARIANT[asset.type] ?? 'accent'}
        className={styles.typeTag}
      >
        {asset.type}
      </Tag>

      <div className={styles.assetMain}>
        <span className={styles.assetTitle}>{asset.title}</span>
        {asset.url && <span className={styles.assetUrl}>{asset.url}</span>}
      </div>

      <div className={styles.assetMeta}>
        {asset.brandName && <Tag>{asset.brandName}</Tag>}
        {asset.campaignName && (
          <Tag variant="accent">{asset.campaignName}</Tag>
        )}
        {linkedCampaign && !asset.campaignName && (
          <Tag variant="accent">{linkedCampaign.name}</Tag>
        )}
      </div>

      {date && <span className={styles.assetDate}>{date}</span>}

      <Tag variant={asset.status === 'published' ? 'green' : 'orange'}>
        {asset.status === 'published' ? 'On Site' : 'Draft'}
      </Tag>

      {onRemove ? (
        <button
          className={styles.removeBtn}
          onClick={e => { e.stopPropagation(); onRemove() }}
          title="Remove"
        >✕</button>
      ) : (
        <span className={styles.removeBtn} style={{ opacity: 0, pointerEvents: 'none' }}>✕</span>
      )}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────── */
/*  Add asset form                                             */
/* ─────────────────────────────────────────────────────────── */
function AddAssetForm({ brands, campaigns, onSubmit, onCancel }) {
  const [title, setTitle]           = useState('')
  const [type, setType]             = useState('Blog Post')
  const [status, setStatus]         = useState('draft')
  const [url, setUrl]               = useState('')
  const [brandName, setBrandName]   = useState('')
  const [campaignId, setCampaignId] = useState('')

  const canSubmit = title.trim()

  const handleSubmit = () => {
    onSubmit({
      title:      title.trim(),
      type,
      status,
      url:        url.trim() || null,
      brandName:  brandName  || null,
      campaignId: campaignId || null,
    })
  }

  return (
    <div className={styles.addForm}>
      <div className={styles.addFormGrid}>

        <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
          <div className={styles.formLabel}>Title</div>
          <input
            className={styles.formInput}
            value={title}
            onChange={e => setTitle(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && canSubmit) handleSubmit() }}
            placeholder="Asset title…"
            autoFocus
          />
        </div>

        <div className={styles.formGroup}>
          <div className={styles.formLabel}>Type</div>
          <select className={styles.formSelect} value={type} onChange={e => setType(e.target.value)}>
            {ASSET_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div className={styles.formGroup}>
          <div className={styles.formLabel}>Status</div>
          <div className={styles.statusToggle}>
            {[['draft', 'Draft'], ['published', 'On Site']].map(([val, label]) => (
              <button
                key={val}
                onClick={() => setStatus(val)}
                className={[styles.statusBtn, status === val ? styles.statusBtnActive : ''].filter(Boolean).join(' ')}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {status === 'published' && (
          <div className={styles.formGroup}>
            <div className={styles.formLabel}>URL</div>
            <input
              className={styles.formInput}
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="/blog/your-article"
            />
          </div>
        )}

        {brands?.length > 0 && (
          <div className={styles.formGroup}>
            <div className={styles.formLabel}>Brand</div>
            <select className={styles.formSelect} value={brandName} onChange={e => setBrandName(e.target.value)}>
              <option value="">No brand</option>
              {brands.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
            </select>
          </div>
        )}

        {campaigns?.length > 0 && (
          <div className={styles.formGroup}>
            <div className={styles.formLabel}>Campaign</div>
            <select className={styles.formSelect} value={campaignId} onChange={e => setCampaignId(e.target.value)}>
              <option value="">No campaign</option>
              {campaigns.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        )}

      </div>

      <div className={styles.formActions}>
        <Btn variant="secondary" onClick={onCancel}>Cancel</Btn>
        <Btn onClick={handleSubmit} disabled={!canSubmit}>Add Asset</Btn>
      </div>
    </div>
  )
}
