import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { sseHeaders, sseSend, sseDone } from '../utils/stream.js';
import { fetchCoinGecko } from '../services/coingecko.js';
import { fetchArxiv } from '../services/arxiv.js';
import { fetchOpenMeteo } from '../services/openmeteo.js';
import { openAIStream } from '../ai/openai.js';
import { CONFIG } from '../config.js';
import type { SourceKey, AgentQueryBody, OpenAIStreamDelta } from '@shared/types';

const BodySchema = z.object({
  query: z.string().min(1),
  sources: z.array(z.enum(['coingecko', 'arxiv', 'openmeteo'] as const)).optional(),
  stream: z.boolean().optional()
});

const ALL_SOURCES: Record<SourceKey, (q: string) => Promise<any>> = {
  coingecko: fetchCoinGecko,
  arxiv: fetchArxiv,
  openmeteo: fetchOpenMeteo
};

export default async function queryRoute(fastify: FastifyInstance) {
  fastify.post('/api/query', async (request, reply) => {
    const parsed = BodySchema.safeParse(request.body);
    if (!parsed.success) {
      reply.code(400);
      return { error: parsed.error.flatten() };
    }
    const { query, sources, stream } = parsed.data as AgentQueryBody;

    // Decide sources: provided or heuristic (coingecko if crypto-ish; arxiv for "paper", openmeteo if "weather in").
    const chosen: SourceKey[] = sources ?? ((): SourceKey[] => {
      const list: SourceKey[] = [];
      if (/(btc|bitcoin|eth|ethereum|sol|solana|price|crypto)/i.test(query)) list.push('coingecko');
      if (/paper|arxiv|research|study/i.test(query)) list.push('arxiv');
      if (/weather\s+in/i.test(query)) list.push('openmeteo');
      return list.length ? list : ['arxiv']; // safe default
    })();

    // Fetch in parallel
    const results = await Promise.allSettled(chosen.map(k => ALL_SOURCES[k](query)));
    const used = results
      .map((r, i) => (r.status === 'fulfilled' ? r.value : { key: chosen[i], title: chosen[i], used: false, items: [], error: String((r as any).reason) }));

    const contextSnippet = used.flatMap(u => u.items?.slice(0, 3).map((it: any) => {
      const line = `- [${u.title}] ${it.title}${it.snippet ? ` — ${it.snippet}` : ''}${it.url ? ` (${it.url})` : ''}`;
      return line;
    }) ?? []).join('\n');

    const sysPrompt =
`You are Knowledge Agent Hub. You must read the PROVIDED DATA and answer the user clearly and concisely.
If numbers are present, provide a short summary with bullet points and a one-paragraph conclusion.
Cite sources inline in plain text like [CoinGecko], [arXiv], [Open-Meteo]; do not print raw JSON.
If the user asks outside the provided data, answer briefly using general knowledge.`.trim();

    const userPrompt =
`USER QUESTION:
${query}

PROVIDED DATA:
${contextSnippet || '(no external items successfully fetched)'}

Return a structured, helpful answer.`.trim();

    const aiReq = {
      model: CONFIG.MODEL,
      stream: true,
      messages: [
        { role: 'system' as const, content: sysPrompt },
        { role: 'user' as const, content: userPrompt }
      ]
    };

    if (stream !== false) {
      sseHeaders(reply);
      // Initiate OpenAI-compatible streaming and forward SSE chunks
      try {
        const r = await openAIStream(aiReq);
        const reader = r.body!.getReader();
        const decoder = new TextDecoder();

        // Send a metadata prelude so clients know what sources were used.
        sseSend(reply, { type: 'meta', model: CONFIG.MODEL, usedSources: chosen, sourcesDetail: used });

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          // Forward each line as-is so the frontend can parse OpenAI-style SSE.
          for (const line of chunk.split('\n')) {
            const trimmed = line.trim();
            if (!trimmed) continue;
            if (trimmed.startsWith('data:')) {
              const payload = trimmed.slice(5).trim();
              if (payload === '[DONE]') {
                sseDone(reply);
                return;
              }
              // Optionally, validate it's a delta and forward
              let parsed: OpenAIStreamDelta | null = null;
              try { parsed = JSON.parse(payload); } catch { /* passthrough */ }
              sseSend(reply, parsed || payload);
            }
          }
        }
      } catch (e: any) {
        sseSend(reply, { type: 'error', message: e.message || String(e) });
        sseDone(reply);
      }
      return reply; // stream already sent
    } else {
      // Non-streaming (debug)
      const r = await openAIStream({ ...aiReq, stream: false });
      const json = await r.json();
      return { meta: { model: CONFIG.MODEL, usedSources: chosen, sourcesDetail: used }, result: json };
    }
  });
}
