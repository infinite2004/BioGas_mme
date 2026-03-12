import { useState } from 'react';
import { Building2, Factory, FileText, ChevronRight, Shield, ArrowRight } from 'lucide-react';

interface OrganizationGateProps {
  onSelectRole: (role: 'MME' | 'Utilities' | 'ANP') => void;
}

export function OrganizationGate({ onSelectRole }: OrganizationGateProps) {
  const [selected, setSelected] = useState<'MME' | 'Utilities' | 'ANP' | null>(null);

  const handleContinue = () => {
    if (selected) {
      onSelectRole(selected);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs mb-4">
            <Shield className="w-3 h-3" />
            Role-based access
          </div>
          <h1 className="mb-3">Welcome to GateReady</h1>
          <p className="text-muted-foreground">
            What organization are you representing? Your role determines the home screen and tools you can access.
          </p>
        </div>

        {/* Primary role cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* MME card */}
          <button
            onClick={() => setSelected('MME')}
            className={`p-6 border-2 rounded-xl text-left transition-all hover:shadow-md ${
              selected === 'MME'
                ? 'border-primary bg-accent shadow-md'
                : 'border-border bg-card hover:border-primary/50'
            }`}
          >
            <div className={`inline-flex p-3 rounded-lg mb-4 ${selected === 'MME' ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'}`}>
              <Building2 className="w-6 h-6" />
            </div>
            <div className="mb-1 flex items-center gap-2">
              <h3>MME</h3>
              <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">Primary</span>
            </div>
            <p className="text-sm text-muted-foreground mb-3">Ministry of Mines and Energy</p>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li className="flex items-center gap-1.5"><ChevronRight className="w-3 h-3 text-primary" /> Full dashboard access</li>
              <li className="flex items-center gap-1.5"><ChevronRight className="w-3 h-3 text-primary" /> Escalation + approval tools</li>
              <li className="flex items-center gap-1.5"><ChevronRight className="w-3 h-3 text-primary" /> Cross-stakeholder oversight</li>
            </ul>
            {selected === 'MME' && (
              <div className="mt-4 text-xs text-primary font-medium flex items-center gap-1">
                <ChevronRight className="w-3 h-3" /> Selected
              </div>
            )}
          </button>

          {/* Utilities card */}
          <button
            onClick={() => setSelected('Utilities')}
            className={`p-6 border-2 rounded-xl text-left transition-all hover:shadow-md ${
              selected === 'Utilities'
                ? 'border-primary bg-accent shadow-md'
                : 'border-border bg-card hover:border-primary/50'
            }`}
          >
            <div className={`inline-flex p-3 rounded-lg mb-4 ${selected === 'Utilities' ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'}`}>
              <Factory className="w-6 h-6" />
            </div>
            <div className="mb-1 flex items-center gap-2">
              <h3>Utilities</h3>
              <span className="text-xs px-2 py-0.5 bg-muted text-muted-foreground rounded-full">Secondary</span>
            </div>
            <p className="text-sm text-muted-foreground mb-3">Utility Companies</p>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li className="flex items-center gap-1.5"><ChevronRight className="w-3 h-3 text-primary" /> Task-focused worklist</li>
              <li className="flex items-center gap-1.5"><ChevronRight className="w-3 h-3 text-primary" /> Evidence submission</li>
              <li className="flex items-center gap-1.5"><ChevronRight className="w-3 h-3 text-primary" /> Flag for MME attention</li>
            </ul>
            {selected === 'Utilities' && (
              <div className="mt-4 text-xs text-primary font-medium flex items-center gap-1">
                <ChevronRight className="w-3 h-3" /> Selected
              </div>
            )}
          </button>
        </div>

        {/* ANP link */}
        <button
          onClick={() => setSelected('ANP')}
          className={`w-full p-4 border rounded-xl transition-all hover:bg-accent mb-6 flex items-center justify-between ${
            selected === 'ANP' ? 'border-primary bg-accent' : 'border-border'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-muted rounded-lg">
              <FileText className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">ANP / Regulator</span>
                <span className="text-xs px-2 py-0.5 bg-muted text-muted-foreground rounded-full">View-only</span>
              </div>
              <p className="text-xs text-muted-foreground">National Petroleum Agency — read-only dashboard access</p>
            </div>
          </div>
          {selected === 'ANP' ? (
            <span className="text-xs text-primary font-medium">Selected</span>
          ) : (
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          )}
        </button>

        {/* Continue button */}
        <button
          onClick={handleContinue}
          disabled={!selected}
          className="w-full py-3 px-6 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          Continue
          <ArrowRight className="w-4 h-4" />
        </button>

        {!selected && (
          <p className="text-center text-xs text-muted-foreground mt-3">Select an organization above to continue</p>
        )}
      </div>
    </div>
  );
}
