import { useState, useEffect } from 'react'
import { C } from '../../constants/colors'
import Input from '../primitives/Input'
import Btn from '../primitives/Btn'
import AgentBubble from '../primitives/AgentBubble'
import Tag from '../primitives/Tag'

const STAGES = {
  URL: 'url',
  ANALYZING: 'analyzing',
  PROFILE: 'profile',
  COMPETITORS: 'competitors',
  DONE: 'done',
}

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
    const brand = {
      id: Date.now(),
      ...profile,
      competitors: competitors.filter(c => c.selected).map(c => c.domain),
    }
    onAdd(brand)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Agent chat */}
      <div style={{
        background: C.surfaceHigh, borderRadius: 10,
        border: `1px solid ${C.border}`, padding: 16,
        maxHeight: 260, overflowY: 'auto',
      }}>
        {agentMessages.length === 0 && !typing && (
          <p style={{ color: C.textMuted, fontSize: 13 }}>
            The AI agent will analyze your brand once you provide a URL.
          </p>
        )}
        {agentMessages.map((msg, i) => (
          <AgentBubble key={i} text={msg} />
        ))}
        {typing && <AgentBubble typing />}
      </div>

      {/* Stage: URL entry */}
      {stage === STAGES.URL && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Input value={url} onChange={setUrl} placeholder="Brand website URL (e.g. https://example.com)" />
          <Input value={extraUrls} onChange={setExtraUrls} placeholder="Additional URLs (optional, comma-separated)" />
          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <Btn onClick={startAnalysis} disabled={!url.trim()}>Analyze brand</Btn>
            <Btn variant="ghost" onClick={onCancel}>Cancel</Btn>
          </div>
        </div>
      )}

      {/* Stage: analyzing — no UI, agent chat handles it */}
      {stage === STAGES.ANALYZING && (
        <div style={{ color: C.textMuted, fontSize: 13 }}>Analyzing…</div>
      )}

      {/* Stage: profile review */}
      {stage === STAGES.PROFILE && profile && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{
            background: C.surface, border: `1px solid ${C.border}`,
            borderRadius: 8, padding: 14,
          }}>
            <Row label="Name" value={profile.name} />
            <Row label="Industry" value={profile.industry} />
            <Row label="Value Proposition" value={profile.valueProposition} />
            <Row label="Tone" value={profile.tone} />
            <Row label="Products" value={profile.products.join(', ')} />
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Btn onClick={confirmProfile}>Confirm profile →</Btn>
            <Btn variant="secondary" size="sm" onClick={() => setStage(STAGES.URL)}>Edit URL</Btn>
          </div>
        </div>
      )}

      {/* Stage: competitor validation */}
      {stage === STAGES.COMPETITORS && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {competitors.map((c, i) => (
              <Tag
                key={c.domain}
                color={c.selected ? C.green : C.textMuted}
                bg={c.selected ? `${C.green}15` : C.surfaceHigh}
                style={{ cursor: 'pointer', border: `1px solid ${c.selected ? C.green + '44' : C.border}` }}
              >
                <span onClick={() => setCompetitors(prev => prev.map((x, j) => j === i ? { ...x, selected: !x.selected } : x))}>
                  {c.selected ? '✓ ' : ''}{c.domain}
                </span>
              </Tag>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Btn onClick={finalize}>Add brand →</Btn>
          </div>
        </div>
      )}
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div style={{ display: 'flex', gap: 12, marginBottom: 8, fontSize: 13 }}>
      <span style={{ color: C.textMuted, width: 140, flexShrink: 0 }}>{label}</span>
      <span style={{ color: C.text }}>{value}</span>
    </div>
  )
}
