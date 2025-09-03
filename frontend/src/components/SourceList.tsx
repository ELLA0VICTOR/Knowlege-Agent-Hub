import React from 'react';

interface Source {
  key: string;
  title: string;
  description?: string;
}

interface SourceListProps {
  items: Source[];
  used?: string[];
}

const sourceIcons: Record<string, string> = {
  coingecko: '₿',
  arxiv: '📚',
  openmeteo: '🌤'
};

const sourceColors: Record<string, string> = {
  coingecko: 'from-orange-500 to-yellow-500',
  arxiv: 'from-green-500 to-emerald-500',
  openmeteo: 'from-blue-500 to-cyan-500'
};

export default function SourceList({ items, used = [] }: SourceListProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        <div className="text-4xl mb-2">🔗</div>
        <div className="text-sm">Loading sources...</div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((source, index) => {
        const isUsed = used.includes(source.key);
        const icon = sourceIcons[source.key] || '🔗';
        const colorClass = sourceColors[source.key] || 'from-slate-500 to-slate-600';
        
        return (
          <div
            key={source.key}
            className={`relative group transition-all duration-300 animate-in slide-in-from-left ${
              isUsed 
                ? 'scale-105' 
                : 'hover:scale-102'
            }`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className={`relative overflow-hidden rounded-xl border transition-all duration-300 ${
              isUsed 
                ? 'border-green-400/50 bg-green-500/10 shadow-lg shadow-green-500/10' 
                : 'border-slate-700/50 bg-slate-800/30 hover:border-slate-600/50 hover:bg-slate-800/50'
            }`}>
              {/* Background gradient for active sources */}
              {isUsed && (
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-transparent" />
              )}
              
              <div className="relative p-4">
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg shadow-md bg-gradient-to-br ${colorClass} ${
                    isUsed ? 'animate-pulse' : ''
                  }`}>
                    {icon}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-white truncate">
                        {source.title}
                      </h4>
                      {isUsed && (
                        <div className="flex items-center gap-1 text-green-400">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                          <span className="text-xs font-medium">Active</span>
                        </div>
                      )}
                    </div>
                    
                    <p className="text-sm text-slate-400 leading-relaxed">
                      {source.description}
                    </p>
                    
                    {/* Status indicators */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                        No API key required
                      </div>
                      <div className="text-slate-600">•</div>
                      <div className="text-xs text-slate-500">
                        Free tier
                      </div>
                    </div>
                  </div>
                </div>

                {/* Success animation for active sources */}
                {isUsed && (
                  <div className="absolute top-2 right-2">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
      
      {/* Summary footer */}
      <div className="pt-3 border-t border-slate-800/50 text-center">
        <div className="text-xs text-slate-500 mb-2">
          {used.length > 0 ? (
            <span className="text-green-400">
              {used.length} source{used.length !== 1 ? 's' : ''} active
            </span>
          ) : (
            'Sources auto-selected based on your query'
          )}
        </div>
        
        {items.length > 0 && (
          <div className="flex justify-center gap-1">
            {items.map((source, i) => (
              <div
                key={source.key}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  used.includes(source.key) 
                    ? 'bg-green-400 animate-pulse' 
                    : 'bg-slate-600'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}