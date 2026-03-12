import { useState } from 'react';
import { DashboardLayout } from './DashboardLayout';
import { Upload, CheckCircle, MessageSquare, FileDown, AlertCircle } from 'lucide-react';

interface UtilityDashboardProps {
  onChangeRole: () => void;
}

interface Task {
  id: number;
  item: string;
  project: string;
  deadline: string;
  status: 'pending' | 'in-progress' | 'completed';
}

const tasks: Task[] = [
  {
    id: 1,
    item: 'Upload pressure test report',
    project: 'Project Alpha',
    deadline: '2026-03-12',
    status: 'pending',
  },
  {
    id: 2,
    item: 'Provide connection agreement',
    project: 'Project Beta',
    deadline: '2026-03-15',
    status: 'in-progress',
  },
  {
    id: 3,
    item: 'Submit safety inspection certificate',
    project: 'Project Gamma',
    deadline: '2026-03-10',
    status: 'pending',
  },
  {
    id: 4,
    item: 'Update capacity assessment document',
    project: 'Project Delta',
    deadline: '2026-03-18',
    status: 'completed',
  },
];

const awaitingProjects = [
  {
    id: 1,
    name: 'Project Alpha - Northern Region',
    tasks: 3,
    deadline: '2026-03-12',
    priority: 'High',
  },
  {
    id: 2,
    name: 'Project Beta - Coastal Development',
    tasks: 5,
    deadline: '2026-03-15',
    priority: 'Medium',
  },
  {
    id: 3,
    name: 'Project Gamma - Urban Expansion',
    tasks: 2,
    deadline: '2026-03-10',
    priority: 'High',
  },
];

export function UtilityDashboard({ onChangeRole }: UtilityDashboardProps) {
  const [activeItem, setActiveItem] = useState('utility-home');

  return (
    <DashboardLayout
      role="Utilities"
      onChangeRole={onChangeRole}
      activeItem={activeItem}
      onNavigate={setActiveItem}
      breadcrumb={activeItem === 'help' ? 'Help / FAQ' : 'Utility Readiness Worklist'}
    >
      {activeItem === 'utility-home' ? (
        <div className="space-y-6">
          <div>
            <h1>Utility Readiness Worklist</h1>
            <p className="text-muted-foreground mt-1">
              Complete checklist items, upload evidence, and flag issues for MME attention.
            </p>
          </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-card border border-border rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <CheckCircle className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-semibold">12</div>
                <div className="text-sm text-muted-foreground">Pending Tasks</div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-card border border-border rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-amber-500/10 rounded-lg">
                <AlertCircle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <div className="text-2xl font-semibold">5</div>
                <div className="text-sm text-muted-foreground">Overdue</div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-card border border-border rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-semibold">28</div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-card border border-border rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Upload className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-semibold">7</div>
                <div className="text-sm text-muted-foreground">Projects Awaiting</div>
              </div>
            </div>
          </div>
        </div>

        {/* My Tasks */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="mb-4">My Tasks</h2>

          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4>{task.item}</h4>
                      {task.status === 'completed' && (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{task.project}</span>
                      <span>•</span>
                      <span>Due: {task.deadline}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      disabled={task.status === 'completed'}
                      className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Upload className="w-4 h-4" />
                      Upload evidence
                    </button>
                    <button
                      disabled={task.status === 'completed'}
                      className="px-3 py-1.5 border border-border rounded-lg hover:bg-accent flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Mark complete
                    </button>
                    <button className="px-3 py-1.5 border border-border rounded-lg hover:bg-accent flex items-center gap-2 text-sm">
                      <MessageSquare className="w-4 h-4" />
                      Request clarification
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

          {/* Projects Awaiting Utility */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2>Projects Awaiting Utility</h2>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 flex items-center gap-2">
                  <FileDown className="w-4 h-4" />
                  <span className="text-sm">Export my worklist (CSV)</span>
                </button>
                <button className="px-4 py-2 border border-border rounded-lg hover:bg-accent flex items-center gap-2">
                  <FileDown className="w-4 h-4" />
                  <span className="text-sm">Export project summary (PDF)</span>
                </button>
              </div>
            </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Project
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Pending Tasks
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Deadline
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Priority
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {awaitingProjects.map((project) => (
                  <tr key={project.id} className="border-b border-border last:border-0">
                    <td className="py-3 px-4">
                      <span className="text-sm font-medium">{project.name}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm">{project.tasks} tasks</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm">{project.deadline}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          project.priority === 'High'
                            ? 'bg-red-500/10 text-red-700'
                            : 'bg-amber-500/10 text-amber-700'
                        }`}
                      >
                        {project.priority}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button className="px-3 py-1.5 bg-amber-500/10 text-amber-700 border border-amber-500/30 rounded-lg hover:bg-amber-500/20 flex items-center gap-2 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        Flag for MME attention
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </div>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <h2>Help / FAQ</h2>
          <div>
            <h4>How do I upload evidence?</h4>
            <p className="text-sm text-muted-foreground">
              Use the “Upload evidence” action in your task list to attach files or links.
            </p>
          </div>
          <div>
            <h4>Can utilities escalate blockers?</h4>
            <p className="text-sm text-muted-foreground">
              Utilities can flag issues for MME attention, but escalation authority remains with MME.
            </p>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}