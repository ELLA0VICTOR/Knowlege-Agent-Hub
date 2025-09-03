import React, { useState } from 'react';
import Chat from './pages/Chat';
import Sources from './pages/Sources';
import Header from './components/Header';

export default function App() {
  const [tab, setTab] = useState<'chat'|'sources'>('chat');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Animated background pattern */}
      <div className="fixed inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25px 25px, rgba(255,255,255,0.2) 2px, transparent 0)`,
          backgroundSize: '50px 50px'
        }}/>
      </div>
      
      {/* Gradient orbs for visual interest */}
      <div className="fixed top-0 left-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse"/>
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 animate-pulse"/>
      
      <div className="relative z-10">
        <Header tab={tab} onTab={setTab} />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-in fade-in duration-500">
            {tab === 'chat' ? <Chat/> : <Sources/>}
          </div>
        </main>
        
        <footer className="relative z-10 border-t border-slate-800/50 bg-slate-950/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 py-6 text-center">
            <div className="text-slate-400 text-sm mb-2">
              Powered by <span className="text-blue-400 font-medium">Dobby-70B</span> via Fireworks AI
            </div>
            <div className="text-slate-500 text-xs">
              Knowledge Agent Hub • Built for Sentient AGI
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}