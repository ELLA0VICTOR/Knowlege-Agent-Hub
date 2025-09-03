import React, { useState, useEffect } from 'react';
import SourceList from '../components/SourceList';
import { getSources } from '../api/client';

export default function Sources() {
  const [available, setAvailable] = useState<{ key: string; title: string; description: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getSources()
      .then(r => {
        setAvailable(r.sources);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load sources');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center animate-pulse">
          <span className="text-2xl">🔗</span>
        </div>
        <div className="text-slate-400">Loading data sources...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-6 bg-red-500/20 border border-red-500/30 rounded-2xl flex items-center justify-center">
          <span className="text-2xl">⚠️</span>
        </div>
        <div className="text-red-400 mb-4">{error}</div>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
          <span className="text-3xl">🔗</span>
        </div>
        <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          External Data Sources
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Knowledge Agent Hub automatically selects the most relevant data sources based on your query. 
          All sources are free and require no API keys, ensuring reliable access to real-time information.
        </p>
      </div>

      {/* Source Selection Info */}
      <div className="mb-8 p-6 bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <span>🎯</span>
          How Source Selection Works
        </h2>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl">
            <div className="font-medium text-orange-400 mb-2">Crypto Queries</div>
            <div className="text-slate-300">
              Keywords like "bitcoin", "ethereum", "price", "crypto" automatically trigger CoinGecko integration
            </div>
          </div>
          <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
            <div className="font-medium text-green-400 mb-2">Research Queries</div>
            <div className="text-slate-300">
              Terms like "paper", "research", "study", "AI", "neural" activate arXiv search
            </div>
          </div>
          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
            <div className="font-medium text-blue-400 mb-2">Weather Queries</div>
            <div className="text-slate-300">
              Patterns like "weather in [city]" connect to Open-Meteo forecasting
            </div>
          </div>
        </div>
      </div>

      {/* Available Sources */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <span>📋</span>
          Available Sources ({available.length})
        </h2>
        <SourceList items={available} />
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="p-6 bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <span>⚡</span>
            Real-Time Data
          </h3>
          <ul className="text-sm text-slate-400 space-y-2">
            <li>• Live cryptocurrency prices and market data</li>
            <li>• Latest research papers from arXiv</li>
            <li>• Current weather forecasts and conditions</li>
            <li>• Automatic data validation and processing</li>
          </ul>
        </div>
        
        <div className="p-6 bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <span>🔒</span>
            Secure & Reliable
          </h3>
          <ul className="text-sm text-slate-400 space-y-2">
            <li>• No API keys required for any source</li>
            <li>• Built-in rate limiting and error handling</li>
            <li>• Fallback to general knowledge when needed</li>
            <li>• Data source attribution in all responses</li>
          </ul>
        </div>
      </div>

      {/* API Integration Status */}
      <div className="p-6 bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <span>🔧</span>
          Integration Status
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {available.map(source => (
            <div key={source.key} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
              <span className="text-sm">{source.title}</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-400">Online</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}