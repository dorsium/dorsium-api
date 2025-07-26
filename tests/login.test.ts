import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../src/services/userService.js', () => ({
  verifyCredentials: vi.fn()
}));

import { buildServer } from '../src/server.js';
import { verifyCredentials } from '../src/services/userService.js';

const mockedVerifyCredentials = verifyCredentials as unknown as ReturnType<typeof vi.fn>;

const payload = { username: 'jane', password: 'secret' };

describe('POST /login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns a token with valid credentials', async () => {
    mockedVerifyCredentials.mockResolvedValueOnce({ id: 1 });
    const app = buildServer();
    await app.ready();
    const expectedToken = await app.jwt.sign({ id: 1 });
    const res = await app.inject({ method: 'POST', url: '/login', payload });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ ok: true, data: { token: expectedToken } });
    expect(mockedVerifyCredentials).toHaveBeenCalledWith(payload);
  });

  it('handles invalid credentials', async () => {
    mockedVerifyCredentials.mockRejectedValueOnce(new Error('fail'));
    const app = buildServer();
    await app.ready();
    const res = await app.inject({ method: 'POST', url: '/login', payload });
    expect(res.statusCode).toBe(401);
    expect(res.json()).toEqual({ ok: false, error: 'Invalid credentials', status: 401 });
  });
});
