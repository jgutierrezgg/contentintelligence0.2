import { useState } from 'react'
import styles from './App.module.css'
import Login from './components/auth/Login'
import AppShell from './components/layout/AppShell'
import StepWorkspace from './components/onboarding/StepWorkspace'
import StepBrands from './components/onboarding/StepBrands'
import StepConnections from './components/onboarding/StepConnections'
import Dashboard from './components/dashboard/Dashboard'
import BrandsView from './components/dashboard/BrandsView'
import ConnectionsView from './components/dashboard/ConnectionsView'
import CampaignDetail from './components/campaign/CampaignDetail'

const ONBOARDING_STEPS = ['workspace', 'brands', 'connections']

const BLANK_ONBOARDING = {
  active: true,
  step: 'workspace',
  name: null,
  brands: [],
  connections: { ga: false, gsc: false, semrush: false },
}

const INITIAL_STATE = {
  workspaces: [],
  activeWsId: null,
  onboarding: BLANK_ONBOARDING,
}

function loadState() {
  try {
    const raw = localStorage.getItem('ci_state')
    if (!raw) return null
    const s = JSON.parse(raw)
    // Migrate old format (had workspace/brands/campaigns/connections at root)
    if (s && !s.workspaces) {
      if (s.onboardingDone && s.workspace) {
        const ws = {
          id: Date.now(),
          name: s.workspace,
          brands: s.brands ?? [],
          campaigns: s.campaigns ?? [],
          connections: s.connections ?? { ga: false, gsc: false, semrush: false },
        }
        return { workspaces: [ws], activeWsId: ws.id, onboarding: { ...BLANK_ONBOARDING, active: false } }
      }
      return null
    }
    return s
  } catch { return null }
}

function saveState(state) {
  try { localStorage.setItem('ci_state', JSON.stringify(state)) } catch {}
}

function loadSession() {
  try { return sessionStorage.getItem('ci_session') === 'ok' } catch { return false }
}

