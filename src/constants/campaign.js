export const MARKETS = [
  "Global", "United States", "LATAM", "Europe",
  "Spain", "Mexico", "Brazil", "Argentina",
]

export const OBJECTIVES = [
  { id: "organic",     label: "Increase organic traffic", description: "Drive more visitors from search engines by ranking for high-intent keywords." },
  { id: "leads",       label: "Generate leads",           description: "Capture prospects and grow your sales pipeline through gated or conversion-focused content." },
  { id: "awareness",   label: "Brand awareness",          description: "Expand reach and recognition among new audiences who don't yet know your brand." },
  { id: "conversions", label: "Improve conversions",      description: "Turn existing traffic into customers by optimizing bottom-of-funnel content." },
  { id: "retention",   label: "Audience retention",       description: "Keep current customers engaged and reduce churn with ongoing valuable content." },
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
  active:    "Active",
  completed: "Completed",
  cancelled: "Cancelled",
}
