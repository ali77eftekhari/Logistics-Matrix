{
  "role": "Senior frontend engineer, data visualization architect, and logistics ecosystem strategy analyst",
  "project_name": "Dynamic Logistics Ecosystem Intelligence Dashboard",
  "language": "Persian",
  "direction": "RTL",
  "main_goal": "Completely redesign the current dashboard into a highly dynamic, decision-driven, insight-driven logistics ecosystem intelligence tool based on the Google Sheet named Logistics Ecosystem.",
  "data_source": {
    "type": "Google Sheet CSV",
    "instruction": "Use Google Sheet as the single source of truth. Fetch data dynamically from the published CSV URLs. The dashboard must update when the Google Sheet data changes.",
    "important_columns_detected": [
      "Brand name(Firm name)",
      "Industry",
      "Parent Firm (Holding)",
      "activity",
      "Description",
      "Co-Op Avg",
      "Comp Avg",
      "Primary Role",
      "Secondary Role",
      "Exchange Type",
      "Value chain Strenghts",
      "Value chain weakness",
      "Actual partnerships",
      "Potential Partnerships"
    ],
    "note": "If any column name has typos such as Strenghts, support it as-is and optionally normalize internally."
  },
  "dashboard_views": [
    {
      "name": "Master Heatmap Matrix",
      "purpose": "Show presence/absence and strength of each brand across logistics value chain layers.",
      "rows": "Brand name(Firm name)",
      "columns": "Value chain layers parsed from Value chain Strenghts and Value chain weakness",
      "cell_logic": {
        "1": "green cell = presence/strength",
        "0": "neutral gray cell = absence/no presence",
        "strength": "If a brand has a layer in Value chain Strenghts, mark it as green. If not, mark it as gray. If layer appears in weakness, show a warning indicator or weak-pattern styling.",
        "tooltip": [
          "Brand name",
          "Parent Firm",
          "Industry",
          "Primary Role",
          "Secondary Role",
          "Exchange Type",
          "Strength/Weakness explanation",
          "Actual partnerships",
          "Potential Partnerships"
        ]
      },
      "design": "Do not show raw 1 and 0 numbers. Use clean heatmap cells, icons, tooltips, sticky headers, sticky first column, and compact grid layout."
    },
    {
      "name": "Enhanced Co-opetition Scatter",
      "purpose": "Show cooperation vs competition with richer filters and readable brand labels.",
      "x_axis": "Co-Op Avg",
      "y_axis": "Comp Avg",
      "point_label": "Brand name must be visible inside or next to each bubble",
      "point_size": "Strategic relevance calculated from Co-Op Avg, Comp Avg, and number of exchange types",
      "point_color": "Primary Role",
      "point_border_or_shape": "Exchange Type",
      "tooltip": [
        "Brand name",
        "Parent Firm",
        "Industry",
        "Co-Op Avg",
        "Comp Avg",
        "Primary Role",
        "Secondary Role",
        "Exchange Type",
        "Potential Partnerships"
      ]
    },
    {
      "name": "Fakher Partnership Coverage by Industry",
      "purpose": "A separate tab/view where Fakher can see which industries it currently collaborates with and which industries have no current partnership.",
      "logic": {
        "actual_presence": "Use Actual partnerships column",
        "potential_presence": "Use Potential Partnerships column",
        "group_by": "Industry",
        "show": [
          "Industries with current Fakher collaboration",
          "Industries with only potential collaboration",
          "Industries with no collaboration",
          "Top industries by number of possible partners"
        ]
      },
      "visuals": [
        "Industry coverage heatmap",
        "Bar chart of industries by number of current/potential partnerships",
        "Gap list"
      ]
    },
    {
      "name": "Company Strength & Weakness Profile",
      "purpose": "For every company, show where it is strong and weak across the logistics value chain.",
      "input_columns": [
        "Value chain Strenghts",
        "Value chain weakness"
      ],
      "visuals": [
        "Mini heatmap per company",
        "Strength chips",
        "Weakness chips",
        "Recommended strategic interpretation"
      ]
    },
    {
      "name": "Primary Role Insights",
      "purpose": "Generate insights grouped by Primary Role.",
      "group_by": "Primary Role",
      "insights": [
        "Number of brands per role",
        "Average cooperation score",
        "Average competition score",
        "Most common exchange types",
        "Most common value chain strengths",
        "Most common potential partnerships",
        "Recommended strategic move per role"
      ]
    },
    {
      "name": "Secondary Role Insights",
      "purpose": "Generate deeper insights grouped by Secondary Role.",
      "group_by": "Secondary Role",
      "note": "Secondary Role may contain multiple slash-separated roles. Split them into individual role tags before analysis.",
      "insights": [
        "Most frequent secondary roles",
        "Which holdings dominate each secondary role",
        "Which roles are mostly partnership-oriented",
        "Which roles indicate risk or competitive threat"
      ]
    },
    {
      "name": "Fakher Company Filter View",
      "purpose": "Allow filtering by each Fakher company and show all Brand Names listed in Potential Partnerships.",
      "logic": {
        "source_column": "Potential Partnerships",
        "split_values_by": "comma",
        "filter": "Fakher company name",
        "output": "All external Brand Names that mention the selected Fakher company as potential partnership"
      },
      "examples": [
        "If user selects Tipax, show all brands where Potential Partnerships includes Tipax.",
        "If user selects IFA, show all brands where Potential Partnerships includes IFA.",
        "If user selects T-Hub, show all brands where Potential Partnerships includes T-Hub."
      ]
    },
    {
      "name": "Strategic Recommendation Engine",
      "purpose": "Generate board-level decision insights.",
      "outputs": [
        "Top pure partners",
        "Top pure competitors",
        "Top coopetitors",
        "Top potential partnerships",
        "High-risk competitors",
        "Industries with high opportunity but low current presence",
        "Value chain layers where Fakher is strong",
        "Value chain layers where Fakher is weak",
        "Best API/data partnership candidates",
        "Best JV candidates",
        "Best internal build candidates"
      ]
    }
  ],
  "filters": {
    "global_filters": [
      "Parent Firm (Holding)",
      "Industry",
      "activity",
      "Primary Role",
      "Secondary Role",
      "Exchange Type",
      "Value chain layer",
      "Actual partnerships",
      "Potential Partnerships",
      "Co-Op Avg range",
      "Comp Avg range"
    ],
    "behavior": "All filters must update all views dynamically."
  },
  "visual_rules": {
    "heatmap": {
      "presence": "green",
      "absence": "neutral gray",
      "weakness": "light red border or warning icon",
      "owned_or_fakher_related": "blue accent",
      "high_competition": "red accent",
      "coopetition": "yellow accent"
    },
    "scatter": {
      "labels": "Always display brand names inside or near bubbles",
      "overlap_handling": "Use collision avoidance, label offset, zoom, or hover expansion if labels overlap",
      "quadrants": {
        "high_coop_low_comp": "Partner Zone",
        "high_coop_high_comp": "Coopetition Zone",
        "low_coop_high_comp": "Threat Zone",
        "low_coop_low_comp": "Low Relevance Zone"
      }
    },
    "ux": [
      "RTL Persian interface",
      "Minimal executive dashboard design",
      "Sticky matrix headers",
      "Searchable filters",
      "Expandable company detail drawer",
      "Clear legend for colors, roles, exchange types, and scores",
      "Responsive layout",
      "Dark/light mode if already available"
    ]
  },
  "calculated_fields": {
    "exchange_type_count": "Count split values in Exchange Type",
    "potential_partner_count": "Count split values in Potential Partnerships",
    "actual_partner_count": "Count split values in Actual partnerships",
    "strategic_relevance_score": "(Co-Op Avg * 0.35) + (Comp Avg * 0.25) + (exchange_type_count * 0.15) + (potential_partner_count * 0.25)",
    "risk_score": "(Comp Avg * 0.6) + (Co-Op Avg * 0.2) + (exchange_type_count * 0.2)",
    "opportunity_score": "(Co-Op Avg * 0.45) + (potential_partner_count * 0.30) + (exchange_type_count * 0.25)"
  },
  "implementation_instructions": [
    "Refactor the existing code into modular functions.",
    "Do not hard-code the value chain columns if they can be parsed from the data.",
    "Parse comma-separated fields safely.",
    "Normalize Persian/English spacing issues in value chain layer names.",
    "Support missing values gracefully.",
    "Keep the heatmap but replace numeric 1/0 display with color-only cells.",
    "Add a manual refresh button and last-updated timestamp.",
    "Keep Google Sheet as live data source.",
    "Add fallback local CSV support for development."
  ],
  "main_functions_to_create": [
    "loadAllSheets()",
    "parseCSV()",
    "normalizeData()",
    "splitMultiValueField()",
    "extractValueChainLayers()",
    "calculateStrategicScores()",
    "renderMasterHeatmap()",
    "renderEnhancedScatter()",
    "renderIndustryCoverageView()",
    "renderCompanyProfileView()",
    "renderPrimaryRoleInsights()",
    "renderSecondaryRoleInsights()",
    "renderFakherCompanyFilterView()",
    "renderStrategicRecommendationEngine()",
    "applyGlobalFilters()",
    "renderEntityDetailDrawer()"
  ],
  "success_criteria": [
    "A board member can understand ecosystem threats and opportunities in under 60 seconds.",
    "A strategy analyst can filter by holding, industry, role, exchange type, and Fakher company.",
    "The dashboard clearly shows current vs potential partnership gaps.",
    "Heatmap is visually clean and does not show raw 1/0 numbers.",
    "Scatter plot is readable and shows brand names.",
    "Insights are grouped by Primary Role and Secondary Role.",
    "Potential partnerships can be filtered by each Fakher company."
  ]
}

