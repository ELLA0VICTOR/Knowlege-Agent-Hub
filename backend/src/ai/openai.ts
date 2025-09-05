import { CONFIG } from '../config.js';
import type { OpenAIChatCompletionRequest } from '../types.js';

export async function openAIStream(req: OpenAIChatCompletionRequest): Promise<Response> {
  const url = `${CONFIG.OPENAI_BASE_URL.replace(/\/+$/, '')}/v1/chat/completions`;
  
  console.log(`🤖 Making AI request to: ${url}`);
  console.log(`🔑 Using model: ${req.model}`);
  console.log(`📝 Request payload:`, {
    model: req.model,
    messages: req.messages,
    stream: req.stream,
    temperature: req.temperature
  });

  const r = await fetch(url, {
    method: 'POST',
    headers: {
      'authorization': `Bearer ${CONFIG.OPENAI_API_KEY}`,
      'content-type': 'application/json',
      'accept': 'application/json'
    },
    body: JSON.stringify(req)
  });

  console.log(`📊 Response status: ${r.status} ${r.statusText}`);
  
  // Convert headers to a simple object for logging (Node.js compatible)
  const headersObj: Record<string, string> = {};
  r.headers.forEach((value, key) => {
    headersObj[key] = value;
  });
  console.log(`📋 Response headers:`, headersObj);

  if (!r.ok) {
    const body = await r.text();
    console.error(`❌ AI API Error Response: ${body}`);
    throw new Error(`OpenAI-compatible API error ${r.status}: ${body}`);
  }
  
  return r;
}