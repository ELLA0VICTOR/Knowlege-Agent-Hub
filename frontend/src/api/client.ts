export async function* streamQuery(body: { query: string; sources?: string[] }) {
    const res = await fetch('/api/query', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ...body, stream: true })
    });
    if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
  
    let meta: any = null;
  
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value);
      for (const raw of chunk.split('\n')) {
        const line = raw.trim();
        if (!line.startsWith('data:')) continue;
        const payload = line.slice(5).trim();
        if (!payload || payload === '[DONE]') { return; }
        try {
          const obj = JSON.parse(payload);
          // First object we send is meta
          if (obj?.type === 'meta') {
            meta = obj;
            yield { type: 'meta', data: meta };
          } else if (obj?.choices?.[0]?.delta?.content) {
            yield { type: 'token', data: obj.choices[0].delta.content as string };
          }
        } catch {
          // ignore invalid JSON lines
        }
      }
    }
  }
  
  export async function getSources() {
    const res = await fetch('/api/sources');
    if (!res.ok) throw new Error('Failed to fetch sources');
    return res.json() as Promise<{ sources: Array<{ key: string; title: string; description: string }> }>;
  }
  