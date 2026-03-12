import { useState } from 'react';
import { AlertCircle, TrendingUp, UserPlus, Send, CheckCircle } from 'lucide-react';

interface Blocker {
  id: number;
  blocker: string;
  project: string;
  owner: string;
  deadline: string;
  dependencies: string[];
  status: 'Open' | 'In progress' | 'Escalated';
}

const blockers: Blocker[] = [
  {
    id: 1,
    blocker: 'Missing environmental clearance',
    project: 'Project Alpha',
    owner: 'John Smith',
    deadline: '2026-03-15',
    dependencies: ['ANP', 'Developer'],
    status: 'Escalated',
  },
  {
    id: 2,
    blocker: 'Utility connection approval pending',
    project: 'Project Beta',
    owner: 'Maria Garcia',
    deadline: '2026-03-20',
    dependencies: ['Utility'],
    status: 'In progress',
  },
  {
    id: 3,
    blocker: 'Incomplete pressure test documentation',
    project: 'Project Gamma',
    owner: 'Unassigned',
    deadline: '2026-03-12',
    dependencies: ['Utility', 'ANP'],
    status: 'Open',
  },
  {
    id: 4,
    blocker: 'Safety certification expired',
    project: 'Project Delta',
    owner: 'Robert Chen',
    deadline: '2026-03-18',
    dependencies: ['Developer'],
    status: 'In progress',
  },
];

const heatmapData = [
  { stage: 'Stage 1', count: 2 },
  { stage: 'Stage 2', count: 5 },
  { stage: 'Stage 3', count: 8 },
  { stage: 'Stage 4', count: 3 },
  { stage: 'Stage 5', count: 1 },
];

export function BlockersList() {
  const [selectedBlocker, setSelectedBlocker] = useState<number | null>(null);
  const [modalType, setModalType] = useState<'assign' | 'escalate' | 'update' | 'resolve' | null>(
    null
  );

  const openModal = (blockerId: number, type: typeof modalType) => {
    setSelectedBlocker(blockerId);
    setModalType(type);
  };

  const closeModal = () => {
    setSelectedBlocker(null);
    setModalType(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open':
        return 'bg-red-500/10 text-red-700 border-red-500/30';
      case 'In progress':
        return 'bg-amber-500/10 text-amber-700 border-amber-500/30';
      case 'Escalated':
        return 'bg-purple-500/10 text-purple-700 border-purple-500/30';
      default:
        return 'bg-gray-500/10 text-gray-700 border-gray-500/30';
    }
  };

  const maxCount = Math.max(...heatmapData.map((d) => d.count));

  return (
    <>
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h2>Blockers Requiring MME Attention</h2>
            <p className="text-sm text-muted-foreground mt-1">
              High-priority blockers ranked by urgency and impact
            </p>
          </div>

          {/* Blocker Heatmap */}
          <div className="bg-accent/50 rounded-lg p-4 min-w-[240px]">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-primary" />
              <h4>Blocker Heatmap</h4>
            </div>
            <div className="space-y-2">
              {heatmapData.map((item) => (
                <div key={item.stage} className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground w-16">{item.stage}</span>
                  <div className="flex-1 h-4 bg-muted rounded-sm overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-red-500 transition-all"
                      style={{ width: `${(item.count / maxCount) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium w-6 text-right">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Blocker
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Project
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Owner
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Deadline
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Dependencies
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {blockers.map((blocker) => (
                <tr key={blocker.id} className="border-b border-border last:border-0">
                  <td className="py-3 px-4">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{blocker.blocker}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm">{blocker.project}</td>
                  <td className="py-3 px-4 text-sm">
                    {blocker.owner === 'Unassigned' ? (
                      <span className="text-muted-foreground italic">{blocker.owner}</span>
                    ) : (
                      blocker.owner
                    )}
                  </td>
                  <td className="py-3 px-4 text-sm">{blocker.deadline}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-1 flex-wrap">
                      {blocker.dependencies.map((dep) => (
                        <span
                          key={dep}
                          className="px-2 py-0.5 bg-muted text-muted-foreground rounded text-xs"
                        >
                          {dep}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded text-xs border ${getStatusColor(
                        blocker.status
                      )}`}
                    >
                      {blocker.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-1">
                      <button
                        onClick={() => openModal(blocker.id, 'assign')}
                        className="p-1.5 hover:bg-accent rounded"
                        title="Assign owner"
                      >
                        <UserPlus className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openModal(blocker.id, 'escalate')}
                        className="p-1.5 hover:bg-accent rounded"
                        title="Escalate"
                      >
                        <TrendingUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openModal(blocker.id, 'update')}
                        className="p-1.5 hover:bg-accent rounded"
                        title="Request update"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openModal(blocker.id, 'resolve')}
                        className="p-1.5 hover:bg-accent rounded"
                        title="Mark resolved"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="sr-only">Blocker list with owners and due dates</div>
      </div>

      {/* Modal */}
      {modalType && selectedBlocker && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <div className="bg-card border border-border rounded-lg max-w-md w-full p-6">
            <h2 className="mb-4">
              {modalType === 'assign' && 'Assign Owner'}
              {modalType === 'escalate' && 'Escalate Blocker'}
              {modalType === 'update' && 'Request Update'}
              {modalType === 'resolve' && 'Mark as Resolved'}
            </h2>

            {modalType === 'assign' && (
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm mb-2">Select Owner</label>
                  <select className="w-full px-3 py-2 bg-input-background border border-border rounded-lg">
                    <option>John Smith</option>
                    <option>Maria Garcia</option>
                    <option>Robert Chen</option>
                    <option>Sarah Johnson</option>
                  </select>
                </div>
              </div>
            )}

            {modalType === 'escalate' && (
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm mb-2">Escalation Level</label>
                  <select className="w-full px-3 py-2 bg-input-background border border-border rounded-lg">
                    <option>Senior Management</option>
                    <option>Director Level</option>
                    <option>Executive Level</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-2">Reason for Escalation</label>
                  <textarea
                    className="w-full px-3 py-2 bg-input-background border border-border rounded-lg h-24 resize-none"
                    placeholder="Describe why this blocker needs escalation..."
                  />
                </div>
              </div>
            )}

            {modalType === 'update' && (
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm mb-2">Message</label>
                  <textarea
                    className="w-full px-3 py-2 bg-input-background border border-border rounded-lg h-24 resize-none"
                    placeholder="Request an update on this blocker..."
                  />
                </div>
              </div>
            )}

            {modalType === 'resolve' && (
              <div className="space-y-4 mb-6">
                <p className="text-sm text-muted-foreground">
                  Are you sure you want to mark this blocker as resolved?
                </p>
                <div>
                  <label className="block text-sm mb-2">Resolution Notes</label>
                  <textarea
                    className="w-full px-3 py-2 bg-input-background border border-border rounded-lg h-24 resize-none"
                    placeholder="Describe how the blocker was resolved..."
                  />
                </div>
              </div>
            )}

            <div className="flex gap-3 justify-end">
              <button
                onClick={closeModal}
                className="px-4 py-2 border border-border rounded-lg hover:bg-accent"
              >
                Cancel
              </button>
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
              >
                {modalType === 'resolve' ? 'Mark Resolved' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
