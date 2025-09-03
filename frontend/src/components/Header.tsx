import React from 'react';

export default function Header({ tab, onTab }: { tab: 'chat'|'sources'; onTab: (t:'chat'|'sources') => void }) {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and title */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">🧠</span>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse"/>
            </div>
            <div>
              <div className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Knowledge Agent Hub
              </div>
              <div className="text-xs text-slate-500">
                AI-Powered Research Assistant
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-1 bg-slate-800/50 p-1 rounded-xl backdrop-blur-sm">
            <button 
              onClick={() => onTab('chat')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                tab === 'chat' 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              <span className="flex items-center gap-2">
                💬 Chat
              </span>
            </button>
            <button 
              onClick={() => onTab('sources')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                tab === 'sources' 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              <span className="flex items-center gap-2">
                🔗 Sources
              </span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}