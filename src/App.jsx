import { useState } from 'react'
import styles from './App.module.css'
import AppShell from './components/layout/AppShell'
import StepWorkspace from './components/onboarding/StepWorkspace'
import StepBrands from './components/onboarding/StepBrands'
import StepConnections from './components/onboarding/StepConnections'
import Dashboard from './components/dashboard/Dashboard'
import BrandsView from './components/dashboard/BrandsView'
import ConnectionsView from './components/dashboard/ConnectionsView'
import CampaignDetail from './components/campaign/CampaignDetail'

const ONBOARDING_STEPS = ['workspace', 'brands', 'connections']

function loadState() {
  try {
    const raw = localStorage.getItem('ci_state')
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

function saveState(state) {
  try { localStorage.setItem('ci_state', JSON.stringify(state)) } catch {}
}

const INITIAL_STATE = {
  onboardingStep: 'workspace',
  onboardingDone: false,
  workspace: null,
  brands: [],
  campaigns: [],
  connections: { ga: false, gsc: false, semrush: false },
}

export default function App() {
  const [state, setState] = useState(() => loadState() ?? INITIAL_STATE)
  const [view, setView] = useState('campaigns')
  const [selectedCampaign, setSelectedCampaign] = useState(null)

  const update = (patch) => {
    setState(s => {
      const next = { ...s, ...patch }
      saveState(next)
      return next
    })
  }

  if (!state.onboardingDone) {
    return (
      <OnboardingShell step={state.onboardingStep}>
        {state.onboardingStep === 'workspace'   && <StepWorkspace   onNext={(name)    => update({ workspace: name,  onboardingStep: 'brands' })} />}
        {state.onboardingStep === 'brands'      && <StepBrands      onNext={(brands)  => update({ brands,           onboardingStep: 'connections' })} />}
        {state.onboardingStep === 'connections' && <StepConnections onNext={() =>       update({ onboardingDone: true })} />}
      </OnboardingShell>
    )
  }

  const handleSelectCampaign  = (c)  => { setSelectedCampaign(c); setView('campaigns') }
  const handleUpdateCampaign  = (u)  => { update({ campaigns: state.campaigns.map(c => c.id === u.id ? u : c) }); setSelectedCampaign(u) }
  const handleCreateCampaign  = (c)  => update({ campaigns: [...state.campaigns, c] })
  const handleToggleConnection = (id) => update({ connections: { ...state.connections, [id]: !state.connections[id] } })

  return (
    <AppShell view={view} onNavigate={(v) => { setView(v); setSelectedCampaign(null) }}>
      {view === 'campaigns' && !selectedCampaign && (
        <Dashboard
          campaigns={state.campaigns}
          brands={state.brands}
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
          brands={state.brands}
          onAddBrand={(b) => update({ brands: [...state.brands, b] })}
          onRemoveBrand={(id) => update({ brands: state.brands.filter(b => b.id !== id) })}
        />
      )}
      {view === 'connections' && (
        <ConnectionsView connections={state.connections} onToggle={handleToggleConnection} />
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
