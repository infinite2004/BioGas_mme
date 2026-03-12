import { FolderKanban, CheckCircle, AlertCircle, Clock, Users } from 'lucide-react';

interface KPICardsProps {
  activeFilter: string | null;
  onFilterChange: (filter: string | null) => void;
}

const kpiData = [
  {
    id: 'total',
    label: 'Total projects',
    value: 42,
    icon: FolderKanban,
    color: 'bg-blue-500/10 text-blue-700',
  },
  {
    id: 'ready',
    label: 'Ready to advance',
    value: 12,
    icon: CheckCircle,
    color: 'bg-green-500/10 text-green-700',
  },
  {
    id: 'blocked',
    label: 'Blocked',
    value: 8,
    icon: AlertCircle,
    color: 'bg-red-500/10 text-red-700',
  },
  {
    id: 'awaiting-anp',
    label: 'Awaiting ANP',
    value: 15,
    icon: Clock,
    color: 'bg-amber-500/10 text-amber-700',
  },
  {
    id: 'awaiting-utility',
    label: 'Awaiting utility',
    value: 7,
    icon: Users,
    color: 'bg-purple-500/10 text-purple-700',
  },
];

export function KPICards({ activeFilter, onFilterChange }: KPICardsProps) {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-3">
        {kpiData.map((kpi) => {
          const Icon = kpi.icon;
          const isActive = activeFilter === kpi.id;

          return (
            <button
              key={kpi.id}
              onClick={() => onFilterChange(isActive ? null : kpi.id)}
              className={`p-4 rounded-lg border-2 transition-all hover:shadow-md ${
                isActive
                  ? 'border-primary bg-accent'
                  : 'border-border bg-card hover:border-primary/50'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className={`p-2 rounded-lg ${kpi.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl font-semibold mb-1">{kpi.value}</div>
              <div className="text-sm text-muted-foreground">{kpi.label}</div>
            </button>
          );
        })}
      </div>
      {activeFilter && (
        <button
          onClick={() => onFilterChange(null)}
          className="text-sm text-primary hover:underline"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
