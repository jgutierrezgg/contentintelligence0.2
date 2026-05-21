import { useState } from 'react'
import styles from './onboarding.module.css'
import Input from '../primitives/Input'
import Btn from '../primitives/Btn'
import AgentBubble from '../primitives/AgentBubble'
import Tag from '../primitives/Tag'

const STAGES = { URL: 'url', ANALYZING: 'analyzing', PROFILE: 'profile', COMPETITORS: 'competitors' }

const SUGGESTED_COMPETITORS = [
  'hubspot.com', 'mailchimp.com', 'marketo.com', 'pardot.com', 'activecampaign.com',
]

export default function AddBrandFlow({ onAdd, onCancel }) {
  const [stage, setStage] = useState(STAGES.URL)
  const [url, setUrl] = useState('')
  const [extraUrls, setExtraUrls] = useState('')
  const [profile, setProfile] = useState(null)
  const [competitors, setCompetitors] = useState([])
  const [agentMessages, setAgentMessages] = useState([])
  const [typing, setTyping] = useState(false)

  const pushAgent = (text, delay = 1400) => {
    setTyping(true)
    return new Promise(r => setTimeout(() => {
      setTyping(false)
      setAgentMessages(m => [...m, text])
      r()
    }, delay))
  }

  const startAnalysis = async () => {
    setStage(STAGES.ANALYZING)
    await pushAgent(`Crawling ${url} — reading site structure, copy, and meta tags…`)
    await pushAgent('Identifying brand name, industry, products, and tone of voice…', 1600)
    await pushAgent('Building brand profile. Almost there…', 1200)
    const domain = url.replace(/https?:\/\//, '').replace(/\/$/, '')
    const generated = {
      name: domain.split('.')[0].charAt(0).toUpperCase() + domain.split('.')[0].slice(1),
      url,
      industry: 'Marketing Technology',
      valueProposition: 'AI-powered content and campaign management for modern marketing teams.',
      tone: 'Professional, data-driven, innovative',
      products: ['Content Intelligence', 'Campaign Automation', 'Analytics Dashboard'],
    }
    setProfile(generated)
    setStage(STAGES.PROFILE)
    await pushAgent(`Done! Here's what I found for **${generated.name}**. Review the profile and confirm to continue.`)
  }

  const confirmProfile = async () => {
    setStage(STAGES.COMPETITORS)
    await pushAgent('Great! Now let me suggest competitors based on your industry and positioning…', 1000)
    await pushAgent(`I found ${SUGGESTED_COMPETITORS.length} potential competitors. Select the ones that are relevant.`, 1200)
    setCompetitors(SUGGESTED_COMPETITORS.map(c => ({ domain: c, selected: true })))
  }

  const finalize = () => {
    onAdd({
      id: Date.now(),
      ...profile,
      competitors: competitors.filter(c => c.selected).map(c => c.domain),
    })
  }

  const toggleCompetitor = (i) =>
    setCompetitors(prev => prev.map((x, j) => j === i ? { ...x, selected: !x.selected } : x))

  return (
    <div className={styles.urlForm}>
      {/* Agent chat */}
      <div className={styles.agentChat}>
        {agentMessages.length === 0 && !typing && (
          <p className={styles.agentEmpty}>
            The AI agent will analyze your brand once you provide a URL.
          </p>
        )}
        {agentMessages.map((msg, i) => <AgentBubble key={i} text={msg} />)}
        {typing && <AgentBubble typing />}
      </div>

      {/* URL entry */}
      {stage === STAGES.URL && (
        <>
          <Input value={url} onChange={setUrl} placeholder="Brand website URL (e.g. https://example.com)" />
          <Input value={extraUrls} onChange={setExtraUrls} placeholder="Additional URLs (optional, comma-separated)" />
          <div className={styles.urlActions}>
            <Btn onClick={startAnalysis} disabled={!url.trim()}>Analyze brand</Btn>
            <Btn variant="ghost" onClick={onCancel}>Cancel</Btn>
          </div>
        </>
      )}

      {/* Analyzing */}
      {stage === STAGES.ANALYZING && (
        <p className={styles.analyzingText}>Analyzing…</p>
      )}

      {/* Profile review */}
      {stage === STAGES.PROFILE && profile && (
        <>
          <div className={styles.profileCard}>
            <ProfileRow label="Name"              value={profile.name} />
            <ProfileRow label="Industry"          value={profile.industry} />
            <ProfileRow label="Value Proposition" value={profile.valueProposition} />
            <ProfileRow label="Tone"              value={profile.tone} />
            <ProfileRow label="Products"          value={profile.products.join(', ')} />
          </div>
          <div className={styles.profileActions}>
            <Btn onClick={confirmProfile}>Confirm profile →</Btn>
            <Btn variant="secondary" size="sm" onClick={() => setStage(STAGES.URL)}>Edit URL</Btn>
          </div>
        </>
      )}

      {/* Competitor selection */}
      {stage === STAGES.COMPETITORS && (
        <>
          <div className={styles.competitorList}>
            {competitors.map((c, i) => (
              <Tag
                key={c.domain}
                variant={c.selected ? 'green' : 'default'}
                onClick={() => toggleCompetitor(i)}
                className={[styles.competitorTag, c.selected ? styles.selected : ''].filter(Boolean).join(' ')}
              >
                {c.selected ? '✓ ' : ''}{c.domain}
              </Tag>
            ))}
          </div>
          <div className={styles.competitorActions}>
            <Btn onClick={finalize}>Add brand →</Btn>
          </div>
        </>
      )}
    </div>
  )
}

function ProfileRow({ label, value }) {
  return (
    <div className={styles.profileRow}>
      <span className={styles.profileLabel}>{label}</span>
      <span className={styles.profileValue}>{value}</span>
    </div>
  )
}
