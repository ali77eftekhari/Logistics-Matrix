{
  "role": "senior product-minded frontend engineer and data visualization architect",
  "project_context": {
    "language": "Persian / RTL",
    "domain": "logistics ecosystem, value chain, co-opetition, strategic partnerships",
    "goal": "Build a dynamic, insight-driven logistics ecosystem matrix for Fakher Holding and external ecosystem actors.",
    "current_assets": [
      "A logistics value chain platform map",
      "A Google Sheet containing companies, holdings, categories, co-opetition scores and descriptions",
      "An existing HTML dashboard that reads data from Google Sheet CSV and visualizes cooperation/competition"
    ]
  },
  "main_objective": "Design and implement a dynamic matrix dashboard where rows represent companies/services/entities and columns represent logistics value chain layers plus relationship/interaction dimensions. The output must be highly readable, filterable, heatmap-based, and decision-driven.",
  "core_matrix_structure": {
    "rows": {
      "definition": "Each row should represent one distinct company, service, or business unit. If a holding has multiple services with different business models, show them as separate rows.",
      "examples": [
        "Snapp Box",
        "Snapp Pay",
        "Snapp Shop",
        "Digikala",
        "Digiexpress",
        "Zarinpal",
        "Tipax",
        "Ziboom",
        "IFA",
        "TNEX"
      ]
    },
    "columns": {
      "value_chain_layers": [
        "Market & Ecosystem",
        "Customer Interface",
        "First Mile",
        "Mid Mile",
        "Hub & Spoke",
        "Storage",
        "Fulfillment",
        "Sorting",
        "Last Mile",
        "Reverse Logistics",
        "Fintech & Payment",
        "Data & Control Tower",
        "Infrastructure",
        "Innovation & Investment"
      ],
      "relationship_columns": [
        "Relationship Type",
        "Partnership Potential",
        "Competition Intensity",
        "Cooperation Intensity",
        "Strategic Importance",
        "Current / Potential Status",
        "Recommended Strategic Move"
      ],
      "flow_columns": [
        "Data Flow",
        "Financial Flow",
        "Goods Flow",
        "Operational Flow"
      ]
    }
  },
  "cell_logic": {
    "each_value_chain_cell_should_show": {
      "presence_score": "0-3 intensity score",
      "relationship_type": "Owned, Partner, Competitor, Coopetitor, Opportunity, Neutral",
      "status": "Current or Potential",
      "flow_types": ["Data", "Financial", "Goods", "Operational"],
      "tooltip": "Show entity name, value chain layer, relationship type, flow types, score, strategic note"
    },
    "score_scale": {
      "0": "No meaningful relation",
      "1": "Weak relation or early potential",
      "2": "Medium relation",
      "3": "Strong relation or critical strategic relevance"
    },
    "relationship_type_rules": {
      "Owned": "Fakher-owned or internal entity",
      "Partner": "High cooperation, low competition",
      "Competitor": "High competition, low cooperation",
      "Coopetitor": "High cooperation and high competition",
      "Opportunity": "No current relation but high strategic potential",
      "Neutral": "Low relevance"
    },
    "current_vs_potential": {
      "Current": "Existing relationship, capability or active market presence",
      "Potential": "Strategic opportunity, future partnership, JV, investment or integration possibility"
    }
  },
  "visual_design": {
    "direction": "RTL",
    "style": "minimal, clean, board-level, black/white/gray with strategic accent colors",
    "heatmap": {
      "green": "Strong partnership / high cooperation",
      "red": "Strong competition / high threat",
      "yellow": "Coopetition / mixed relationship",
      "blue": "Owned / internal Fakher capability",
      "gray": "No relation or neutral",
      "purple": "Strategic opportunity / potential move"
    },
    "cell_icons": {
      "D": "Data Flow",
      "$": "Financial Flow",
      "G": "Goods Flow",
      "O": "Operational Flow",
      "JV": "Joint Venture possibility",
      "API": "API integration possibility",
      "INV": "Investment possibility"
    },
    "readability_requirements": [
      "Matrix must remain readable even with many rows.",
      "Use sticky header and sticky first column.",
      "Use compact cells with tooltip details.",
      "Use expandable row detail panel.",
      "Allow switching between compact and detailed view.",
      "Avoid visual clutter."
    ]
  },
  "filters": {
    "required_filters": [
      {
        "name": "Holding / Group",
        "examples": ["Fakher", "Snapp", "Digikala", "Golrang", "Hezardastan", "Zarinpal"]
      },
      {
        "name": "Value Chain Layer",
        "examples": ["First Mile", "Last Mile", "Fulfillment", "Fintech", "Data"]
      },
      {
        "name": "Relationship Type",
        "examples": ["Partner", "Competitor", "Coopetitor", "Opportunity", "Owned"]
      },
      {
        "name": "Flow Type",
        "examples": ["Data", "Financial", "Goods", "Operational"]
      },
      {
        "name": "Current / Potential",
        "examples": ["Current", "Potential"]
      },
      {
        "name": "Strategic Move",
        "examples": ["Partner", "Compete", "Build", "Acquire", "Invest", "JV", "Ignore"]
      },
      {
        "name": "Score Range",
        "examples": ["Only high intensity", "Only weak signals"]
      }
    ]
  },
  "analytics_and_insights": {
    "dashboard_should_generate": [
      "Top 10 strategic partners",
      "Top 10 high-risk competitors",
      "Top 10 coopetitors",
      "Top 10 quick-win partnerships",
      "Value chain layers with strongest Fakher coverage",
      "Value chain layers with weakest Fakher coverage",
      "Best candidates for API integration",
      "Best candidates for JV",
      "Best candidates for investment or acquisition",
      "High dependency risk zones"
    ],
    "recommended_calculated_fields": {
      "cooperation_score": "0-10",
      "competition_score": "0-10",
      "strategic_importance": "1-5",
      "dependency_risk": "1-5",
      "ease_of_integration": "1-5",
      "opportunity_score": "(cooperation_score * 0.25) + (strategic_importance * 0.30) + (ease_of_integration * 0.20) + (flow_strength * 0.25)",
      "risk_score": "(competition_score * 0.35) + (dependency_risk * 0.35) + (strategic_importance * 0.30)",
      "coopetition_score": "cooperation_score * competition_score"
    }
  },
  "views_to_implement": [
    {
      "view_name": "Master Ecosystem Matrix",
      "description": "Main heatmap matrix with rows as entities and columns as value chain layers plus relationship attributes."
    },
    {
      "view_name": "Co-opetition Scatter",
      "description": "X-axis cooperation, Y-axis competition, point size strategic importance, color relationship type, filterable by holding, layer and flow type."
    },
    {
      "view_name": "Value Chain Coverage Heatmap",
      "description": "Aggregated view showing where Fakher is strong, weak, dependent or exposed."
    },
    {
      "view_name": "Strategic Moves Table",
      "description": "A ranked table of recommended actions: Partner, Build, Compete, JV, Invest, Acquire, Ignore."
    },
    {
      "view_name": "Entity Detail Panel",
      "description": "When clicking a row or cell, show entity description, holding, category, value chain roles, relationship types, flows, scores and recommended move."
    }
  ],
  "data_requirements": {
    "input_format": "CSV from Google Sheet or local CSV fallback",
    "required_columns": [
      "entity_id",
      "holding",
      "entity_name",
      "category",
      "description",
      "value_chain_layers",
      "relationship_type",
      "cooperation_score",
      "competition_score",
      "strategic_importance",
      "dependency_risk",
      "ease_of_integration",
      "current_or_potential",
      "data_flow_score",
      "financial_flow_score",
      "goods_flow_score",
      "operational_flow_score",
      "recommended_move",
      "strategic_note"
    ],
    "important_note": "If the current Google Sheet does not contain some columns, create graceful defaults and document missing data clearly in the UI."
  },
  "implementation_requirements": {
    "preserve_existing": [
      "RTL layout",
      "Persian labels",
      "Google Sheet CSV loading",
      "dark/light mode if already present",
      "existing co-opetition logic if available"
    ],
    "add_or_refactor_functions": [
      "parseSheetData()",
      "normalizeEntityRows()",
      "calculateRelationshipType()",
      "calculateFlowStrength()",
      "calculateOpportunityScore()",
      "calculateRiskScore()",
      "renderMasterMatrix()",
      "renderScatterPlot()",
      "renderCoverageHeatmap()",
      "renderStrategicMovesTable()",
      "renderEntityDetailPanel()",
      "applyFilters()"
    ],
    "technical_expectations": [
      "Write clean modular code.",
      "Avoid hard-coded business logic where possible.",
      "Use config objects for value chain layers, colors, relationship types and scoring rules.",
      "Add comments for scoring formulas.",
      "Make the UI responsive.",
      "Do not break the current dashboard."
    ]
  },
  "final_output": {
    "must_include": [
      "A working dynamic dashboard",
      "Master ecosystem heatmap matrix",
      "Interactive filters",
      "Scatter plot",
      "Insight cards",
      "Strategic moves table",
      "Entity detail panel",
      "Clear legend for colors, scores and icons"
    ],
    "success_criteria": [
      "A strategy manager can understand the ecosystem in under 60 seconds.",
      "A board member can identify top risks and opportunities without reading raw data.",
      "The matrix shows not only who exists, but what action Fakher should take."
    ]
  }
}