import { useState } from 'react';
import {
  ExternalLink,
  FileText,
  AlertCircle,
  FileDown,
  ChevronDown,
  Sparkles,
  Info,
  X,
  Zap,
} from 'lucide-react';

interface ProjectTableProps {
  statusFilter: string | null;
  stageFilter: number | null;
  role: 'MME' | 'ANP';
  onClearFilters: () => void;
  onOpenProject: (project: { id: number; name: string; stage: number }) => void;
  onViewMismatch: (projectName: string) => void;
  showHeader?: boolean;
  onZoneHover?: (zone: string | null) => void;
}

interface Project {
  id: number;
  name: string;
  region: string;
  stage: number;
  status: 'ready' | 'blocked' | 'awaiting-anp' | 'awaiting-utility';
  readiness: 'High' | 'Medium' | 'Low';
  owner: string;
  anpProgress: number;
  utilityProgress: number;
  blockers: number;
  mismatchCount: number;
  topBlockerOwner: string;
  topBlockerDeadline: string;
  lastUpdated: string;
  nextAction: string;
}

const projects: Project[] = [
  {
    id: 1,
    name: 'Project Alpha',
    region: 'Northern Region',
    stage: 3,
    status: 'awaiting-anp',
    readiness: 'High',
    owner: 'Maria Garcia',
    anpProgress: 92,
    utilityProgress: 88,
    blockers: 1,
    mismatchCount: 2,
    topBlockerOwner: 'Maria Garcia',
    topBlockerDeadline: '2026-03-12',
    lastUpdated: '2026-03-05',
    nextAction: 'ANP final review',
  },
  {
    id: 2,
    name: 'Project Beta',
    region: 'Coastal Development',
    stage: 2,
    status: 'awaiting-utility',
    readiness: 'Medium',
    owner: 'John Smith',
    anpProgress: 65,
    utilityProgress: 58,
    blockers: 3,
    mismatchCount: 1,
    topBlockerOwner: 'John Smith',
    topBlockerDeadline: '2026-03-11',
    lastUpdated: '2026-03-04',
    nextAction: 'Submit utility documents',
  },
  {
    id: 3,
    name: 'Project Gamma',
    region: 'Urban Expansion',
    stage: 4,
    status: 'ready',
    readiness: 'High',
    owner: 'Robert Chen',
    anpProgress: 95,
    utilityProgress: 93,
    blockers: 0,
    mismatchCount: 0,
    topBlockerOwner: '—',
    topBlockerDeadline: '—',
    lastUpdated: '2026-03-06',
    nextAction: 'Ready to advance',
  },
  {
    id: 4,
    name: 'Project Delta',
    region: 'Industrial Zone',
    stage: 1,
    status: 'blocked',
    readiness: 'Low',
    owner: 'Unassigned',
    anpProgress: 42,
    utilityProgress: 38,
    blockers: 5,
    mismatchCount: 3,
    topBlockerOwner: 'Robert Chen',
    topBlockerDeadline: '2026-03-14',
    lastUpdated: '2026-03-03',
    nextAction: 'Environmental clearance',
  },
  {
    id: 5,
    name: 'Project Epsilon',
    region: 'Rural Access',
    stage: 2,
    status: 'awaiting-anp',
    readiness: 'Medium',
    owner: 'Maria Garcia',
    anpProgress: 71,
    utilityProgress: 69,
    blockers: 2,
    mismatchCount: 2,
    topBlockerOwner: 'Unassigned',
    topBlockerDeadline: '2026-03-13',
    lastUpdated: '2026-03-05',
    nextAction: 'Awaiting ANP approval',
  },
  {
    id: 6,
    name: 'Project Zeta',
    region: 'Southern Grid',
    stage: 5,
    status: 'ready',
    readiness: 'High',
    owner: 'Robert Chen',
    anpProgress: 98,
    utilityProgress: 97,
    blockers: 0,
    mismatchCount: 0,
    topBlockerOwner: '—',
    topBlockerDeadline: '—',
    lastUpdated: '2026-03-07',
    nextAction: 'Commissioning sign-off',
  },
];

