import { FastifyInstance } from 'fastify';

const sources = [
  { key: 'coingecko', title: 'CoinGecko', description: 'Crypto prices (no API key).' },
  { key: 'arxiv', title: 'arXiv', description: 'Research paper search (no API key).' },
  { key: 'openmeteo', title: 'Open-Meteo', description: 'Weather forecast (no API key).' }
];

export default async function sourcesRoute(fastify: FastifyInstance) {
  fastify.get('/api/sources', async () => {
    return { sources };
  });
}
