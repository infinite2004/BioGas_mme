# Readiness Map | Project Progress Dashboard
**Friendly URL:** /readiness  
**Audience:** MME (Ministry of Mines and Energy)  
**Core purpose:** A single shared view of injection-project readiness across stage-gates for MME overview + escalation.

---

## What is prioritized (design intent)
1) **System status at a glance** (MME triage): what’s ready, blocked, awaiting ANP, awaiting utility.  
2) **Flow through the system** (stage-gates): where work accumulates and why.  
3) **Cross-stakeholder alignment** (ANP ↔ Utilities checklist): mismatch alerts surfaced early.  
4) **Governance + accountability** (blockers): owner + deadline + dependency tags; escalation when needed.  
5) **Auditability + resilience** (change history + AI fallback): trust and continuity when assumptions fail.

---

## Interaction requirement: identifiable screens + hover clarity
### Home Screen hover identification (global)
- In **left sidebar**, the active item **Home** has a persistent indicator:
  - **Active state:** left accent bar + bold label + “(Home)” tag
  - **Hover state (non-active):** subtle background highlight + tooltip “Home Screen: Portfolio overview”
- In **header breadcrumbs**, show: `Home / Injection Readiness Dashboard`
- On **hover over the page title block**, show a small badge: **“HOME SCREEN”** (non-clickable, purely clarifying)

### Main Feature visibility + outline (global)
- The main feature is **“Project Readiness Review”**.
- Any entry point to the main feature (project row, KPI filtered view, stage column) must:
  - On hover: show **focus outline** around the project row/card and a tooltip: “Open main feature: Project Readiness Review”
  - On click: open the **Project Readiness Review** screen (outlined layout described below)
- In sidebar, include a non-clickable section label:
  - **MAIN FEATURE**
    - Project Readiness Review (clickable only when a project is selected)
- In the Project Readiness Review screen, the entire main-feature container is visibly outlined:
  - Thick border + label chip at top-left: **MAIN FEATURE: Project Readiness Review**

---

## First interaction (role gate)
**Screen 0: Organization Gate** (modal or first page)
- Title: “Welcome to Readiness Map”
- Prompt: “What organization are you representing?”
- Two large selectable cards:
  1) **MME (primary)**
  2) **Utilities (secondary)**
- Optional smaller link: “ANP / Regulator (view-only)”
- Primary button: “Continue”
- After selection, store role and route:
  - **MME → Home (Injection Readiness Dashboard)** with escalation tools
  - **Utilities → Utility Home (Utility Readiness Worklist)** with tasks + submission + export

---

## Global layout
- Left sidebar navigation
- Top header with search + actions
- Main content area with sections
- Responsive behavior:
  - Desktop: 3-column density where needed (dash modules + tables)
  - Tablet: stack modules, keep KPI row, collapse secondary panels
  - Mobile: convert tables into cards with primary actions

### Sidebar items (must exist)
- **Home** (MME dashboard)  ← identifiable on hover + active state
- Projects
- Stage-gates
- Shared checklist
- Blockers
- Audit log / Change history
- Help / FAQ

### Header (top bar)
- Left: Product name “Readiness Map”
- Center: Search input “Search projects, regions, owners…”
- Right: Role badge (MME / Utility), Notifications, User menu
- Primary actions:
  - “Export summary (PDF)”
  - “Export blockers (CSV)”
- Breadcrumbs beneath header: `Home / Injection Readiness Dashboard` (or `Utility Home / Worklist`)

---

# MME: Home Screen (primary view)
## Page title block
- Title: “Injection Readiness Dashboard”
- Subheader: “See which projects are ready, blocked, or awaiting review.”
- Keyword tags row (small): cross-checklists · readiness · stage-gates · blockers · compliance · injection · governance
- Hover badge on title block: **HOME SCREEN**

---

## Section 1: Overview (KPI cards row)
**5 clickable KPI cards** (counts):
- Total projects
- Ready to advance
- Blocked
- Awaiting ANP
- Awaiting utility

**Behavior**
- Clicking a KPI applies a filter to the Project List table.
- Show active filter chips above the table + “Clear filters” link.

---

## Section 2: Stage-Gate Snapshot
Visual overview of stage-gates:
- Funnel OR columns by stage (Stage 1–N)
- Each stage shows:
  - Project count
  - “% ready” indicator
- Each stage is clickable to filter Project List.

Legend:
- Ready (green)
- At risk (amber)
- Blocked (red)
- Awaiting review (blue/gray)

Action button:
- “View stage definitions” → Stage-gates page

Alt text metadata:
- “Stage-gate readiness overview by project”

---

## Section 3: Cross-checklist Status (ANP ↔ Utilities)
Matrix / split panel:
- Left: ANP checklist completion %
- Right: Utility checklist completion %
- Middle: Mismatch alerts list (e.g., missing evidence for specific item)

Actions:
- “Request alignment review” (modal: message ANP/utilities + attach evidence links)
- “Open Shared Checklist” (navigates to Shared checklist)

