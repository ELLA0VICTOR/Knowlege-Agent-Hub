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
  query: z.string().min(1).max(2000), // Add max length
  sources: z.array(z.enum(['coingecko', 'arxiv', 'openmeteo'] as const)).optional(),
  stream: z.boolean().optional().default(true)
});

const ALL_SOURCES: Record<SourceKey, (q: string) => Promise<any>> = {
  coingecko: fetchCoinGecko,
  arxiv: fetchArxiv,
  openmeteo: fetchOpenMeteo
};

// Enhanced source selection with better heuristics
function selectSources(query: string): SourceKey[] {
  const q = query.toLowerCase();
  const sources: SourceKey[] = [];
  
  // Crypto patterns
  if (/(btc|bitcoin|eth|ethereum|sol|solana|ada|cardano|dot|polkadot|price|crypto|coin|market|trading)/i.test(q)) {
    sources.push('coingecko');
  }
  
  // Academic/research patterns
  if (/(paper|research|study|arxiv|academic|journal|publication|machine learning|ai|neural|deep learning)/i.test(q)) {
    sources.push('arxiv');
  }
  
  // Weather patterns - more comprehensive
  if (/(weather|temperature|forecast|climate|rain|snow|sunny|cloudy)\s+(in|at|for)|weather\s+in/i.test(q)) {
    sources.push('openmeteo');
  }
  
  // If no specific patterns found, use arxiv as default (knowledge-focused)
  return sources.length ? sources : ['arxiv'];
}

export default async function queryRoute(fastify: FastifyInstance) {
  fastify.post('/api/query', async (request, reply) => {
    try {
      const parsed = BodySchema.safeParse(request.body);
      if (!parsed.success) {
        reply.code(400);
        return { 
          error: 'Invalid request', 
          details: parsed.error.flatten().fieldErrors 
        };
      }

      const { query, sources, stream } = parsed.data as AgentQueryBody;

      // Enhanced source selection
      const chosen: SourceKey[] = sources ?? selectSources(query);

      // Fetch external data with better error handling
      const fetchPromises = chosen.map(async (key) => {
        try {
          const result = await Promise.race([
            ALL_SOURCES[key](query),
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Timeout')), 10000)
            )
          ]);
          return result;
        } catch (error) {
          fastify.log.warn(`Source ${key} failed: ${error}`);
          return { 
            key, 
            title: key, 
            used: false, 
            items: [], 
            error: error instanceof Error ? error.message : 'Unknown error' 
          };
        }
      });

      const results = await Promise.allSettled(fetchPromises);
      const used = results.map((r, i) => 
        r.status === 'fulfilled' ? r.value : {
          key: chosen[i], 
          title: chosen[i], 
          used: false, 
          items: [], 
          error: String((r as PromiseRejectedResult).reason)
        }
      );

      // Build context more intelligently
      const contextSnippet = used
        .filter(u => u.used && u.items?.length > 0)
        .flatMap(u => u.items.slice(0, 3).map((item: any) => {
          const sourceTag = `[${u.title}]`;
          const title = item.title || 'Untitled';
          const snippet = item.snippet ? ` — ${item.snippet}` : '';
          const url = item.url ? ` (${item.url})` : '';
          return `- ${sourceTag} ${title}${snippet}${url}`;
        }))
        .join('\n');

      // Enhanced system prompt
      const sysPrompt = `You are Knowledge Agent Hub, an intelligent AI assistant that provides accurate, well-sourced answers.

Instructions:
- Use the PROVIDED DATA below to answer the user's question
- If data contains numbers/prices, provide clear summaries with key metrics
- Always cite sources inline using [Source Name] format
- Be concise but comprehensive
- If the provided data is insufficient, supplement with your general knowledge but clearly distinguish between sourced and general information
- Format your response in a structured way with clear sections if appropriate

Remember: Accuracy and proper attribution are essential.`.trim();

      const userPrompt = `USER QUESTION: ${query}

PROVIDED DATA:
${contextSnippet || '(No external data successfully retrieved)'}

Please provide a helpful, well-structured answer.`.trim();

      const aiReq = {
        model: CONFIG.MODEL,
        stream: true,
        messages: [
          { role: 'system' as const, content: sysPrompt },
          { role: 'user' as const, content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 1000
      };

      if (stream !== false) {
        sseHeaders(reply);
        
        try {
          const r = await openAIStream(aiReq);
          if (!r.body) {
            throw new Error('No response body from AI service');
          }

          const reader = r.body.getReader();
          const decoder = new TextDecoder();

          // Send metadata about sources used
          sseSend(reply, { 
            type: 'meta', 
            model: CONFIG.MODEL, 
            usedSources: chosen, 
            sourcesDetail: used 
          });

          let buffer = '';
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || ''; // Keep incomplete line in buffer
            
            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed) continue;
              
              if (trimmed.startsWith('data:')) {
                const payload = trimmed.slice(5).trim();
                if (payload === '[DONE]') {
                  sseDone(reply);
                  return reply;
                }
                
                try {
                  const parsed = JSON.parse(payload);
                  sseSend(reply, parsed);
                } catch {
                  // Forward raw payload if not valid JSON
                  sseSend(reply, payload);
                }
              }
            }
          }
          
          sseDone(reply);
        } catch (error: any) {
          fastify.log.error('Streaming error:', error);
          sseSend(reply, { 
            type: 'error', 
            message: error.message || 'Unknown streaming error' 
          });
          sseDone(reply);
        }
        
        return reply;
      } else {
        // Non-streaming response
        const r = await openAIStream({ ...aiReq, stream: false });
        const json = await r.json();
        
        return { 
          meta: { 
            model: CONFIG.MODEL, 
            usedSources: chosen, 
            sourcesDetail: used 
          }, 
          result: json 
        };
      }
    } catch (error: any) {
      fastify.log.error('Query route error:', error);
      reply.code(500);
      return { 
        error: 'Internal server error', 
        message: error.message 
      };
    }
  });
}