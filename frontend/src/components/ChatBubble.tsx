import React from 'react';

export default function ChatBubble({ role, children }: { role: 'user'|'assistant', children: React.ReactNode }) {
  const isUser = role === 'user';
  return (
    <div className={`w-full flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[80%] my-2 p-3 rounded-2xl shadow
        ${isUser ? 'bg-blue-600 text-white rounded-br-sm' : 'bg-slate-800 text-slate-100 rounded-bl-sm'}`}>
        {children}
      </div>
    </div>
  );
}
