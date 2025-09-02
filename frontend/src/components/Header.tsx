import React from 'react';

export default function Header({ tab, onTab }: { tab: 'chat'|'sources'; onTab: (t:'chat'|'sources') => void }) {
  return (
    <header className="border-b border-slate-800">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="text-xl font-semibold">🤖 Knowledge Agent Hub</div>
        <nav className="flex gap-2">
          <button onClick={() => onTab('chat')}
            className={`px-3 py-1 rounded-lg ${tab==='chat'?'bg-slate-800':'bg-slate-900 hover:bg-slate-800'}`}>Chat</button>
          <button onClick={() => onTab('sources')}
            className={`px-3 py-1 rounded-lg ${tab==='sources'?'bg-slate-800':'bg-slate-900 hover:bg-slate-800'}`}>Sources</button>
        </nav>
      </div>
    </header>
  );
}
