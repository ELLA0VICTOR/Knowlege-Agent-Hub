import { FastifyInstance } from 'fastify';
import { openAIStream } from '../ai/openai.js';
import { CONFIG } from '../config.js';

// Minimal OpenAI-compatible pass-through so Sentient can call this backend directly.
export default async function openaiProxyRoute(fastify: FastifyInstance) {
  fastify.post('/v1/chat/completions', async (request, reply) => {
    try {
      // If the client requests streaming, we pipe SSE back directly.
      const body = request.body as any;
      const wantsStream = !!body?.stream;

      if (wantsStream) {
        reply.raw.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
        reply.raw.setHeader('Cache-Control', 'no-cache, no-transform');
        reply.raw.setHeader('Connection', 'keep-alive');

        try {
          const r = await openAIStream(body);
          if (!r.body) throw new Error('No body from upstream');
          reply.raw.write(`: model ${CONFIG.MODEL}\n\n`);
          const reader = r.body.getReader();
          const dec = new TextDecoder();
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            reply.raw.write(dec.decode(value));
          }
          reply.raw.end();
          return reply;
        } catch (e: any) {
          reply.raw.write(`data: ${JSON.stringify({ error: e.message || String(e) })}\n\n`);
          reply.raw.write('data: [DONE]\n\n');
          reply.raw.end();
          return reply;
        }
      } else {
        const r = await openAIStream(body);
        const json = await r.json();
        reply.header('content-type', 'application/json');
        return json; // Return the JSON object directly
      }
    } catch (e: any) {
      fastify.log.error('OpenAI proxy error:', e);
      reply.code(500);
      return { error: e.message || String(e) };
    }
  });
}