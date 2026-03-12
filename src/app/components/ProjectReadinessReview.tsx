import { useState } from 'react';
import {
  X,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  FileText,
  Upload,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  User,
  Calendar,
  TrendingUp,
  History,
  Tag,
  Sparkles,
  Info,
  Shield,
  Zap,
  MessageSquare,
} from 'lucide-react';

interface ProjectReadinessReviewProps {
  projectId: number;
  projectName: string;
  projectStage: number;
  role: 'MME' | 'ANP';
  onClose: () => void;
}

type ChecklistItemStatus = 'complete' | 'incomplete' | 'pending' | 'mismatch';

interface ChecklistItem {
  id: number;
  title: string;
  status: ChecklistItemStatus;
  evidence?: { name: string; url: string; uploadedAt: string; uploadedBy: string }[];
  notes?: string;
}

interface BlockerItem {
  id: number;
  title: string;
  owner: string;
  deadline: string;
  dependencies: string[];
  status: 'Open' | 'In progress' | 'Escalated';
}

interface ChangeEntry {
  id: number;
  timestamp: string;
  editor: string;
  action: string;
  section: string;
}

const stageCriteriaMap: Record<number, { name: string; criteria: string[] }> = {
  1: {
    name: 'Planning',
    criteria: [
      'Initial project scope document approved by MME',
      'Preliminary environmental screening submitted',
      'Utility connection feasibility study completed',
      'Budget allocation confirmed and documented',
      'Stakeholder engagement plan in place',
    ],
  },
  2: {
    name: 'Design',
    criteria: [
      'Technical design specifications finalized',
      'Engineering drawings approved by licensed engineer',
      'ANP preliminary review application submitted',
      'Utility capacity assessment received',
      'Environmental Impact Assessment (EIA) initiated',
    ],
  },
  3: {
    name: 'Permitting',
    criteria: [
      'ANP injection permit application formally submitted',
      'Environmental clearance certificate obtained',
      'Municipal zoning approvals confirmed',
      'Utility connection agreement signed',
      'Safety plan reviewed and approved by regulator',
      'Pressure test documentation submitted',
    ],
  },
  4: {
    name: 'Construction',
    criteria: [
      'Construction contractor selected and contracted',
      'Site preparation inspections passed',
      'Interim progress reports submitted on schedule',
      'Health and safety compliance audits passed',
      'Utility infrastructure milestone sign-offs received',
    ],
  },
  5: {
    name: 'Commissioning',
    criteria: [
      'Final pressure and safety tests completed and passed',
      'ANP commissioning inspection scheduled and approved',
      'Utility final acceptance test completed',
      'Operations team trained and certified',
      'As-built documentation submitted and archived',
    ],
  },
};

const anpChecklistItems: ChecklistItem[] = [
  {
    id: 1,
    title: 'Injection permit application',
    status: 'complete',
    evidence: [
      { name: 'ANP-Permit-Application-v3.pdf', url: '#', uploadedAt: '2026-02-15 09:32', uploadedBy: 'A. Santos' },
      { name: 'Supporting-Data-Sheet.xlsx', url: '#', uploadedAt: '2026-02-16 14:10', uploadedBy: 'A. Santos' },
    ],
  },
  {
    id: 2,
    title: 'Pressure test report',
    status: 'mismatch',
    notes: 'Version submitted does not match utility-submitted version. Evidence mismatch.',
    evidence: [
      { name: 'Pressure-Test-Report-v1.pdf', url: '#', uploadedAt: '2026-02-20 11:00', uploadedBy: 'R. Oliveira' },
    ],
  },
  {
    id: 3,
    title: 'Environmental compliance certificate',
    status: 'complete',
    evidence: [
      { name: 'Env-Compliance-Cert-2026.pdf', url: '#', uploadedAt: '2026-01-30 10:15', uploadedBy: 'A. Santos' },
    ],
  },
  {
    id: 4,
    title: 'Safety management plan',
    status: 'pending',
    notes: 'Awaiting ANP internal review. Submitted 2026-03-01.',
  },
  {
    id: 5,
    title: 'Zoning approval confirmation',
    status: 'complete',
    evidence: [
      { name: 'Municipal-Zoning-Approval.pdf', url: '#', uploadedAt: '2026-02-10 08:44', uploadedBy: 'A. Santos' },
    ],
  },
];

