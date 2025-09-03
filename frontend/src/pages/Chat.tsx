import React, { useState, useRef, useEffect } from 'react';
import ChatBubble from '../components/ChatBubble';
import Loader from '../components/Loader';
import SourceList from '../components/SourceList';
import { streamQuery, getSources } from '../api/client';

type Msg = { role: 'user'|'assistant', content: string, timestamp?: number, sources?: string[] };

export default function Chat() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [available, setAvailable] = useState<{ key: string; title: string; description: string }[]>([]);
  const [used, setUsed] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => { 
    getSources()
      .then(r => setAvailable(r.sources))
      .catch(err => setError('Failed to load sources'));
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  async function onSend(e?: React.FormEvent) {
    e?.preventDefault();
    const q = input.trim();
    if (!q || streaming) return;

    setError(null);
    const timestamp = Date.now();
    setMessages(m => [...m, 
      { role: 'user', content: q, timestamp }, 
      { role: 'assistant', content: '', timestamp: timestamp + 1 }
    ]);
    setInput('');
    setStreaming(true);
    let acc = '';

    try {
      for await (const ev of streamQuery({ query: q })) {
        if (ev.type === 'meta') {
          setUsed(ev.data.usedSources || []);
        } else if (ev.type === 'token') {
          acc += ev.data;
          setMessages(m => {
            const copy = [...m];
            if (copy[copy.length - 1].role === 'assistant') {
              copy[copy.length - 1] = { 
                ...copy[copy.length - 1], 
                content: acc,
                sources: used 
              };
            }
            return copy;
          });
        }
      }
    } catch (e: any) {
      const errorMsg = `Error: ${e.message || String(e)}`;
      setError(errorMsg);
      acc = acc || errorMsg;
      setMessages(m => {
        const copy = [...m];
        if (copy[copy.length - 1].role === 'assistant') {
          copy[copy.length - 1] = { 
            ...copy[copy.length - 1], 
            content: acc 
          };
        }
        return copy;
      });
    } finally {
      setStreaming(false);
    }
  }

  const clearChat = () => {
    setMessages([]);
    setUsed([]);
    setError(null);
  };

  const examples = [
    "What's the current Bitcoin price?",
    "Latest AI research on neural networks",
    "Weather in New York today"
  ];

  return (
    <div className="grid lg:grid-cols-[1fr_400px] gap-8">
      {/* Main Chat Area */}
      <div className="space-y-6">
        {/* Welcome Message */}
        {messages.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <span className="text-2xl">🧠</span>
            </div>
            <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Welcome to Knowledge Agent Hub
            </h1>
            <p className="text-slate-400 mb-8 max-w-md mx-auto">
              Ask me anything about crypto prices, research papers, or weather. I'll fetch real-time data and provide intelligent analysis.
            </p>
            
            <div className="flex flex-wrap gap-3 justify-center mb-8">
              {examples.map((example, i) => (
                <button
                  key={i}
                  onClick={() => setInput(example)}
                  className="px-4 py-2 bg-slate-800/50 hover:bg-slate-700 border border-slate-700 rounded-xl text-sm transition-all duration-200 hover:scale-105"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Error Banner */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-2 text-red-400">
              <span>⚠</span>
              <span className="text-sm">{error}</span>
            </div>
          </div>
        )}

        {/* Messages Container */}
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl shadow-2xl overflow-hidden">
          <div className="h-[65vh] overflow-y-auto p-6 space-y-4" style={{ scrollBehavior: 'smooth' }}>
            {messages.map((m, i) => (
              <ChatBubble key={i} role={m.role} timestamp={m.timestamp} sources={m.sources}>
                {m.content}
              </ChatBubble>
            ))}
            {streaming && <Loader />}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <div className="border-t border-slate-800/50 p-6 bg-slate-900/30">
            <form onSubmit={onSend} className="space-y-3">
              <div className="relative">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Ask about crypto, research, weather, or anything else..."
                  disabled={streaming}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/25 transition-all duration-200 pr-24 disabled:opacity-50"
                />
                <div className="absolute right-2 top-2 flex gap-1">
                  {messages.length > 0 && (
                    <button
                      type="button"
                      onClick={clearChat}
                      className="px-3 py-1 text-xs text-slate-400 hover:text-white bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                    >
                      Clear
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={!input.trim() || streaming}
                    className="px-4 py-1 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-600 disabled:opacity-50 rounded-lg text-sm font-medium transition-all duration-200 disabled:cursor-not-allowed"
                  >
                    {streaming ? '⏸' : '➤'}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Press Enter to send • Shift+Enter for new line</span>
                <span>{input.length}/2000</span>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Sources Sidebar */}
      <div className="space-y-6">
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">🔗</span>
            <h3 className="font-semibold text-lg">Data Sources</h3>
          </div>
          <SourceList items={available} used={used} />
          
          {used.length > 0 && (
            <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-xl">
              <div className="text-green-400 text-sm font-medium mb-1">Active Sources</div>
              <div className="text-xs text-green-300">
                {used.join(', ')} used in last response
              </div>
            </div>
          )}
        </div>

        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6 shadow-xl">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <span>📊</span>
            Stats
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Messages:</span>
              <span>{messages.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Sources Used:</span>
              <span>{used.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Status:</span>
              <span className={streaming ? 'text-yellow-400' : 'text-green-400'}>
                {streaming ? 'Streaming...' : 'Ready'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}