Design a responsive web dashboard called:

Browser title: “Readiness Map | Project Progress Dashboard”
Friendly URL: /readiness
Audience: MME (Ministry of Mines and Energy)

Core purpose

Create a single shared view of injection-project readiness across stage-gates for MME overview + escalation. The UI must support role-based access and must begin with a role check: “Are you part of MME?” If not, route to a Utility view (read-only + submission actions). Use modern government/enterprise UI style (clean, high legibility, professional, minimal color, strong hierarchy).

First interaction (role gate)

On first visit (or in the header if already authenticated), show a “Select your organization” step:

Screen 0: Organization Gate (modal or first page)
	•	Title: “Welcome to Readiness Map”
	•	Prompt: “What organization are you representing?”
	•	Two large selectable cards:
	1.	MME (primary)
	2.	Utilities (secondary)
	•	Below, a smaller option: “ANP / Regulator (view-only)” (optional)
	•	Primary button: “Continue”
	•	After selection, store role and route:
	•	MME → main dashboard with escalation tools
	•	Utilities → utility dashboard with tasks + submission + export

Global layout

Use a standard enterprise dashboard layout:
	•	Left sidebar navigation
	•	Top header with search and actions
	•	Main dashboard content area with sections

Sidebar items (must exist)
	•	Projects
	•	Stage-gates
	•	Shared checklist
	•	Blockers
	•	Audit log / Change history
	•	Help / FAQ

Header (top bar)
	•	Left: Product name “Readiness Map”
	•	Center: Search input “Search projects, regions, owners…”
	•	Right: Role badge (MME / Utility), Notifications bell, User menu
	•	Primary actions (buttons):
	•	“Export summary (PDF)”
	•	“Export blockers (CSV)”

Page title block (top of main content)
	•	Title: “Injection Readiness Dashboard”
	•	Subheader: “See which projects are ready, blocked, or awaiting review.”
	•	Keywords (include as hidden metadata or small tag row): cross-checklists, readiness, stage-gates, blockers, compliance, injection, governance

⸻

MME Dashboard (primary view)

Section 1: Overview (KPI cards row)

Create 5 clickable KPI cards with counts:
	•	Total projects
	•	Ready to advance
	•	Blocked
	•	Awaiting ANP
	•	Awaiting utility

Each card should be clickable and apply a filter to the project table below. Add a “Clear filters” link.

Section 2: Stage-Gate Snapshot

Create a visual overview of stage-gates in either:
	•	Funnel graphic OR columns by stage (Stage 1–N)
Show number of projects in each stage, and a “% ready” indicator per stage.
Each stage column is clickable to filter the project list.

Include a small legend:
	•	Ready (green)
	•	At risk (amber)
	•	Blocked (red)
	•	Awaiting review (blue/gray)

Add an action button: “View stage definitions” (opens Stage-gates page)

Alt text metadata for this graphic:
	•	“Stage-gate readiness overview by project”

Section 3: Cross-checklist Status (ANP ↔ Utilities)

Create a matrix or split-panel showing alignment between ANP checklist and Utility checklist:
	•	Left column: ANP checklist completion %
	•	Right column: Utility checklist completion %
	•	Middle: “Mismatch alerts” count and list (e.g., “Evidence missing for Item 3: Pressure Test Report”)

Add an actionable control:
	•	Button: “Request alignment review” (opens a modal to message ANP/utilities and attach evidence links)
	•	Button: “Open Shared Checklist” (goes to Shared checklist page)

Alt text metadata:
	•	“Cross-checklist alignment between ANP and utilities”

Section 4: Blockers requiring MME attention (high priority list)

Create a ranked list/table of top blockers:
Columns:
	•	Blocker
	•	Project name
	•	Owner
	•	Deadline
	•	Dependency tags (ANP, Utility, Developer)
	•	Status (Open / In progress / Escalated)

Each blocker row has action buttons:
	•	“Assign owner” (dropdown)
	•	“Escalate” (opens escalation modal)
	•	“Request update” (sends message)
	•	“Mark resolved” (confirmation)

Include a “Blocker heatmap” small card/graphic showing blockers by stage or region.
Alt text metadata:
	•	“Blocker list with owners and due dates”

Section 5: Project List (table)

Add a full-width table beneath sections with filters:
Filters at top:
	•	Stage (dropdown Stage 1–N)
	•	Status (Ready/Blocked/Awaiting ANP/Awaiting Utility)
	•	Region (dropdown)
	•	Owner (dropdown)
	•	Sort: “Deadline soonest” / “Most blocked” / “Recently updated”

Table columns:
	•	Project
	•	Stage
	•	Readiness score (or “Readiness: High/Med/Low”)
	•	Checklist status (ANP %, Utility %)
	•	Blockers count
	•	Last updated
	•	Next action

Each row has buttons:
	•	“Open project”
	•	“View evidence”
	•	“Add blocker”
	•	“Export project report”

AI / reliability elements (do NOT add new features, just trust/resilience UI)

In the MME view, include:
	•	A small “AI-assisted” label next to readiness summaries
	•	A “Why this score?” side panel (collapsible) that shows:
	•	Inputs used (checklist completion + evidence links)
	•	Top missing requirements
	•	Uncertainty indicator (High/Med/Low)
	•	Fallback banner state:
	•	If AI is unavailable, show “AI unavailable — continue manually” and hide AI-dependent labels while keeping everything usable.

Audit log access

In the header or near key sections, add a link:
	•	“View change history” (goes to Audit log / Change history)
Make sure edits create a visible audit trail conceptually (versioned entries, timestamps, who changed what).

⸻

Utilities Dashboard (secondary view)

Create a parallel dashboard with the same navigation and branding, but tailored actions:

Utility home content
	•	Title: “Utility Readiness Worklist”
	•	Subheader: “Complete checklist items and upload evidence to unblock projects.”

Show:
	1.	“My tasks” list (checklist items needing action)
	2.	“Projects awaiting utility” table (with deadlines)
	3.	Buttons per item:
	•	“Upload evidence”
	•	“Mark item complete”
	•	“Request clarification”
	4.	Export buttons remain:
	•	“Export my worklist (CSV)”
	•	“Export project summary (PDF)”

Utilities should NOT have escalation authority; instead show:
	•	Button: “Flag for MME attention” (creates a blocker tagged “Needs MME”)

⸻

Downloads (must exist)

In header and/or a “Downloads” card:
	•	Button: “Export dashboard summary (PDF)”
	•	Button: “Export blockers (CSV)”

⸻

Images / graphics (must be included)

Include these visuals:
	•	Stage-gate funnel or stage columns graphic
	•	Blocker heatmap card
	•	Checklist alignment matrix

⸻

Support & technical notes area (Footer or Help page stub)

Add a Help/FAQ page stub and a small footer note visible on dashboard:
	•	“Support implications: Weekly checklist policy updates; monthly review of stage-gate definitions; onboarding for new orgs.”
	•	“Technical considerations: Role-based access (MME vs ANP vs utility vs developer), audit logging + version history, evidence storage/links, optional AI services with fallback mode.”

⸻

Accessibility

Use clear contrast, readable font sizes, and add alt text fields for the three core visuals:
	•	“Stage-gate readiness overview by project”
	•	“Cross-checklist alignment between ANP and utilities”
	•	“Blocker list with owners and due dates”

⸻

Extra note (so the generated UI is “actionable”)

Make sure every primary section has at least one real button and a modal flow:
	•	KPI cards filter the project table
	•	Stage column click filters projects
	•	Blocker actions open modals/dropdowns
	•	Export buttons are obvious and repeated in the header
