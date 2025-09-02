import React, { useState } from 'react';
import ChatBubble from '../components/ChatBubble';
import Loader from '../components/Loader';
import SourceList from '../components/SourceList';
import { streamQuery, getSources } from '../api/client';

type Msg = { role: 'user'|'assistant', content: string };

export default function Chat() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [available, setAvailable] = React.useState<{ key: string; title: string; description: string }[]>([]);
  const [used, setUsed] = React.useState<string[]>([]);

  React.useEffect(() => { getSources().then(r => setAvailable(r.sources)); }, []);

  async function onSend(e?: React.FormEvent) {
    e?.preventDefault();
    const q = input.trim();
    if (!q) return;
    setMessages(m => [...m, { role: 'user', content: q }, { role: 'assistant', content: '' }]);
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
            copy[copy.length - 1] = { role: 'assistant', content: acc };
            return copy;
          });
        }
      }
    } catch (e: any) {
      acc += `\n\n[Error] ${e.message || String(e)}`;
      setMessages(m => {
        const copy = [...m];
        copy[copy.length - 1] = { role: 'assistant', content: acc };
        return copy;
      });
    } finally {
      setStreaming(false);
    }
  }

  return (
    <div className="grid md:grid-cols-[2fr_1fr] gap-6">
      <div>
        <div className="h-[60vh] overflow-y-auto border border-slate-800 rounded-xl p-4 bg-slate-950">
          {messages.map((m, i) => <ChatBubble key={i} role={m.role}>{m.content}</ChatBubble>)}
          {streaming && <Loader/>}
        </div>
        <form onSubmit={onSend} className="mt-4 flex gap-2">
          <input value={input} onChange={e=>setInput(e.target.value)} placeholder="Ask about crypto, papers, or weather in <city>..."
            className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 outline-none focus:border-blue-500"/>
          <button className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500">Send</button>
        </form>
      </div>
      <div>
        <div className="mb-2 text-sm text-slate-400">Sources</div>
        <SourceList items={available} used={used}/>
      </div>
    </div>
  );
}