const utilityChecklistItems: ChecklistItem[] = [
  {
    id: 1,
    title: 'Utility connection agreement',
    status: 'complete',
    evidence: [
      { name: 'Utility-Connection-Agreement-Signed.pdf', url: '#', uploadedAt: '2026-02-22 15:30', uploadedBy: 'M. Garcia' },
    ],
  },
  {
    id: 2,
    title: 'Pressure test report (utility version)',
    status: 'mismatch',
    notes: 'Version differs from ANP submission — requires reconciliation.',
    evidence: [
      { name: 'Pressure-Test-Report-v2-Utility.pdf', url: '#', uploadedAt: '2026-02-25 09:00', uploadedBy: 'M. Garcia' },
    ],
  },
  {
    id: 3,
    title: 'Capacity assessment document',
    status: 'complete',
    evidence: [
      { name: 'Capacity-Assessment-Final.pdf', url: '#', uploadedAt: '2026-02-18 13:00', uploadedBy: 'M. Garcia' },
    ],
  },
  {
    id: 4,
    title: 'Safety inspection certificate',
    status: 'incomplete',
    notes: 'Certificate not yet uploaded. Overdue since 2026-03-10.',
  },
  {
    id: 5,
    title: 'Infrastructure readiness sign-off',
    status: 'pending',
    notes: 'Awaiting site inspection completion.',
  },
];

const reviewBlockers: BlockerItem[] = [
  {
    id: 1,
    title: 'Pressure test report version mismatch',
    owner: 'R. Oliveira',
    deadline: '2026-03-18',
    dependencies: ['ANP', 'Utility'],
    status: 'Open',
  },
  {
    id: 2,
    title: 'Safety inspection certificate overdue',
    owner: 'M. Garcia',
    deadline: '2026-03-12',
    dependencies: ['Utility'],
    status: 'Escalated',
  },
];

const changeHistory: ChangeEntry[] = [
  { id: 1, timestamp: '2026-03-06 14:22', editor: 'J. Smith (MME)', action: 'Updated readiness score from Medium to High', section: 'Readiness' },
  { id: 2, timestamp: '2026-03-05 09:15', editor: 'M. Garcia (Utility)', action: 'Uploaded Capacity Assessment Final document', section: 'Evidence' },
  { id: 3, timestamp: '2026-03-04 16:40', editor: 'A. Santos (ANP)', action: 'Marked Environmental Compliance Certificate as complete', section: 'ANP Checklist' },
  { id: 4, timestamp: '2026-03-03 11:00', editor: 'R. Oliveira (ANP)', action: 'Flagged pressure test report version mismatch', section: 'Blockers' },
  { id: 5, timestamp: '2026-03-02 10:30', editor: 'J. Smith (MME)', action: 'Assigned blocker owner: R. Oliveira', section: 'Blockers' },
];

