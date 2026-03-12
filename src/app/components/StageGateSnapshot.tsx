import { ArrowRight, ExternalLink, BarChart3 } from 'lucide-react';

interface StageGateSnapshotProps {
  stageFilter: number | null;
  onStageClick: (stage: number | null) => void;
}

const stageData = [
  { stage: 1, name: 'Planning', total: 12, ready: 8, atRisk: 3, blocked: 1, awaiting: 0 },
  { stage: 2, name: 'Design', total: 10, ready: 5, atRisk: 3, blocked: 1, awaiting: 1 },
  { stage: 3, name: 'Permitting', total: 9, ready: 3, atRisk: 2, blocked: 2, awaiting: 2 },
  { stage: 4, name: 'Construction', total: 7, ready: 4, atRisk: 1, blocked: 1, awaiting: 1 },
  { stage: 5, name: 'Commissioning', total: 4, ready: 2, atRisk: 1, blocked: 0, awaiting: 1 },
];

const maxTotal = Math.max(...stageData.map((s) => s.total));

export function StageGateSnapshot({ stageFilter, onStageClick }: StageGateSnapshotProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="w-4 h-4 text-muted-foreground" />
            <h2>Stage-Gate Snapshot</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Visual overview of stage-gates and project readiness. Click a stage to filter the project list.
          </p>
        </div>
        <button className="px-4 py-2 border border-border rounded-lg hover:bg-accent flex items-center gap-2 text-sm">
          View stage definitions
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>

      {/* Stage columns with funnel-like sizing */}
      <div className="flex items-end gap-3 mb-6 overflow-x-auto pb-2" aria-label="Stage-gate readiness overview by project">
        {stageData.map((stage, index) => {
          const readyPct = Math.round((stage.ready / stage.total) * 100);
          const isActive = stageFilter === stage.stage;
          const colHeight = Math.round((stage.total / maxTotal) * 100);

          // Stacked bar percentages
          const readyW = (stage.ready / stage.total) * 100;
          const atRiskW = (stage.atRisk / stage.total) * 100;
          const blockedW = (stage.blocked / stage.total) * 100;
          const awaitingW = (stage.awaiting / stage.total) * 100;

          return (
            <div key={stage.stage} className="flex items-end gap-0 flex-1 min-w-[100px]">
              <div className="flex-1 relative">
                {index < stageData.length - 1 && (
                  <ArrowRight className="absolute -right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10 hidden lg:block" />
                )}
                <button
                  onClick={() => onStageClick(isActive ? null : stage.stage)}
                  className={`w-full border-2 rounded-lg transition-all hover:shadow-md group ${
                    isActive
                      ? 'border-primary shadow-md'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  {/* Stage header */}
                  <div className={`p-3 rounded-t-md ${isActive ? 'bg-primary text-primary-foreground' : 'bg-muted/50'}`}>
                    <div className="text-xs opacity-70 mb-0.5">Stage {stage.stage}</div>
                    <div className={`text-sm font-medium ${isActive ? 'text-primary-foreground' : ''}`}>{stage.name}</div>
                  </div>

                  <div className="p-3 bg-card rounded-b-md">
                    {/* Project count */}
                    <div className="text-center mb-3">
                      <div className="text-2xl font-semibold">{stage.total}</div>
                      <div className="text-xs text-muted-foreground">projects</div>
                    </div>

                    {/* Stacked bar */}
                    <div className="h-3 rounded-full overflow-hidden flex mb-3" title={`Stage ${stage.stage} distribution`}>
                      <div className="bg-green-500 h-full" style={{ width: `${readyW}%` }} />
                      <div className="bg-amber-500 h-full" style={{ width: `${atRiskW}%` }} />
                      <div className="bg-red-500 h-full" style={{ width: `${blockedW}%` }} />
                      <div className="bg-blue-400 h-full" style={{ width: `${awaitingW}%` }} />
                    </div>

                    {/* Breakdown */}
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                          Ready
                        </span>
                        <span className="font-medium">{stage.ready}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0" />
                          At risk
                        </span>
                        <span className="font-medium">{stage.atRisk}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
                          Blocked
                        </span>
                        <span className="font-medium">{stage.blocked}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />
                          Awaiting
                        </span>
                        <span className="font-medium">{stage.awaiting}</span>
                      </div>
                    </div>

                    {/* Ready % indicator */}
                    <div className="mt-3 pt-3 border-t border-border">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-muted-foreground">% Ready</span>
                        <span className={`font-semibold ${readyPct >= 60 ? 'text-green-600' : readyPct >= 40 ? 'text-amber-600' : 'text-red-600'}`}>
                          {readyPct}%
                        </span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${readyPct >= 60 ? 'bg-green-500' : readyPct >= 40 ? 'bg-amber-500' : 'bg-red-500'}`}
                          style={{ width: `${readyPct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 flex-wrap text-xs">
        {[
          { color: 'bg-green-500', label: 'Ready' },
          { color: 'bg-amber-500', label: 'At risk' },
          { color: 'bg-red-500', label: 'Blocked' },
          { color: 'bg-blue-400', label: 'Awaiting review' },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className={`w-3 h-3 rounded-full ${color}`} />
            <span className="text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>

      <div className="sr-only">Stage-gate readiness overview by project</div>
    </div>
  );
}
