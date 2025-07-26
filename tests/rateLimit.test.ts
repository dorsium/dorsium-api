import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('rate limit plugin', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('responds with 429 when requests exceed limit', async () => {
    process.env.RATE_LIMIT_MAX = '1';
    process.env.RATE_LIMIT_TIME_WINDOW = '1000';
    const { buildServer } = await import('../src/server.js');
    const app = buildServer();
    await app.ready();
    await app.inject({ method: 'GET', url: '/health' });
    const res = await app.inject({ method: 'GET', url: '/health' });
    expect(res.statusCode).toBe(429);
  });
});
