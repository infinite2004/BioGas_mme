import { useState } from 'react';
import { OrganizationGate } from './components/OrganizationGate';
import { MMEDashboard } from './components/MMEDashboard';
import { UtilityDashboard } from './components/UtilityDashboard';

export default function App() {
  const [role, setRole] = useState<'MME' | 'Utilities' | 'ANP' | null>(null);

  if (!role) {
    return <OrganizationGate onSelectRole={setRole} />;
  }

  if (role === 'Utilities') {
    return <UtilityDashboard onChangeRole={() => setRole(null)} />;
  }

  return <MMEDashboard role={role} onChangeRole={() => setRole(null)} />;
}