{
  "design_update": {
    "priority": "High",
    "instruction": "The current UI looks basic and beginner-level. Redesign the dashboard with a much more polished, premium, modern, executive-grade visual style.",
    "theme": {
      "dark_light_mode": "Not a priority. Do not spend development effort on dark/light mode unless it already exists and is easy to preserve.",
      "preferred_style": "Clean, premium, minimal, strategic dashboard aesthetic; suitable for board-level presentation and daily use by strategy teams."
    },
    "visual_direction": {
      "look_and_feel": [
        "Modern SaaS dashboard",
        "Executive intelligence platform",
        "High-end consulting report aesthetic",
        "Clean grid system",
        "Better spacing and hierarchy",
        "More refined typography",
        "Less clutter",
        "More professional cards, filters, legends, and charts"
      ],
      "avoid": [
        "Beginner-looking UI",
        "Random bright colors",
        "Overly playful design",
        "Crowded layouts",
        "Default Chart.js appearance",
        "Heavy shadows and cheap gradients"
      ]
    },
    "ui_requirements": [
      "Redesign the layout from a simple page into a polished dashboard experience.",
      "Create a strong top navigation/header with dashboard title, data refresh status, and key actions.",
      "Create a left or top filter panel that feels professional and easy to use.",
      "Use clean cards for insight summaries.",
      "Make the heatmap visually elegant and readable.",
      "Make the scatter plot more refined, with better labels, quadrant backgrounds, and improved tooltip design.",
      "Use a consistent color system for relationship types, heatmap states, and exchange types.",
      "Improve typography, spacing, border radius, table density, legends, and empty states.",
      "Add polished loading states and error states.",
      "Make the tool feel like a strategic decision intelligence product, not just a technical demo."
    ],
    "design_success_criteria": [
      "The dashboard should feel premium enough to present to senior managers or board members.",
      "A user should immediately understand where to click, filter, and explore.",
      "The visual system should make insights easier to understand, not just make the page prettier.",
      "The final UI should look significantly more mature than the existing version."
    ]
  }
}