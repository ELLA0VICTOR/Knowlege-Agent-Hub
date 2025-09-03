import React from 'react';

interface ChatBubbleProps {
  role: 'user' | 'assistant';
  children: React.ReactNode;
  timestamp?: number;
  sources?: string[];
}

export default function ChatBubble({ role, children, timestamp, sources }: ChatBubbleProps) {
  const isUser = role === 'user';
  const timeStr = timestamp ? new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

  return (
    <div className={`w-full flex ${isUser ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom duration-300`}>
      <div className="max-w-[85%] group">
        {/* Avatar and Name */}
        <div className={`flex items-center gap-2 mb-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
          {!isUser && (
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-sm shadow-lg">
              🧠
            </div>
          )}
          <div className={`text-xs text-slate-400 ${isUser ? 'order-first' : ''}`}>
            {isUser ? 'You' : 'Knowledge Agent'}
            {timeStr && <span className="ml-2 opacity-60">{timeStr}</span>}
          </div>
          {isUser && (
            <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center text-sm">
              👤
            </div>
          )}
        </div>

        {/* Message Content */}
        <div className={`relative group-hover:shadow-lg transition-all duration-300 ${
          isUser 
            ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-2xl rounded-tr-md shadow-lg' 
            : 'bg-slate-800/70 backdrop-blur-sm border border-slate-700/50 text-slate-100 rounded-2xl rounded-tl-md shadow-lg hover:border-slate-600/50'
        }`}>
          <div className="p-4">
            <div className="prose prose-invert prose-sm max-w-none">
              {typeof children === 'string' ? (
                <div className="whitespace-pre-wrap break-words">{children}</div>
              ) : (
                children
              )}
            </div>
          </div>

          {/* Sources indicator */}
          {!isUser && sources && sources.length > 0 && (
            <div className="px-4 pb-3">
              <div className="flex flex-wrap gap-1 mt-2">
                {sources.map((source, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-slate-700/50 rounded-full text-xs text-slate-300 border border-slate-600/30"
                  >
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    {source}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Message actions */}
          {!isUser && (
            <div className={`opacity-0 group-hover:opacity-100 transition-opacity absolute -right-2 top-2 flex flex-col gap-1`}>
              <button
                onClick={() => navigator.clipboard.writeText(String(children))}
                className="w-8 h-8 bg-slate-700 hover:bg-slate-600 rounded-lg flex items-center justify-center text-xs transition-colors"
                title="Copy message"
              >
                📋
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}