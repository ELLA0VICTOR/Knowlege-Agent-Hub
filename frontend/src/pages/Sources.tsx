import React from 'react';
import SourceList from '../components/SourceList';
import { getSources } from '../api/client';

export default function Sources() {
  const [available, setAvailable] = React.useState<{ key: string; title: string; description: string }[]>([]);
  React.useEffect(()=>{ getSources().then(r=>setAvailable(r.sources)); },[]);
  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">Available External Sources</h2>
      <p className="text-slate-400 mb-4 text-sm">Toggle is not persisted in this demo; the agent auto-selects based on your query.</p>
      <SourceList items={available}/>
    </div>
  );
}
