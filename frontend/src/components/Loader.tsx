import React from 'react';

export default function Loader() {
  return (
    <div className="flex items-center justify-start animate-in slide-in-from-bottom duration-300">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-sm shadow-lg">
          🧠
        </div>
        <div className="text-xs text-slate-400">Knowledge Agent</div>
      </div>
      
      <div className="max-w-[85%]">
        <div className="bg-slate-800/70 backdrop-blur-sm border border-slate-700/50 rounded-2xl rounded-tl-md shadow-lg p-4">
          <div className="flex items-center gap-3">
            {/* Animated dots */}
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
            </div>
            
            {/* Status text with typewriter effect */}
            <div className="text-sm text-slate-400 animate-pulse">
              Analyzing and generating response...
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="mt-3 w-full bg-slate-700/50 rounded-full h-1 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}