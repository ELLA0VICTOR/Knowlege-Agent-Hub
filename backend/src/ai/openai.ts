import { CONFIG } from '../config.js';
import type { OpenAIChatCompletionRequest } from '@shared/types';

export async function openAIStream(req: OpenAIChatCompletionRequest): Promise<Response> {
  const url = `${CONFIG.OPENAI_BASE_URL.replace(/\/+$/, '')}/v1/chat/completions`;
  const r = await fetch(url, {
    method: 'POST',
    headers: {
      'authorization': `Bearer ${CONFIG.OPENAI_API_KEY}`,
      'content-type': 'application/json'
    },
    body: JSON.stringify(req)
  });
  if (!r.ok) {
    const body = await r.text();
    throw new Error(`OpenAI-compatible API error ${r.status}: ${body}`);
  }
  return r;
}
