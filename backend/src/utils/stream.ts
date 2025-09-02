import type { FastifyReply } from 'fastify';

export function sseHeaders(reply: FastifyReply) {
  reply.raw.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
  reply.raw.setHeader('Cache-Control', 'no-cache, no-transform');
  reply.raw.setHeader('Connection', 'keep-alive');
}

export function sseSend(reply: FastifyReply, data: unknown) {
  reply.raw.write(`data: ${typeof data === 'string' ? data : JSON.stringify(data)}\n\n`);
}

export function sseDone(reply: FastifyReply) {
  reply.raw.write('data: [DONE]\n\n');
  reply.raw.end();
}
