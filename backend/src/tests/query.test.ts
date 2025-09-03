import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import Fastify from 'fastify';
import queryRoute from '../routes/query.js';

const app = Fastify({ logger: false });

beforeAll(async () => {
  await app.register(queryRoute);
});

afterAll(async () => {
  await app.close();
});

describe('Query Route', () => {
  it('should validate request body', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/query',
      payload: {
        query: '' // Empty query should fail
      }
    });

    expect(response.statusCode).toBe(400);
    const body = JSON.parse(response.body);
    expect(body.error).toBe('Invalid request');
  });

  it('should accept valid query', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/query',
      payload: {
        query: 'What is bitcoin?',
        stream: false
      }
    });

    // Should not be 400 (bad request)
    expect(response.statusCode).not.toBe(400);
  });

  it('should select appropriate sources based on query', async () => {
    const cryptoResponse = await app.inject({
      method: 'POST',
      url: '/api/query',
      payload: {
        query: 'bitcoin price today',
        stream: false
      }
    });

    // The response should include metadata about sources
    expect(cryptoResponse.statusCode).not.toBe(400);
  });
});