function StatusBadge({ status }: { status: ChecklistItemStatus }) {
  const config = {
    complete: { icon: CheckCircle, label: 'Complete', cls: 'text-green-700 bg-green-500/10' },
    incomplete: { icon: XCircle, label: 'Incomplete', cls: 'text-red-700 bg-red-500/10' },
    pending: { icon: Clock, label: 'Pending', cls: 'text-amber-700 bg-amber-500/10' },
    mismatch: { icon: AlertCircle, label: 'Mismatch', cls: 'text-orange-700 bg-orange-500/10 border border-orange-500/30' },
  };
  const { icon: Icon, label, cls } = config[status];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs ${cls}`}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
}

function BlockerStatusBadge({ status }: { status: BlockerItem['status'] }) {
  const cfg = {
    Open: 'bg-red-500/10 text-red-700 border-red-500/30',
    'In progress': 'bg-amber-500/10 text-amber-700 border-amber-500/30',
    Escalated: 'bg-purple-500/10 text-purple-700 border-purple-500/30',
  };
  return <span className={`px-2 py-0.5 rounded text-xs border ${cfg[status]}`}>{status}</span>;
}

function ChecklistSection({
  title,
  items,
  color,
  role,
}: {
  title: string;
  items: ChecklistItem[];
  color: 'blue' | 'purple';
  role: 'MME' | 'ANP';
}) {
  const [expanded, setExpanded] = useState<number | null>(null);
  const complete = items.filter((i) => i.status === 'complete').length;
  const pct = Math.round((complete / items.length) * 100);
  const barColor = color === 'blue' ? 'bg-blue-500' : 'bg-purple-500';

  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm">{title}</h4>
        <span className="text-sm font-semibold">{pct}%</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden mb-3">
        <div className={`h-full ${barColor} transition-all`} style={{ width: `${pct}%` }} />
      </div>
      <div className="space-y-1.5">
        {items.map((item) => (
          <div
            key={item.id}
            className="border border-border rounded-lg transition-all hover:border-primary/40 hover:shadow-sm group"
          >
            <button
              className="w-full flex items-center justify-between p-3 text-left"
              onClick={() => setExpanded(expanded === item.id ? null : item.id)}
              title="Evidence supports checklist compliance"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <StatusBadge status={item.status} />
                <span className="text-sm truncate">{item.title}</span>
              </div>
              <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                {item.evidence && (
                  <span className="text-xs text-muted-foreground">{item.evidence.length} doc{item.evidence.length !== 1 ? 's' : ''}</span>
                )}
                {expanded === item.id ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />}
              </div>
            </button>
            {expanded === item.id && (
              <div className="px-3 pb-3 pt-0 border-t border-border">
                {item.notes && (
                  <p className="text-xs text-amber-700 bg-amber-500/10 rounded px-2 py-1.5 mb-2 flex items-start gap-1.5">
                    <Info className="w-3 h-3 mt-0.5 flex-shrink-0" /> {item.notes}
                  </p>
                )}
                {item.evidence && item.evidence.length > 0 ? (
                  <div className="space-y-1.5">
                    {item.evidence.map((ev, i) => (
                      <div key={i} className="flex items-center justify-between text-xs bg-muted/50 rounded px-2 py-1.5">
                        <div className="flex items-center gap-1.5">
                          <FileText className="w-3 h-3 text-muted-foreground" />
                          <a href={ev.url} className="text-primary hover:underline">{ev.name}</a>
                        </div>
                        <div className="text-muted-foreground text-right">
                          <span>{ev.uploadedAt}</span>
                          <span className="ml-2 text-foreground/70">{ev.uploadedBy}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground italic">No evidence documents uploaded.</p>
                )}
                {role === 'MME' && item.status !== 'complete' && (
                  <div className="flex gap-2 mt-2">
                    <button className="px-2 py-1 bg-primary text-primary-foreground rounded text-xs hover:opacity-90 flex items-center gap-1">
                      <Upload className="w-3 h-3" /> Request upload
                    </button>
                    <button className="px-2 py-1 border border-border rounded text-xs hover:bg-accent flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" /> Add note
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProjectReadinessReview({
  projectId,
  projectName,
  projectStage,
  role,
  onClose,
}: ProjectReadinessReviewProps) {
  const [showConfirmApprove, setShowConfirmApprove] = useState(false);
  const [showEscalateModal, setShowEscalateModal] = useState(false);
  const [showANPModal, setShowANPModal] = useState(false);
  const [showUtilityModal, setShowUtilityModal] = useState(false);
  const [showSendBackModal, setShowSendBackModal] = useState(false);
  const [aiAvailable] = useState(true);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [activeZone, setActiveZone] = useState<string | null>(null);

  const stageInfo = stageCriteriaMap[projectStage] || stageCriteriaMap[3];
  const statusLabel = projectId === 1 ? 'Awaiting ANP' : projectId === 3 ? 'Ready' : 'Blocked';
  const statusCls =
    statusLabel === 'Ready'
      ? 'bg-green-500/10 text-green-700 border-green-500/30'
      : statusLabel === 'Blocked'
      ? 'bg-red-500/10 text-red-700 border-red-500/30'
      : 'bg-blue-500/10 text-blue-700 border-blue-500/30';

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center overflow-y-auto p-4 md:p-8">
      <div className="w-full max-w-6xl my-4">
        {/* MAIN FEATURE outlined container */}
        <div className="relative border-2 border-primary rounded-xl shadow-2xl bg-background">
          {/* MAIN FEATURE label chip */}
          <div className="absolute -top-3.5 left-6 z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-primary text-primary-foreground rounded-full text-xs tracking-wide">
              <Zap className="w-3 h-3" />
              MAIN FEATURE: Project Readiness Review
            </span>
          </div>

          {activeZone && (
            <div className="absolute inset-0 pointer-events-none" aria-hidden>
              <div className="absolute inset-0 bg-black/15 rounded-xl" />
              <div className="absolute right-6 top-6 bg-card/95 border border-border rounded-lg p-4 shadow-lg max-w-sm">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded-full text-[10px] tracking-widest bg-primary/10 text-primary">
                    GUIDE
                  </span>
                  <span className="text-[10px] text-muted-foreground">Hover to learn why</span>
                </div>
                {activeZone === 'header' && (
                  <>
                    <div className="text-xs font-semibold mb-1">Project context is prioritized for fast triage.</div>
                    <p className="text-xs text-muted-foreground">
                      Status, stage, owner, and last update sit at the top so MME can decide if action is required before reviewing details.
                    </p>
                  </>
                )}
                {activeZone === 'gate-criteria' && (
                  <>
                    <div className="text-xs font-semibold mb-1">Gate criteria explain what “ready” means.</div>
                    <p className="text-xs text-muted-foreground">
                      This section anchors the decision in shared stage definitions so MME and partners use the same readiness language.
                    </p>
                  </>
                )}
                {activeZone === 'cross-checklist' && (
                  <>
                    <div className="text-xs font-semibold mb-1">Cross-checklist aligns ANP and Utility evidence.</div>
                    <p className="text-xs text-muted-foreground">
                      Showing both lists together highlights mismatches early and reduces rework between agencies.
                    </p>
                  </>
                )}
                {activeZone === 'mismatch-alert' && (
                  <>
                    <div className="text-xs font-semibold mb-1">Mismatch alerts surface the highest-risk delay.</div>
                    <p className="text-xs text-muted-foreground">
                      These banners call out conflicts that block approvals so MME can coordinate resolution quickly.
                    </p>
                  </>
                )}
                {activeZone === 'decision' && (
                  <>
                    <div className="text-xs font-semibold mb-1">Decision controls support escalation or approval.</div>
                    <p className="text-xs text-muted-foreground">
                      The main feature is a decision workflow; actions are grouped here to keep accountability clear.
                    </p>
                  </>
                )}
                {activeZone === 'blockers' && (
                  <>
                    <div className="text-xs font-semibold mb-1">Blocker log keeps ownership visible.</div>
                    <p className="text-xs text-muted-foreground">
                      Owner, deadline, and status make coordination explicit so delays do not hide in checklists.
                    </p>
                  </>
                )}
                {activeZone === 'audit' && (
                  <>
                    <div className="text-xs font-semibold mb-1">Audit history builds trust in decisions.</div>
                    <p className="text-xs text-muted-foreground">
                      Change history makes approvals defensible and reduces disputes when timelines slip.
                    </p>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Header / Summary Bar */}
          <div
            className="border-b border-border px-6 pt-8 pb-5"
            onMouseEnter={() => setActiveZone('header')}
            onMouseLeave={() => setActiveZone(null)}
          >
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h2 className="truncate">{projectName}</h2>
                  <span className={`px-2 py-0.5 rounded border text-xs ${statusCls}`}>{statusLabel}</span>
                  {aiAvailable && (
                    <button
                      onClick={() => setShowAIPanel(true)}
                      className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-500/10 text-blue-700 rounded text-xs hover:bg-blue-500/20 transition-colors"
                    >
                      <Sparkles className="w-3 h-3" />
                      AI-assisted
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                  <span className="flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5" />
                    Stage {projectStage}: {stageInfo.name}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" />
                    Owner: J. Smith
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    Last updated: 2026-03-06
                  </span>
                </div>
              </div>

              {/* Action buttons (MME only) */}
              <div className="flex items-center gap-2 flex-wrap">
                {role === 'MME' && (
                  <>
                    <button
                      onClick={() => setShowANPModal(true)}
                      className="px-3 py-1.5 border border-border rounded-lg hover:bg-accent flex items-center gap-1.5 text-sm"
                    >
                      <Shield className="w-4 h-4" /> Request ANP review
                    </button>
                    <button
                      onClick={() => setShowUtilityModal(true)}
                      className="px-3 py-1.5 border border-border rounded-lg hover:bg-accent flex items-center gap-1.5 text-sm"
                    >
                      <Zap className="w-4 h-4" /> Request utility update
                    </button>
                    <button
                      onClick={() => setShowEscalateModal(true)}
                      className="px-3 py-1.5 border border-border rounded-lg hover:bg-accent flex items-center gap-1.5 text-sm text-amber-700"
                    >
                      <TrendingUp className="w-4 h-4" /> Escalate
                    </button>
                    <button
                      onClick={() => setShowConfirmApprove(true)}
                      className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 flex items-center gap-1.5 text-sm"
                    >
                      <CheckCircle className="w-4 h-4" /> Approve stage-gate
                    </button>
                  </>
                )}
                <button
                  onClick={onClose}
                  className="p-1.5 hover:bg-accent rounded-lg ml-2"
                  title="Close review"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* AI Unavailable banner (when applicable) */}
          {!aiAvailable && (
            <div className="mx-6 mt-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-center gap-3">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <p className="text-sm text-amber-700">AI unavailable — continue manually. Readiness scores reflect checklist completion only.</p>
            </div>
          )}

          <div className="p-6 space-y-6">
            {/* Section 1: Stage-Gate Definition */}
            <div
              className="bg-accent/40 rounded-lg p-5 border border-border"
              onMouseEnter={() => setActiveZone('gate-criteria')}
              onMouseLeave={() => setActiveZone(null)}
            >
              <div className="flex items-center gap-2 mb-3">
                <Tag className="w-4 h-4 text-primary" />
                <h3>Stage {projectStage} — {stageInfo.name}: Gate Criteria</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                All criteria must be met before advancing to the next stage-gate.
              </p>
              <ul className="space-y-2">
                {stageInfo.criteria.map((criterion, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{criterion}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Section 2: Cross-Checklist */}
            <div
              onMouseEnter={() => setActiveZone('cross-checklist')}
              onMouseLeave={() => setActiveZone(null)}
            >
              <div className="flex items-center justify-between mb-4">
                <h3>Cross-Checklist: ANP ↔ Utility</h3>
                <span className="text-xs text-muted-foreground">3 mismatches detected</span>
              </div>
              {/* Mismatch alert banner */}
              <div
                className="mb-4 p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg flex items-center gap-2.5"
                onMouseEnter={() => setActiveZone('mismatch-alert')}
                onMouseLeave={() => setActiveZone('cross-checklist')}
              >
                <AlertCircle className="w-4 h-4 text-orange-600 flex-shrink-0" />
                <p className="text-sm text-orange-700">
                  <strong>Mismatch detected:</strong> Pressure test report versions differ between ANP and Utility submissions. Resolution required before stage-gate approval.
                </p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <ChecklistSection title="ANP Checklist" items={anpChecklistItems} color="blue" role={role} />
                <ChecklistSection title="Utility Checklist" items={utilityChecklistItems} color="purple" role={role} />
              </div>
            </div>

            {/* Section 3: Readiness Decision Controls (MME only) */}
            {role === 'MME' && (
              <div
                className="bg-card border-2 border-dashed border-primary/30 rounded-lg p-5"
                onMouseEnter={() => setActiveZone('decision')}
                onMouseLeave={() => setActiveZone(null)}
              >
                <h3 className="mb-3">Readiness Decision</h3>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setShowConfirmApprove(true)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 text-sm"
                  >
                    <CheckCircle className="w-4 h-4" /> Mark ready for next stage
                  </button>
                  <button
                    onClick={() => setShowSendBackModal(true)}
                    className="px-4 py-2 bg-card border border-border rounded-lg hover:bg-accent flex items-center gap-2 text-sm"
                  >
                    <XCircle className="w-4 h-4" /> Send back for evidence
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  Both actions are logged in the audit trail and require confirmation.
                </p>
              </div>
            )}

            {/* Section 4: Blocker Log */}
            <div
              onMouseEnter={() => setActiveZone('blockers')}
              onMouseLeave={() => setActiveZone(null)}
            >
              <h3 className="mb-4">Blocker Log</h3>
              <div className="space-y-2">
                {reviewBlockers.map((blocker) => (
                  <div
                    key={blocker.id}
                    className="flex items-start gap-3 p-4 border border-border rounded-lg hover:border-primary/40 hover:shadow-sm transition-all group"
                    title="Blocker requires resolution before stage-gate advancement"
                  >
                    <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-sm font-medium">{blocker.title}</span>
                        <BlockerStatusBadge status={blocker.status} />
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                        <span className="flex items-center gap-1"><User className="w-3 h-3" />{blocker.owner}</span>
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />Due: {blocker.deadline}</span>
                        <div className="flex gap-1">
                          {blocker.dependencies.map((dep) => (
                            <span key={dep} className="px-1.5 py-0.5 bg-muted rounded text-xs">{dep}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    {role === 'MME' && (
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 hover:bg-accent rounded text-xs" title="Escalate blocker">
                          <TrendingUp className="w-3.5 h-3.5" />
                        </button>
                        <button className="p-1.5 hover:bg-accent rounded text-xs" title="Mark resolved">
                          <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Section 5: Change History / Audit Trail */}
            <div
              onMouseEnter={() => setActiveZone('audit')}
              onMouseLeave={() => setActiveZone(null)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <History className="w-4 h-4 text-muted-foreground" />
                  <h3>Change History</h3>
                  <span className="text-xs text-muted-foreground">(latest 5 changes)</span>
                </div>
                <button className="text-sm text-primary hover:underline flex items-center gap-1">
                  <ExternalLink className="w-3.5 h-3.5" /> View full history
                </button>
              </div>
              <div className="border border-border rounded-lg overflow-hidden">
                {changeHistory.map((entry, i) => (
                  <div
                    key={entry.id}
                    className={`flex items-start gap-3 px-4 py-3 text-sm hover:bg-accent/50 transition-colors ${
                      i < changeHistory.length - 1 ? 'border-b border-border' : ''
                    }`}
                  >
                    <div className="w-32 flex-shrink-0 text-xs text-muted-foreground mt-0.5">{entry.timestamp}</div>
                    <div className="flex-1 min-w-0">
                      <span className="text-foreground">{entry.action}</span>
                      <span className="text-muted-foreground"> · {entry.section}</span>
                    </div>
                    <div className="text-xs text-muted-foreground flex-shrink-0 text-right">{entry.editor}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Score Panel */}
      {showAIPanel && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-6">
          <div className="bg-card border border-border rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-500" />
                <h2>Why This Score?</h2>
              </div>
              <button onClick={() => setShowAIPanel(false)} className="p-1.5 hover:bg-accent rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-4 mb-6">
              <div>
                <h4 className="mb-2">Inputs Used</h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li>ANP checklist completion: 80%</li>
                  <li>Utility checklist completion: 60%</li>
                  <li>Active blockers: 2 (one escalated)</li>
                  <li>Evidence documents: 8/10 uploaded</li>
                  <li>Stage criteria fulfilled: 4/5</li>
                </ul>
              </div>
              <div>
                <h4 className="mb-2">Top Missing Requirements</h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li>Safety inspection certificate not uploaded</li>
                  <li>Pressure test report version reconciliation</li>
                  <li>Infrastructure readiness sign-off pending</li>
                </ul>
              </div>
              <div>
                <h4 className="mb-2">Uncertainty Indicator</h4>
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500" style={{ width: '60%' }} />
                  </div>
                  <span className="text-sm">Medium (60% confidence)</span>
                </div>
                <p className="text-xs text-muted-foreground">Incomplete data reduces scoring confidence.</p>
              </div>
            </div>
            <button onClick={() => setShowAIPanel(false)} className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90">
              Close
            </button>
          </div>
        </div>
      )}

      {/* Confirm Approve Modal */}
      {showConfirmApprove && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-6">
          <div className="bg-card border border-border rounded-lg max-w-md w-full p-6">
            <h2 className="mb-2">Approve Stage-Gate</h2>
            <p className="text-sm text-muted-foreground mb-4">
              You are about to approve <strong>{projectName}</strong> to advance from Stage {projectStage}: {stageInfo.name}. This action will be logged in the audit trail.
            </p>
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-sm text-amber-700 mb-4">
              <strong>Note:</strong> 2 active blockers remain. Approving will record a waiver decision.
            </div>
            <div className="mb-4">
              <label className="block text-sm mb-2">Approval notes (optional)</label>
              <textarea className="w-full px-3 py-2 bg-input-background border border-border rounded-lg h-24 resize-none text-sm" placeholder="Add context for this approval..." />
            </div>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowConfirmApprove(false)} className="px-4 py-2 border border-border rounded-lg hover:bg-accent text-sm">Cancel</button>
              <button onClick={() => setShowConfirmApprove(false)} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">Confirm Approval</button>
            </div>
          </div>
        </div>
      )}

      {/* Escalate Modal */}
      {showEscalateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-6">
          <div className="bg-card border border-border rounded-lg max-w-md w-full p-6">
            <h2 className="mb-4">Escalate Project</h2>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm mb-2">Escalation level</label>
                <select className="w-full px-3 py-2 bg-input-background border border-border rounded-lg text-sm">
                  <option>Senior Management</option>
                  <option>Director Level</option>
                  <option>Executive Level</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-2">Reason for escalation</label>
                <textarea className="w-full px-3 py-2 bg-input-background border border-border rounded-lg h-24 resize-none text-sm" placeholder="Describe why this project requires escalation..." />
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowEscalateModal(false)} className="px-4 py-2 border border-border rounded-lg hover:bg-accent text-sm">Cancel</button>
              <button onClick={() => setShowEscalateModal(false)} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 text-sm">Escalate</button>
            </div>
          </div>
        </div>
      )}

      {/* ANP Review Request Modal */}
      {showANPModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-6">
          <div className="bg-card border border-border rounded-lg max-w-md w-full p-6">
            <h2 className="mb-4">Request ANP Review</h2>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm mb-2">Message to ANP</label>
                <textarea className="w-full px-3 py-2 bg-input-background border border-border rounded-lg h-24 resize-none text-sm" placeholder="Describe what needs ANP attention..." />
              </div>
              <div>
                <label className="block text-sm mb-2">Attach evidence links</label>
                <input type="text" className="w-full px-3 py-2 bg-input-background border border-border rounded-lg text-sm" placeholder="Paste document URLs..." />
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowANPModal(false)} className="px-4 py-2 border border-border rounded-lg hover:bg-accent text-sm">Cancel</button>
              <button onClick={() => setShowANPModal(false)} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 text-sm">Send Request</button>
            </div>
          </div>
        </div>
      )}

      {/* Utility Update Modal */}
      {showUtilityModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-6">
          <div className="bg-card border border-border rounded-lg max-w-md w-full p-6">
            <h2 className="mb-4">Request Utility Update</h2>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm mb-2">Message to Utility</label>
                <textarea className="w-full px-3 py-2 bg-input-background border border-border rounded-lg h-24 resize-none text-sm" placeholder="Describe what utility action is needed..." />
              </div>
              <div>
                <label className="block text-sm mb-2">Deadline for response</label>
                <input type="date" className="w-full px-3 py-2 bg-input-background border border-border rounded-lg text-sm" defaultValue="2026-03-20" />
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowUtilityModal(false)} className="px-4 py-2 border border-border rounded-lg hover:bg-accent text-sm">Cancel</button>
              <button onClick={() => setShowUtilityModal(false)} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 text-sm">Send Request</button>
            </div>
          </div>
        </div>
      )}

      {/* Send Back for Evidence Modal */}
      {showSendBackModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-6">
          <div className="bg-card border border-border rounded-lg max-w-md w-full p-6">
            <h2 className="mb-4">Send Back for Evidence</h2>
            <p className="text-sm text-muted-foreground mb-4">This will return the project for additional evidence submission. A comment is required.</p>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm mb-2">Required comment <span className="text-red-500">*</span></label>
                <textarea className="w-full px-3 py-2 bg-input-background border border-border rounded-lg h-24 resize-none text-sm" placeholder="Specify what evidence is missing and where to submit it..." />
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowSendBackModal(false)} className="px-4 py-2 border border-border rounded-lg hover:bg-accent text-sm">Cancel</button>
              <button onClick={() => setShowSendBackModal(false)} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 text-sm">Send Back</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