export function ProjectTable({
  statusFilter,
  stageFilter,
  role,
  onClearFilters,
  onOpenProject,
  onViewMismatch,
  showHeader = true,
  onZoneHover,
}: ProjectTableProps) {
  const [selectedStage, setSelectedStage] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedOwner, setSelectedOwner] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('deadline');
  const [savedView, setSavedView] = useState<string>('all');
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [aiProject, setAIProject] = useState<Project | null>(null);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [showAIUnavailable, setShowAIUnavailable] = useState(false);

  const clearLocalFilters = () => {
    setSavedView('all');
    setSelectedStage('all');
    setSelectedStatus('all');
    setSelectedRegion('all');
    setSelectedOwner('all');
    setSortBy('deadline');
  };

  const hasActiveFilters =
    statusFilter ||
    stageFilter ||
    selectedStage !== 'all' ||
    selectedStatus !== 'all' ||
    selectedRegion !== 'all' ||
    selectedOwner !== 'all' ||
    sortBy !== 'deadline' ||
    savedView !== 'all';

  const savedViews = [
    { id: 'all', label: 'All' },
    { id: 'blocked', label: 'Blocked', status: 'blocked' },
    { id: 'awaiting-anp', label: 'Awaiting ANP', status: 'awaiting-anp' },
    { id: 'awaiting-utility', label: 'Awaiting Utility', status: 'awaiting-utility' },
    { id: 'due-soon', label: 'Due soon (14 days)', sortBy: 'deadline' },
    { id: 'high-blocker-count', label: 'High blocker count', sortBy: 'blocked' },
  ];

  // Active filter chips labels
  const filterChips: { label: string; onRemove: () => void }[] = [];
  if (savedView !== 'all') {
    const label = savedViews.find((view) => view.id === savedView)?.label ?? 'Saved view';
    filterChips.push({
      label: `Saved view: ${label}`,
      onRemove: () => {
        setSavedView('all');
        setSelectedStatus('all');
        setSelectedStage('all');
        setSelectedRegion('all');
        setSelectedOwner('all');
        setSortBy('deadline');
      },
    });
  }
  if (statusFilter) {
    const labels: Record<string, string> = {
      total: 'Total projects',
      ready: 'Ready to advance',
      blocked: 'Blocked',
      'awaiting-anp': 'Awaiting ANP',
      'awaiting-utility': 'Awaiting utility',
    };
    filterChips.push({ label: labels[statusFilter] ?? statusFilter, onRemove: () => onClearFilters() });
  }
  if (stageFilter) {
    filterChips.push({ label: `Stage ${stageFilter}`, onRemove: () => onClearFilters() });
  }

  const getReadinessColor = (readiness: string) => {
    switch (readiness) {
      case 'High': return 'bg-green-500/10 text-green-700';
      case 'Medium': return 'bg-amber-500/10 text-amber-700';
      case 'Low': return 'bg-red-500/10 text-red-700';
      default: return 'bg-gray-500/10 text-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'bg-green-500/10 text-green-700';
      case 'blocked': return 'bg-red-500/10 text-red-700';
      case 'awaiting-anp': return 'bg-blue-500/10 text-blue-700';
      case 'awaiting-utility': return 'bg-purple-500/10 text-purple-700';
      default: return 'bg-gray-500/10 text-gray-700';
    }
  };

  const statusLabel: Record<string, string> = {
    ready: 'Ready',
    blocked: 'Blocked',
    'awaiting-anp': 'Awaiting ANP',
    'awaiting-utility': 'Awaiting Utility',
  };

  // Filter projects
  let filtered = projects;
  if (statusFilter && statusFilter !== 'total') {
    filtered = filtered.filter((p) => p.status === statusFilter);
  }
  if (stageFilter) {
    filtered = filtered.filter((p) => p.stage === stageFilter);
  }
  if (selectedStage !== 'all') {
    filtered = filtered.filter((p) => p.stage === parseInt(selectedStage));
  }
  if (selectedStatus !== 'all') {
    filtered = filtered.filter((p) => p.status === selectedStatus);
  }

  if (selectedRegion !== 'all') {
    const regionMap: Record<string, string> = {
      northern: 'Northern',
      coastal: 'Coastal',
      urban: 'Urban',
      industrial: 'Industrial',
      rural: 'Rural',
    };
    const regionLabel = regionMap[selectedRegion];
    if (regionLabel) {
      filtered = filtered.filter((p) => p.region.includes(regionLabel));
    }
  }

  if (selectedOwner !== 'all') {
    const ownerMap: Record<string, string> = {
      john: 'John Smith',
      maria: 'Maria Garcia',
      robert: 'Robert Chen',
    };
    const ownerLabel = ownerMap[selectedOwner];
    if (ownerLabel) {
      filtered = filtered.filter((p) => p.owner === ownerLabel);
    }
  }

  const dateValue = (value: string) => {
    if (!value || value === '—') return 0;
    return new Date(value).getTime();
  };
  filtered = [...filtered].sort((a, b) => {
    if (sortBy === 'blocked') {
      return b.blockers - a.blockers;
    }
    if (sortBy === 'updated') {
      return dateValue(b.lastUpdated) - dateValue(a.lastUpdated);
    }
    return dateValue(a.topBlockerDeadline) - dateValue(b.topBlockerDeadline);
  });

  return (
    <>
      <div className="bg-card border border-border rounded-lg p-6" id="project-list">
        {/* Header */}
        {showHeader && (
          <div className="mb-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2>Project List</h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Click any row to open the project review.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAIUnavailable(!showAIUnavailable)}
                  className="text-xs text-muted-foreground hover:text-foreground border border-border rounded px-2 py-1"
                >
                  {showAIUnavailable ? 'Enable AI' : 'Simulate AI offline'}
                </button>
                {hasActiveFilters && (
                  <button
                    onClick={() => {
                      clearLocalFilters();
                      onClearFilters();
                    }}
                    className="text-sm text-primary hover:underline"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="mb-5">
          {!showHeader && (
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm text-muted-foreground">Filters and saved views</div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAIUnavailable(!showAIUnavailable)}
                  className="text-xs text-muted-foreground hover:text-foreground border border-border rounded px-2 py-1"
                >
                  {showAIUnavailable ? 'Enable AI' : 'Simulate AI offline'}
                </button>
                {hasActiveFilters && (
                  <button
                    onClick={() => {
                      clearLocalFilters();
                      onClearFilters();
                    }}
                    className="text-sm text-primary hover:underline"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Saved views */}
          <div
            className="flex flex-wrap gap-2 mb-3"
            onMouseEnter={() => onZoneHover?.('filters')}
            onMouseLeave={() => onZoneHover?.(null)}
          >
            {savedViews.map((view) => (
              <button
                key={view.id}
                onClick={() => {
                  setSavedView(view.id);
                  if (view.status) {
                    setSelectedStatus(view.status);
                  } else if (view.id === 'all') {
                    setSelectedStatus('all');
                    setSelectedStage('all');
                    setSelectedRegion('all');
                    setSelectedOwner('all');
                  }
                  if (view.sortBy) {
                    setSortBy(view.sortBy);
                  }
                }}
                className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                  savedView === view.id
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-muted/40 text-muted-foreground border-border hover:bg-accent'
                }`}
              >
                {view.label}
              </button>
            ))}
          </div>

          {/* Active filter chips */}
          {filterChips.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="text-xs text-muted-foreground mt-1">Active filters:</span>
              {filterChips.map((chip) => (
                <span
                  key={chip.label}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 text-primary rounded-full text-xs"
                >
                  {chip.label}
                  <button onClick={chip.onRemove} className="hover:opacity-70">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* AI Unavailable Banner */}
          {showAIUnavailable && (
            <div className="mb-3 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-center gap-3">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-amber-700">AI unavailable — continue manually</p>
                <p className="text-xs text-amber-700/80 mt-0.5">
                  Readiness scores are based on checklist completion only. AI-assisted insights are temporarily unavailable.
                </p>
              </div>
            </div>
          )}

          {/* Filters */}
          <div
            className="grid grid-cols-2 md:grid-cols-5 gap-3"
            onMouseEnter={() => onZoneHover?.('filters')}
            onMouseLeave={() => onZoneHover?.(null)}
          >
            {[
              { value: selectedStage, onChange: setSelectedStage, options: [['all', 'All Stages'], ['1','Stage 1'],['2','Stage 2'],['3','Stage 3'],['4','Stage 4'],['5','Stage 5']] },
              { value: selectedStatus, onChange: setSelectedStatus, options: [['all','All Status'],['ready','Ready'],['blocked','Blocked'],['awaiting-anp','Awaiting ANP'],['awaiting-utility','Awaiting Utility']] },
              { value: selectedRegion, onChange: setSelectedRegion, options: [['all','All Regions'],['northern','Northern'],['coastal','Coastal'],['urban','Urban'],['industrial','Industrial'],['rural','Rural']] },
              { value: selectedOwner, onChange: setSelectedOwner, options: [['all','All Owners'],['john','John Smith'],['maria','Maria Garcia'],['robert','Robert Chen']] },
              { value: sortBy, onChange: setSortBy, options: [['deadline','Deadline soonest'],['blocked','Most blocked'],['updated','Recently updated']] },
            ].map((filter, i) => (
              <div key={i} className="relative">
                <select
                  value={filter.value}
                  onChange={(e) => filter.onChange(e.target.value)}
                  className="w-full px-3 py-2 pr-8 bg-input-background border border-border rounded-lg appearance-none cursor-pointer text-sm"
                >
                  {filter.options.map(([val, label]) => (
                    <option key={val} value={val}>{label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground whitespace-nowrap">Project</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground whitespace-nowrap">Stage</th>
                <th
                  className="text-left py-3 px-4 text-sm font-medium text-muted-foreground whitespace-nowrap"
                  onMouseEnter={() => onZoneHover?.('readiness')}
                  onMouseLeave={() => onZoneHover?.(null)}
                >
                  <div className="flex items-center gap-1">
                    Readiness
                    {!showAIUnavailable && (
                      <span title="AI-assisted">
                        <Sparkles className="w-3 h-3 text-blue-500" />
                      </span>
                    )}
                  </div>
                </th>
                <th
                  className="text-left py-3 px-4 text-sm font-medium text-muted-foreground whitespace-nowrap"
                  onMouseEnter={() => onZoneHover?.('checklist')}
                  onMouseLeave={() => onZoneHover?.(null)}
                >
                  Checklist Status
                </th>
                <th
                  className="text-left py-3 px-4 text-sm font-medium text-muted-foreground whitespace-nowrap"
                  onMouseEnter={() => onZoneHover?.('mismatch')}
                  onMouseLeave={() => onZoneHover?.(null)}
                >
                  Mismatch
                </th>
                <th
                  className="text-left py-3 px-4 text-sm font-medium text-muted-foreground whitespace-nowrap"
                  onMouseEnter={() => onZoneHover?.('blockers')}
                  onMouseLeave={() => onZoneHover?.(null)}
                >
                  Blockers
                </th>
                <th
                  className="text-left py-3 px-4 text-sm font-medium text-muted-foreground whitespace-nowrap"
                  onMouseEnter={() => onZoneHover?.('blockers')}
                  onMouseLeave={() => onZoneHover?.(null)}
                >
                  Top Blocker
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground whitespace-nowrap">Last Updated</th>
                <th
                  className="text-left py-3 px-4 text-sm font-medium text-muted-foreground whitespace-nowrap"
                  onMouseEnter={() => onZoneHover?.('next-action')}
                  onMouseLeave={() => onZoneHover?.(null)}
                >
                  Next Action
                </th>
                <th
                  className="text-left py-3 px-4 text-sm font-medium text-muted-foreground whitespace-nowrap"
                  onMouseEnter={() => onZoneHover?.('actions')}
                  onMouseLeave={() => onZoneHover?.(null)}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((project) => {
                const isHovered = hoveredRow === project.id;
                return (
                  <tr
                    key={project.id}
                    className={`border-b border-border last:border-0 transition-all cursor-pointer group ${
                      isHovered ? 'outline outline-2 outline-primary bg-accent/30 rounded' : 'hover:bg-accent/20'
                    }`}
                    onMouseEnter={() => setHoveredRow(project.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                    onClick={() => onOpenProject({ id: project.id, name: `${project.name} — ${project.region}`, stage: project.stage })}
                    title="Open main feature: Project Readiness Review"
                  >
                    <td className="py-3 px-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{project.name}</span>
                          {/* Inline hint on hover */}
                          {isHovered && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary text-primary-foreground rounded text-xs whitespace-nowrap">
                              <Zap className="w-2.5 h-2.5" />
                              Open main feature: Project Readiness Review
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">{project.region}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-muted rounded text-xs">Stage {project.stage}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className={`px-2 py-0.5 rounded text-xs ${getReadinessColor(project.readiness)}`}>
                          {project.readiness}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(project.status)}`}>
                          {statusLabel[project.status]}
                        </span>
                        {!showAIUnavailable && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setAIProject(project);
                              setShowAIPanel(true);
                            }}
                            className="p-1 hover:bg-accent rounded"
                            title="Why this score?"
                          >
                            <Info className="w-3 h-3 text-muted-foreground" />
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-muted-foreground w-12">ANP</span>
                          <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden min-w-[48px]">
                            <div className="h-full bg-blue-500" style={{ width: `${project.anpProgress}%` }} />
                          </div>
                          <span className="w-9 text-right">{project.anpProgress}%</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-muted-foreground w-12">Utility</span>
                          <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden min-w-[48px]">
                            <div className="h-full bg-purple-500" style={{ width: `${project.utilityProgress}%` }} />
                          </div>
                          <span className="w-9 text-right">{project.utilityProgress}%</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {project.mismatchCount > 0 ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onViewMismatch(`${project.name} — ${project.region}`);
                          }}
                          className="px-2 py-1 rounded-full text-xs bg-amber-500/10 text-amber-700 border border-amber-500/30 hover:bg-amber-500/20"
                          title="View cross-checklist mismatches"
                        >
                          Mismatch: {project.mismatchCount}
                        </button>
                      ) : (
                        <span className="text-xs text-muted-foreground">None</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {project.blockers > 0 ? (
                        <div className="flex items-center gap-1">
                          <AlertCircle className="w-4 h-4 text-red-500" />
                          <span className="text-sm font-medium">{project.blockers}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">None</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {project.blockers > 0 ? (
                        <div className="space-y-0.5">
                          <div className="text-xs text-muted-foreground">Owner</div>
                          <div>{project.topBlockerOwner}</div>
                          <div className="text-xs text-muted-foreground">Deadline</div>
                          <div>{project.topBlockerDeadline}</div>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground whitespace-nowrap">{project.lastUpdated}</td>
                    <td className="py-3 px-4 text-sm max-w-[140px]">{project.nextAction}</td>
                    <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                      <div className="flex gap-1">
                        <button
                          onClick={() => onOpenProject({ id: project.id, name: `${project.name} — ${project.region}`, stage: project.stage })}
                          className="px-2 py-1 bg-primary text-primary-foreground rounded hover:opacity-90 flex items-center gap-1 text-xs whitespace-nowrap"
                          title="Open project review"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Open project
                        </button>
                        <button className="p-1.5 hover:bg-accent rounded" title="View evidence">
                          <FileText className="w-4 h-4" />
                        </button>
                        {role === 'MME' && (
                          <button className="p-1.5 hover:bg-accent rounded" title="Add blocker">
                            <AlertCircle className="w-4 h-4" />
                          </button>
                        )}
                        <button className="p-1.5 hover:bg-accent rounded" title="Request update">
                          <Info className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 hover:bg-accent rounded" title="Export project report">
                          <FileDown className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-muted-foreground text-sm">
                    No projects match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="sr-only">Project list — click any row to open the project review</div>
      </div>

      {/* AI Explanation Panel */}
      {showAIPanel && aiProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <div className="bg-card border border-border rounded-lg max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-500" />
                <h2>Why This Score? — {aiProject.name}</h2>
              </div>
              <button
                onClick={() => { setShowAIPanel(false); setAIProject(null); }}
                className="p-1.5 hover:bg-accent rounded-lg"
              >
                <ExternalLink className="w-4 h-4 rotate-180" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <h4 className="mb-2">Inputs Used</h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li>ANP checklist completion: {aiProject.anpProgress}%</li>
                  <li>Utility checklist completion: {aiProject.utilityProgress}%</li>
                  <li>Active blockers: {aiProject.blockers}</li>
                  <li>Stage {aiProject.stage} criteria met</li>
                  <li>Evidence documents: verified</li>
                </ul>
              </div>

              <div>
                <h4 className="mb-2">Top Missing Requirements</h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  {aiProject.readiness !== 'High' && <li>Additional checklist items pending submission</li>}
                  {aiProject.blockers > 0 && <li>{aiProject.blockers} active blocker(s) require resolution</li>}
                  <li>Final evidence package review by MME</li>
                </ul>
              </div>

              <div>
                <h4 className="mb-2">Uncertainty Indicator</h4>
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${aiProject.readiness === 'High' ? 'bg-green-500' : aiProject.readiness === 'Medium' ? 'bg-amber-500' : 'bg-red-500'}`}
                      style={{ width: aiProject.readiness === 'High' ? '85%' : aiProject.readiness === 'Medium' ? '55%' : '30%' }}
                    />
                  </div>
                  <span className="text-sm font-medium">
                    {aiProject.readiness === 'High' ? 'Low (85% confidence)' : aiProject.readiness === 'Medium' ? 'Medium (55% confidence)' : 'High uncertainty (30%)'}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {aiProject.readiness === 'High' ? 'Based on complete data and historical patterns.' : 'Incomplete submissions reduce scoring confidence.'}
                </p>
              </div>
            </div>

            <button
              onClick={() => { setShowAIPanel(false); setAIProject(null); }}
              className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 text-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
