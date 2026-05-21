export const MARKETS = [
  "Global", "United States", "LATAM", "Europe",
  "Spain", "Mexico", "Brazil", "Argentina",
]

export const OBJECTIVES = [
  { id: "organic", label: "Increase organic traffic" },
  { id: "leads", label: "Generate leads" },
  { id: "awareness", label: "Brand awareness" },
  { id: "conversions", label: "Improve conversions" },
  { id: "retention", label: "Audience retention" },
]

// Pairs of objectives that conflict with each other
export const CONFLICTING_PAIRS = [
  ["organic", "conversions"],
  ["awareness", "leads"],
]

export const PIPELINE_STEPS = [
  { id: "setup", label: "Campaign Setup" },
  { id: "research", label: "Research" },
  { id: "opportunities", label: "Opportunities" },
  { id: "content", label: "Content Plan" },
  { id: "tracking", label: "Tracking" },
]

export const CAMPAIGN_STATUSES = {
  setup: "Setup",
  active: "Active",
  completed: "Completed",
}
