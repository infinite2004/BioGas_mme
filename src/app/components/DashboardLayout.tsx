import { useState } from 'react';
import {
  Home,
  FolderKanban,
  GitBranch,
  CheckSquare,
  AlertCircle,
  History,
  HelpCircle,
  Search,
  Bell,
  User,
  FileDown,
  FileText,
  Menu,
  X,
  ClipboardCheck,
  ChevronRight,
} from 'lucide-react';

interface DashboardLayoutProps {
  role: 'MME' | 'Utilities' | 'ANP';
  onChangeRole: () => void;
  activeItem: string;
  onNavigate: (id: string) => void;
  children: React.ReactNode;
  breadcrumb?: string;
}

const mmeNavSections = [
  {
    label: 'Home',
    items: [{ icon: FolderKanban, label: 'Workboard (Project List)', id: 'workboard' }],
  },
  {
    label: 'Insights',
    items: [
      { icon: GitBranch, label: 'Stage-Gate Snapshot', id: 'stage-gate-snapshot' },
      { icon: CheckSquare, label: 'Cross-checklist Status', id: 'cross-checklist' },
      { icon: AlertCircle, label: 'Blockers', id: 'blockers' },
    ],
  },
  {
    label: 'Reference',
    items: [
      { icon: ClipboardCheck, label: 'Stage Definitions', id: 'stage-definitions' },
      { icon: FileText, label: 'Shared Checklist', id: 'shared-checklist' },
    ],
  },
  {
    label: 'Governance',
    items: [
      { icon: History, label: 'Audit Log / Change History', id: 'audit-log' },
      { icon: HelpCircle, label: 'Help / FAQ', id: 'help' },
    ],
  },
];

const utilityNavSections = [
  {
    label: 'Home',
    items: [{ icon: Home, label: 'Utility Readiness Worklist', id: 'utility-home' }],
  },
  {
    label: 'Governance',
    items: [{ icon: HelpCircle, label: 'Help / FAQ', id: 'help' }],
  },
];

export function DashboardLayout({
  role,
  onChangeRole,
  activeItem,
  onNavigate,
  children,
  breadcrumb,
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navSections = role === 'Utilities' ? utilityNavSections : mmeNavSections;

  const breadcrumbHome = role === 'Utilities' ? 'Utility Home' : 'Home';
  const defaultBreadcrumbs: Record<string, string> = {
    workboard: 'Workboard (Project List)',
    'stage-gate-snapshot': 'Stage-Gate Snapshot',
    'cross-checklist': 'Cross-checklist Status',
    blockers: 'Blockers',
    'stage-definitions': 'Stage Definitions',
    'shared-checklist': 'Shared Checklist',
    'audit-log': 'Audit Log / Change History',
    help: 'Help / FAQ',
    'utility-home': 'Utility Readiness Worklist',
  };
  const breadcrumbPage = breadcrumb ?? defaultBreadcrumbs[activeItem] ?? 'Workboard (Project List)';

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full bg-sidebar border-r border-sidebar-border transition-all duration-300 z-30 ${
          sidebarOpen ? 'w-64' : 'w-0'
        } overflow-hidden`}
      >
        <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
          <h2 className="text-sidebar-foreground">GateReady</h2>
        </div>

        <nav className="p-3">
          {navSections.map((section) => (
            <div key={section.label} className="mb-4">
              <div className="mb-1 px-3">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                  {section.label}
                </span>
              </div>
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-colors ${
                      activeItem === item.id
                        ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                        : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                    }`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm text-left">{item.label}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}
      >
        {/* Header */}
        <header className="bg-card border-b border-border sticky top-0 z-20">
          <div className="flex items-center justify-between px-6 py-3">
            <div className="flex items-center gap-4 flex-1">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-accent rounded-lg"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <div className="flex-1 max-w-xl">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search projects, regions, owners…"
                    className="w-full pl-10 pr-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 flex items-center gap-1.5 text-sm">
                <FileDown className="w-4 h-4" />
                <span className="hidden md:inline">Export summary (PDF)</span>
              </button>
              <button className="px-3 py-1.5 border border-border rounded-lg hover:bg-accent flex items-center gap-1.5 text-sm">
                <FileDown className="w-4 h-4" />
                <span className="hidden md:inline">Export blockers (CSV)</span>
              </button>

              <div className="h-6 w-px bg-border mx-1" />

              <button
                onClick={onChangeRole}
                className="px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm hover:bg-primary/20"
              >
                {role}
              </button>
              <button className="p-2 hover:bg-accent rounded-lg relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-destructive rounded-full" />
              </button>
              <button className="p-2 hover:bg-accent rounded-lg">
                <User className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Breadcrumbs */}
          <div className="flex items-center gap-1.5 px-6 py-2 border-t border-border/60 bg-muted/20">
            <span className="text-xs text-muted-foreground">{breadcrumbHome}</span>
            <ChevronRight className="w-3 h-3 text-muted-foreground" />
            <span className="text-xs text-foreground">{breadcrumbPage}</span>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="p-6">{children}</main>

        {/* Footer */}
        <footer className="border-t border-border px-6 py-5 text-sm text-muted-foreground">
          <div className="max-w-4xl space-y-2">
            <p>
              <strong>Support implications:</strong> Weekly checklist policy updates; monthly review
              of stage-gate definitions; onboarding for new orgs.
            </p>
            <p>
              <strong>Technical considerations:</strong> Role-based access (MME vs ANP vs utility vs
              developer), audit logging + version history, evidence storage/links, optional AI
              services with fallback mode.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
