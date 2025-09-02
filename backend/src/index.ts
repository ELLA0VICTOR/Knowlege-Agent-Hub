import Fastify from 'fastify';
import cors from '@fastify/cors';
import { CONFIG } from './config.js';
import queryRoute from './routes/query.js';
import sourcesRoute from './routes/sources.js';
import openaiProxyRoute from './routes/openai-proxy.js';

const app = Fastify({ logger: true });

await app.register(cors, { origin: CONFIG.CORS_ORIGIN, credentials: true });

await app.register(queryRoute);
await app.register(sourcesRoute);
await app.register(openaiProxyRoute);

app.get('/health', async () => ({ ok: true }));

app.listen({ port: CONFIG.PORT, host: '0.0.0.0' })
  .then(addr => app.log.info(`Backend listening on ${addr}`))
  .catch(err => { app.log.error(err); process.exit(1); });
