import React from 'react';

export default function SourceList({ items, used }: {
  items: Array<{ key: string; title: string; description?: string }>;
  used?: string[];
}) {
  return (
    <div className="grid md:grid-cols-3 gap-3">
      {items.map(s => (
        <div key={s.key} className={`p-3 rounded-xl border bg-slate-900/60 ${used?.includes(s.key) ? 'border-emerald-500' : 'border-slate-800'}`}>
          <div className="font-medium">{s.title}</div>
          <div className="text-sm text-slate-400">{s.description}</div>
          {used?.includes(s.key) && <div className="mt-2 text-emerald-400 text-xs">Used in last response</div>}
        </div>
      ))}
    </div>
  );
}