export default function App() {
  const [authed, setAuthed] = useState(loadSession)
  const [state, setState] = useState(() => loadState() ?? INITIAL_STATE)
  const [view, setView] = useState('campaigns')
  const [selectedCampaign, setSelectedCampaign] = useState(null)

  if (!authed) {
    return (
      <Login onAuthenticated={() => {
        try { sessionStorage.setItem('ci_session', 'ok') } catch {}
        setAuthed(true)
      }} />
    )
  }

  const update = (patch) => {
    setState(s => {
      const next = { ...s, ...patch }
      saveState(next)
      return next
    })
  }

  const updateOnboarding = (patch) =>
    setState(s => {
      const next = { ...s, onboarding: { ...s.onboarding, ...patch } }
      saveState(next)
      return next
    })

  // ── Onboarding handlers ──────────────────────────────────────────────────
  const handleWorkspaceName = (name) => updateOnboarding({ name, step: 'brands' })
  const handleBrands = (brands) => updateOnboarding({ brands, step: 'connections' })
  const handleConnections = (connected) => {
    setState(s => {
      const ws = {
        id: Date.now(),
        name: s.onboarding.name,
        brands: s.onboarding.brands,
        campaigns: [],
        connections: {
          ga: !!connected.ga,
          gsc: !!connected.gsc,
          semrush: !!connected.semrush,
        },
      }
      const next = {
        ...s,
        workspaces: [...s.workspaces, ws],
        activeWsId: ws.id,
        onboarding: { ...BLANK_ONBOARDING, active: false },
      }
      saveState(next)
      return next
    })
    setView('campaigns')
    setSelectedCampaign(null)
  }

  if (state.onboarding.active) {
    return (
      <OnboardingShell step={state.onboarding.step}>
        {state.onboarding.step === 'workspace'   && <StepWorkspace   onNext={handleWorkspaceName} />}
        {state.onboarding.step === 'brands'      && <StepBrands      onNext={handleBrands} />}
        {state.onboarding.step === 'connections' && <StepConnections onNext={handleConnections} />}
      </OnboardingShell>
    )
  }

  // ── Active workspace ─────────────────────────────────────────────────────
  const ws = state.workspaces.find(w => w.id === state.activeWsId)

  const updateWs = (patch) =>
    setState(s => {
      const next = {
        ...s,
        workspaces: s.workspaces.map(w => w.id === s.activeWsId ? { ...w, ...patch } : w),
      }
      saveState(next)
      return next
    })

  const handleSelectCampaign   = (c) => { setSelectedCampaign(c); setView('campaigns') }
  const handleUpdateCampaign   = (u) => { updateWs({ campaigns: ws.campaigns.map(c => c.id === u.id ? u : c) }); setSelectedCampaign(u) }
  const handleCreateCampaign   = (c) => updateWs({ campaigns: [...ws.campaigns, c] })
  const handleToggleConnection = (id) => updateWs({ connections: { ...ws.connections, [id]: !ws.connections[id] } })

  // ── Workspace management ─────────────────────────────────────────────────
  const handleAddWorkspace = () => {
    update({ onboarding: BLANK_ONBOARDING })
    setView('campaigns')
    setSelectedCampaign(null)
  }
  const handleSelectWorkspace = (id) => {
    update({ activeWsId: id })
    setView('campaigns')
    setSelectedCampaign(null)
  }

  const handleLogout = () => {
    try { sessionStorage.removeItem('ci_session') } catch {}
    setAuthed(false)
  }

  return (
    <AppShell
      view={view}
      onNavigate={(v) => { setView(v); setSelectedCampaign(null) }}
      workspaces={state.workspaces}
      activeWsId={state.activeWsId}
      onSelectWorkspace={handleSelectWorkspace}
      onAddWorkspace={handleAddWorkspace}
      onLogout={handleLogout}
    >
      {view === 'campaigns' && !selectedCampaign && (
        <Dashboard
          campaigns={ws.campaigns}
          brands={ws.brands}
          onSelectCampaign={handleSelectCampaign}
          onCreateCampaign={handleCreateCampaign}
        />
      )}
      {view === 'campaigns' && selectedCampaign && (
        <CampaignDetail
          campaign={selectedCampaign}
          onBack={() => setSelectedCampaign(null)}
          onUpdate={handleUpdateCampaign}
        />
      )}
      {view === 'brands' && (
        <BrandsView
          brands={ws.brands}
          onAddBrand={(b) => updateWs({ brands: [...ws.brands, b] })}
          onRemoveBrand={(id) => updateWs({ brands: ws.brands.filter(b => b.id !== id) })}
        />
      )}
      {view === 'connections' && (
        <ConnectionsView connections={ws.connections} onToggle={handleToggleConnection} />
      )}
    </AppShell>
  )
}

function OnboardingShell({ step, children }) {
  const stepIndex = ONBOARDING_STEPS.indexOf(step)
  return (
    <div className={styles.onboarding}>
      <div className={styles.onboardingLogo}>
        <div className={styles.onboardingLogoName}>Content Intelligence</div>
        <div className={styles.onboardingLogoSub}>by Marketfully</div>
      </div>

      <div className={styles.stepIndicators}>
        {ONBOARDING_STEPS.map((s, i) => (
          <div key={s} className={styles.stepIndicatorGroup}>
            <div className={[
              styles.stepDot,
              i < stepIndex  ? styles.done    : '',
              i === stepIndex ? styles.current : '',
            ].filter(Boolean).join(' ')}>
              {i < stepIndex ? '✓' : i + 1}
            </div>
            {i < ONBOARDING_STEPS.length - 1 && (
              <div className={[styles.stepConnector, i < stepIndex ? styles.done : ''].filter(Boolean).join(' ')} />
            )}
          </div>
        ))}
      </div>

      <div className={styles.stepContent}>{children}</div>
    </div>
  )
}
