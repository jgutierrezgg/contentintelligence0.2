import { useState, useEffect } from 'react'
import { C } from './constants/colors'
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
  } catch {
    return null
  }
}

function saveState(state) {
  try {
    localStorage.setItem('ci_state', JSON.stringify(state))
  } catch {}
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

  // Onboarding flow
  if (!state.onboardingDone) {
    return (
      <OnboardingShell step={state.onboardingStep}>
        {state.onboardingStep === 'workspace' && (
          <StepWorkspace onNext={(name) => update({ workspace: name, onboardingStep: 'brands' })} />
        )}
        {state.onboardingStep === 'brands' && (
          <StepBrands onNext={(brands) => update({ brands, onboardingStep: 'connections' })} />
        )}
        {state.onboardingStep === 'connections' && (
          <StepConnections onNext={() => update({ onboardingDone: true })} />
        )}
      </OnboardingShell>
    )
  }

  // Platform
  const handleSelectCampaign = (campaign) => {
    setSelectedCampaign(campaign)
    setView('campaigns')
  }

  const handleUpdateCampaign = (updated) => {
    const campaigns = state.campaigns.map(c => c.id === updated.id ? updated : c)
    update({ campaigns })
    setSelectedCampaign(updated)
  }

  const handleCreateCampaign = (campaign) => {
    update({ campaigns: [...state.campaigns, campaign] })
  }

  const handleToggleConnection = (id) => {
    update({ connections: { ...state.connections, [id]: !state.connections[id] } })
  }

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
          onAddBrand={(brand) => update({ brands: [...state.brands, brand] })}
          onRemoveBrand={(id) => update({ brands: state.brands.filter(b => b.id !== id) })}
        />
      )}
      {view === 'connections' && (
        <ConnectionsView
          connections={state.connections}
          onToggle={handleToggleConnection}
        />
      )}
    </AppShell>
  )
}

function OnboardingShell({ step, children }) {
  const stepIndex = ONBOARDING_STEPS.indexOf(step)
  return (
    <div style={{
      minHeight: '100vh', background: C.bg,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: 32,
    }}>
      {/* Logo */}
      <div style={{ marginBottom: 48, textAlign: 'center' }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: C.text }}>Content Intelligence</div>
        <div style={{ fontSize: 12, color: C.textMuted }}>by Marketfully</div>
      </div>

      {/* Step indicators */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 40 }}>
        {ONBOARDING_STEPS.map((s, i) => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              background: i < stepIndex ? C.green : i === stepIndex ? C.accent : C.surfaceHigh,
              border: `2px solid ${i < stepIndex ? C.green : i === stepIndex ? C.accent : C.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 700,
              color: i <= stepIndex ? '#fff' : C.textMuted,
            }}>
              {i < stepIndex ? '✓' : i + 1}
            </div>
            {i < ONBOARDING_STEPS.length - 1 && (
              <div style={{
                width: 32, height: 2,
                background: i < stepIndex ? C.green : C.border,
                borderRadius: 1,
              }} />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      <div style={{ width: '100%', maxWidth: 600 }}>
        {children}
      </div>
    </div>
  )
}
