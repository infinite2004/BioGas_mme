import { useState } from 'react';
import { AlertTriangle, ExternalLink, Send } from 'lucide-react';

const mismatches = [
  { id: 1, item: 'Item 3: Pressure Test Report', details: 'Evidence missing' },
  { id: 2, item: 'Item 7: Environmental Impact Assessment', details: 'Version mismatch' },
  { id: 3, item: 'Item 12: Safety Certification', details: 'Pending ANP approval' },
];

export function CrossChecklistStatus() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="mb-6">
          <h2>Cross-checklist Status</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Alignment between ANP and Utility checklists
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* ANP Checklist */}
          <div className="p-4 bg-accent/50 rounded-lg">
            <h3 className="mb-3">ANP Checklist</h3>
            <div className="mb-2">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-muted-foreground">Completion</span>
                <span className="font-semibold">78%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 transition-all" style={{ width: '78%' }} />
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              <div className="flex justify-between mt-2">
                <span>Completed</span>
                <span className="font-medium text-foreground">47/60</span>
              </div>
              <div className="flex justify-between mt-1">
                <span>Pending</span>
                <span className="font-medium text-foreground">13</span>
              </div>
            </div>
          </div>

          {/* Mismatch Alerts */}
          <div className="p-4 bg-amber-500/10 rounded-lg border border-amber-500/30">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <h3>Mismatch Alerts</h3>
            </div>
            <div className="text-3xl font-semibold mb-2">{mismatches.length}</div>
            <div className="space-y-2 text-sm">
              {mismatches.map((mismatch) => (
                <div key={mismatch.id} className="pb-2 border-b border-amber-500/20 last:border-0">
                  <div className="font-medium text-foreground">{mismatch.item}</div>
                  <div className="text-muted-foreground text-xs mt-0.5">{mismatch.details}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Utility Checklist */}
          <div className="p-4 bg-accent/50 rounded-lg">
            <h3 className="mb-3">Utility Checklist</h3>
            <div className="mb-2">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-muted-foreground">Completion</span>
                <span className="font-semibold">65%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 transition-all" style={{ width: '65%' }} />
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              <div className="flex justify-between mt-2">
                <span>Completed</span>
                <span className="font-medium text-foreground">39/60</span>
              </div>
              <div className="flex justify-between mt-1">
                <span>Pending</span>
                <span className="font-medium text-foreground">21</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            Request alignment review
          </button>
          <button className="px-4 py-2 border border-border rounded-lg hover:bg-accent flex items-center gap-2">
            <ExternalLink className="w-4 h-4" />
            Open Shared Checklist
          </button>
        </div>

        <div className="sr-only">Cross-checklist alignment between ANP and utilities</div>
      </div>

      {/* Request Alignment Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <div className="bg-card border border-border rounded-lg max-w-lg w-full p-6">
            <h2 className="mb-4">Request Alignment Review</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Send a message to ANP and utilities to request alignment review with evidence links.
            </p>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm mb-2">Recipients</label>
                <select className="w-full px-3 py-2 bg-input-background border border-border rounded-lg">
                  <option>ANP + All Utilities</option>
                  <option>ANP Only</option>
                  <option>Utilities Only</option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-2">Message</label>
                <textarea
                  className="w-full px-3 py-2 bg-input-background border border-border rounded-lg h-32 resize-none"
                  placeholder="Describe the alignment issues and request for review..."
                />
              </div>

              <div>
                <label className="block text-sm mb-2">Attach Evidence Links</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-input-background border border-border rounded-lg"
                  placeholder="Paste evidence document URLs..."
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-border rounded-lg hover:bg-accent"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
