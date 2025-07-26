import { describe, it, expect } from 'vitest';
import { buildServer } from '../src/server.js';

function setupApp() {
  const app = buildServer();
  app.after(() => {
    app.get('/protected', { preHandler: app.authenticate }, async () => ({ ok: true }));
  });
  return app;
}

describe('authenticate', () => {
  it('rejects invalid tokens', async () => {
    const app = setupApp();
    await app.ready();
    const res = await app.inject({ method: 'GET', url: '/protected', headers: { authorization: 'Bearer invalid' } });
    expect(res.statusCode).toBe(401);
    expect(res.json()).toEqual({ ok: false, error: 'Unauthorized', status: 401 });
  });

  it('allows valid tokens', async () => {
    const app = setupApp();
    await app.ready();
    const token = await app.jwt.sign({ id: 1 });
    const res = await app.inject({ method: 'GET', url: '/protected', headers: { authorization: `Bearer ${token}` } });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ ok: true });
  });
});
