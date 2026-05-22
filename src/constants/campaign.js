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
  { id: "research",  label: "Research"  },
  { id: "analysis",  label: "Analysis"  },
  { id: "planning",  label: "Planning"  },
  { id: "execution", label: "Execution" },
]

export const CAMPAIGN_STATUSES = {
  active: "Active",
  completed: "Completed",
}
