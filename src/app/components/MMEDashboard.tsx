import { useMemo, useState } from 'react';
import { DashboardLayout } from './DashboardLayout';
import { StageGateSnapshot } from './StageGateSnapshot';
import { CrossChecklistStatus } from './CrossChecklistStatus';
import { BlockersList } from './BlockersList';
import { ProjectTable } from './ProjectTable';
import { ProjectReadinessReview } from './ProjectReadinessReview';

interface MMEDashboardProps {
  role: 'MME' | 'ANP';
  onChangeRole: () => void;
}

interface SelectedProject {
  id: number;
  name: string;
  stage: number;
}

const summaryData = [
  { id: 'ready', label: 'Ready to advance', value: 12 },
  { id: 'blocked', label: 'Blocked', value: 8 },
  { id: 'awaiting-anp', label: 'Awaiting ANP', value: 15 },
  { id: 'awaiting-utility', label: 'Awaiting Utility', value: 7 },
];

export function MMEDashboard({ role, onChangeRole }: MMEDashboardProps) {
  const [activeItem, setActiveItem] = useState('workboard');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [stageFilter, setStageFilter] = useState<number | null>(null);
  const [selectedProject, setSelectedProject] = useState<SelectedProject | null>(null);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [activeZone, setActiveZone] = useState<string | null>(null);
  const [mismatchProject, setMismatchProject] = useState<string | null>(null);

  const showWorkboard = activeItem === 'workboard';

  const pageTitle = useMemo(() => {
    if (activeItem === 'workboard') return 'Project Readiness Workboard';
    if (activeItem === 'stage-gate-snapshot') return 'Stage-Gate Snapshot';
    if (activeItem === 'cross-checklist') return 'Cross-checklist Status';
    if (activeItem === 'blockers') return 'Blockers';
    if (activeItem === 'stage-definitions') return 'Stage Definitions';
    if (activeItem === 'shared-checklist') return 'Shared Checklist';
    if (activeItem === 'audit-log') return 'Audit Log / Change History';
    if (activeItem === 'help') return 'Help / FAQ';
    return 'Project Readiness Workboard';
  }, [activeItem]);

  const handleOpenProject = (project: SelectedProject) => {
    setSelectedProject(project);
    setReviewOpen(true);
  };

  const handleCloseReview = () => {
    setReviewOpen(false);
  };

  return (
    <>
      <DashboardLayout
        role={role}
        onChangeRole={onChangeRole}
        activeItem={activeItem}
        onNavigate={setActiveItem}
        breadcrumb={pageTitle}
      >
        <div className="space-y-6">
          <div className="flex flex-col gap-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1>{pageTitle}</h1>
                {showWorkboard ? (
                  <>
                    <p className="text-muted-foreground mt-1">
                      Sort, filter, and act on readiness across the injection pipeline.
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      MME starts here: prioritize projects, resolve blockers, and escalate only what is stuck at handoffs.
                    </p>
                  </>
                ) : (
                  <p className="text-muted-foreground mt-1">
                    System understanding and governance for readiness decisions.
                  </p>
                )}
              </div>
              {showWorkboard && (
                <span className="text-xs text-muted-foreground">
                  Hover over a workboard section to see why it exists.
                </span>
              )}
            </div>

            {showWorkboard && (
              <div className="flex flex-wrap gap-2" id="micro-summary">
                {summaryData.map((item) => {
                  const isActive = activeFilter === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveFilter(isActive ? null : item.id)}
                      className={`px-3 py-2 rounded-lg border text-sm flex items-center gap-2 ${
                        isActive
                          ? 'border-primary bg-accent'
                          : 'border-border bg-card hover:border-primary/50'
                      }`}
                    >
                      <span className="font-semibold">{item.value}</span>
                      <span className="text-muted-foreground">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {showWorkboard && (
            <div className="relative" id="workboard-area">
              <ProjectTable
                statusFilter={activeFilter}
                stageFilter={stageFilter}
                role={role}
                showHeader={false}
                onClearFilters={() => {
                  setActiveFilter(null);
                  setStageFilter(null);
                }}
                onOpenProject={handleOpenProject}
                onZoneHover={setActiveZone}
                onViewMismatch={(projectName) => {
                  setMismatchProject(projectName);
                  setActiveItem('cross-checklist');
                }}
              />

              {activeZone && (
                <div className="absolute inset-0 pointer-events-none" aria-hidden>
                  <div className="absolute inset-0 bg-black/20 rounded-lg" />
                  <div
                    className={`absolute bg-card/95 border border-border rounded-lg p-4 shadow-lg max-w-sm ${
                      activeZone === 'filters'
                        ? 'left-6 top-6'
                        : activeZone === 'readiness'
                          ? 'left-6 top-44'
                          : activeZone === 'checklist'
                            ? 'left-6 top-72'
                            : activeZone === 'mismatch'
                              ? 'right-6 top-56'
                              : activeZone === 'blockers'
                                ? 'right-6 top-72'
                                : activeZone === 'next-action'
                                  ? 'right-6 bottom-36'
                                  : 'right-6 bottom-20'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded-full text-[10px] tracking-widest bg-primary/10 text-primary">
                        GUIDE
                      </span>
                      <span className="text-[10px] text-muted-foreground">Hover to learn why</span>
                    </div>
                    {activeZone === 'filters' && (
                      <>
                        <div className="text-xs font-semibold mb-1">MME's job is triage + targeted escalation.</div>
                        <p className="text-xs text-muted-foreground">
                          Saved views and filters isolate blocked or overdue projects, then actions support requests, ownership, and escalation.
                        </p>
                      </>
                    )}
                    {activeZone === 'readiness' && (
                      <>
                        <div className="text-xs font-semibold mb-1">The system is a pipeline, so the UI is organized like one.</div>
                        <p className="text-xs text-muted-foreground">
                          Stage and readiness show where each project sits in the stage-gate flow, revealing bottlenecks at handoffs.
                        </p>
                      </>
                    )}
                    {activeZone === 'checklist' && (
                      <>
                        <div className="text-xs font-semibold mb-1">Checklist status appears because compliance is the biggest gate.</div>
                        <p className="text-xs text-muted-foreground">
                          ANP and utility completion are shown together to expose mismatch early and reduce rework loops.
                        </p>
                      </>
                    )}
                    {activeZone === 'mismatch' && (
                      <>
                        <div className="text-xs font-semibold mb-1">Mismatch badges exist to surface cross-stakeholder friction.</div>
                        <p className="text-xs text-muted-foreground">
                          Mismatches are flagged per project so MME can trigger alignment review before delays compound.
                        </p>
                      </>
                    )}
                    {activeZone === 'blockers' && (
                      <>
                        <div className="text-xs font-semibold mb-1">Blockers are visible because coordination fails without ownership.</div>
                        <p className="text-xs text-muted-foreground">
                          Blockers require owner + deadline so accountability is shared across agencies.
                        </p>
                      </>
                    )}
                    {activeZone === 'next-action' && (
                      <>
                        <div className="text-xs font-semibold mb-1">'Next action' prevents "progress without progress."</div>
                        <p className="text-xs text-muted-foreground">
                          A project isn't moving unless the next responsible step is clear; this translates complexity into an operational queue.
                        </p>
                      </>
                    )}
                    {activeZone === 'actions' && (
                      <>
                        <div className="text-xs font-semibold mb-1">Prioritized information: status + next action (not raw data).</div>
                        <p className="text-xs text-muted-foreground">
                          The actions column keeps the main feature operational, so MME can resolve blockers and request updates fast.
                        </p>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeItem === 'stage-gate-snapshot' && (
            <StageGateSnapshot
              stageFilter={stageFilter}
              onStageClick={(stage) => {
                setStageFilter(stage);
                if (stage) {
                  setActiveItem('workboard');
                }
              }}
            />
          )}

          {activeItem === 'cross-checklist' && (
            <div className="space-y-4">
              {mismatchProject && (
                <div className="px-4 py-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-sm">
                  Showing mismatches for <strong>{mismatchProject}</strong>. Use "Open Shared Checklist" for evidence rules.
                </div>
              )}
              <CrossChecklistStatus />
            </div>
          )}

          {activeItem === 'blockers' && <BlockersList />}

          {activeItem === 'stage-definitions' && (
            <div className="bg-card border border-border rounded-lg p-6 space-y-4">
              {[1, 2, 3, 4, 5].map((stage) => (
                <div key={stage} className="border-b border-border last:border-0 pb-4 last:pb-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs px-2 py-1 bg-muted rounded">Stage {stage}</span>
                    <h3>Stage {stage} Definition</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Criteria, readiness signals, and evidence requirements for Stage {stage} approvals.
                  </p>
                </div>
              ))}
            </div>
          )}

          {activeItem === 'shared-checklist' && (
            <div className="bg-card border border-border rounded-lg p-6 space-y-4">
              <div>
                <h2>Shared Checklist (ANP ↔ Utility)</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Evidence requirements and checklist items for each stage-gate handoff.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['Safety certification', 'Pressure test report', 'Environmental clearance', 'Connection agreement'].map((item) => (
                  <div key={item} className="border border-border rounded-lg p-4">
                    <h4>{item}</h4>
                    <p className="text-xs text-muted-foreground mt-2">
                      Required evidence, owner, and verification rules.
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeItem === 'audit-log' && (
            <div className="bg-card border border-border rounded-lg p-6 space-y-3">
              <h2>Audit Log / Change History</h2>
              {[
                '2026-03-10 — Project Alpha checklist updated by MME',
                '2026-03-09 — Blocker escalated for Project Delta',
                '2026-03-08 — Utility evidence uploaded for Project Beta',
              ].map((entry) => (
                <div key={entry} className="text-sm text-muted-foreground border-b border-border pb-2 last:border-0 last:pb-0">
                  {entry}
                </div>
              ))}
            </div>
          )}

          {activeItem === 'help' && (
            <div className="bg-card border border-border rounded-lg p-6 space-y-4">
              <h2>Help / FAQ</h2>
              <div>
                <h4>How do I escalate a blocker?</h4>
                <p className="text-sm text-muted-foreground">
                  Open the blocker list, assign an owner, then use the escalation action to notify leadership.
                </p>
              </div>
              <div>
                <h4>What counts as "ready"?</h4>
                <p className="text-sm text-muted-foreground">
                  Readiness is a combination of checklist completion, evidence verification, and stage-gate criteria.
                </p>
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>

      {reviewOpen && selectedProject && (
        <ProjectReadinessReview
          projectId={selectedProject.id}
          projectName={selectedProject.name}
          projectStage={selectedProject.stage}
          role={role}
          onClose={handleCloseReview}
        />
      )}
    </>
  );
}