Alt text metadata:
- “Cross-checklist alignment between ANP and utilities”

---

## Section 4: Blockers requiring MME attention
Ranked blockers list/table:
Columns:
- Blocker
- Project
- Owner
- Deadline
- Dependency tags (ANP / Utility / Developer)
- Status (Open / In progress / Escalated)

Row actions:
- “Assign owner” (dropdown)
- “Escalate” (modal)
- “Request update” (message)
- “Mark resolved” (confirmation)

Include a small “Blocker heatmap” card (by stage or region).
Alt text metadata:
- “Blocker list with owners and due dates”

---

## Section 5: Project List (table) — MAIN FEATURE ENTRY POINT
Filters:
- Stage (dropdown Stage 1–N)
- Status (Ready/Blocked/Awaiting ANP/Awaiting Utility)
- Region
- Owner
- Sort: Deadline soonest / Most blocked / Recently updated

Table columns:
- Project
- Stage
- Readiness (High/Med/Low or score)
- Checklist status (ANP %, Utility %)
- Blockers count
- Last updated
- Next action

Row buttons:
- “Open project”  → **Main Feature**
- “View evidence”
- “Add blocker”
- “Export project report”

**Hover behavior (make main feature obvious)**
- Hovering a project row:
  - shows a **highlight outline**
  - reveals an inline hint: “Open main feature: Project Readiness Review”
- Clicking “Open project” opens the main feature screen.

---

## AI / reliability (trust + resilience UI; not new features)
- Next to readiness summaries: small label “AI-assisted”
- “Why this score?” collapsible side panel shows:
  - Inputs used (checklist completion + evidence links)
  - Top missing requirements
  - Uncertainty indicator (High/Med/Low)
- Fallback banner state:
  - “AI unavailable — continue manually”
  - Hide AI-dependent labels but keep workflow usable

---

## Audit log access
- Link near header or key sections: “View change history” → Audit log / Change history
- Conceptual requirement: edits are versioned with timestamp + editor identity

---

# MAIN FEATURE: Project Readiness Review (MME)
**This screen must be visually outlined and labeled “MAIN FEATURE”.**  
Open from: Project List row > “Open project” or stage-gate click-through.

## Layout (outlined container)
- **Outlined main container** with label chip: “MAIN FEATURE: Project Readiness Review”
- Top summary bar:
  - Project name + region + current stage
  - Status pill (Ready / Blocked / Awaiting ANP / Awaiting utility)
  - Primary decision actions (MME permissions):
    - “Request ANP review”
    - “Request utility update”
    - “Approve stage-gate” (requires confirmation)
    - “Escalate” (adds to MME attention queue)

## Main feature content (must include)
- Stage-gate definition + criteria for current stage (pinned section)
- Cross-checklist (ANP ↔ Utility) with completion %
- Evidence library linked to checklist items
  - Each checklist item shows attached evidence links/uploads + timestamps
- Readiness decision controls
  - “Mark ready for next stage” (MME-only, confirmation)
  - “Send back for evidence” (comment required)
- Blocker log with owner + deadline + dependency tags
- Change history / audit trail preview panel (latest 5 changes + “View full history”)

**Hover clarity**
- Any interactive module (checklist item, evidence row, blocker row) shows hover affordance:
  - highlight + action buttons appear
  - tooltip explains purpose (e.g., “Evidence supports checklist compliance”)

---

# Utilities: Utility Home (secondary view)
Title: “Utility Readiness Worklist”  
Subheader: “Complete checklist items and upload evidence to unblock projects.”

Sections:
1) “My tasks” list (checklist items needing action)
2) “Projects awaiting utility” table (with deadlines)
3) Buttons per item:
   - “Upload evidence”
   - “Mark item complete”
   - “Request clarification”
4) Exports:
   - “Export my worklist (CSV)”
   - “Export project summary (PDF)”

Utilities do NOT have escalation authority:
- Provide button: “Flag for MME attention” (creates a blocker tagged “Needs MME”)

---

# Downloads (must exist)
- Header buttons:
  - “Export dashboard summary (PDF)”
  - “Export blockers (CSV)”
- Optional “Downloads” card repeats these actions for discoverability.

---

# Images / graphics (must be included)
- Stage-gate funnel or stage columns graphic
- Blocker heatmap card
- Checklist alignment matrix

---

# Support & technical notes (footer or Help stub)
Visible note:
- “Support implications: Weekly checklist policy updates; monthly review of stage-gate definitions; onboarding for new orgs.”
- “Technical considerations: Role-based access (MME vs ANP vs utility vs developer), audit logging + version history, evidence storage/links, optional AI services with fallback mode.”

---

# Accessibility
- High contrast, readable type, keyboard focus states
- Alt text fields for core visuals:
  - “Stage-gate readiness overview by project”
  - “Cross-checklist alignment between ANP and utilities”
  - “Blocker list with owners and due dates”
- Hover interactions must not be the only way to discover actions (actions also visible via buttons/menus)