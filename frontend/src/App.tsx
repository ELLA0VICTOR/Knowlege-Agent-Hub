import React, { useState } from 'react';
import Chat from './pages/Chat';
import Sources from './pages/Sources';
import Header from './components/Header';

export default function App() {
  const [tab, setTab] = useState<'chat'|'sources'>('chat');

  return (
    <div className="min-h-screen">
      <Header tab={tab} onTab={setTab} />
      <main className="max-w-5xl mx-auto px-4 py-6">
        {tab === 'chat' ? <Chat/> : <Sources/>}
      </main>
      <footer className="text-center text-slate-400 py-4 text-sm">
        Knowledge Agent Hub • Demo
      </footer>
    </div>
  );
}
