import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../src/services/registerService.js', () => ({
  registerUser: vi.fn()
}));

import { buildServer } from '../src/server.js';
import { registerUser } from '../src/services/registerService.js';

const mockedRegisterUser = registerUser as unknown as ReturnType<typeof vi.fn>;

const payload = {
  name: 'John Doe',
  username: 'johndoe',
  authUserId: '11111111-1111-1111-8111-111111111111',
  country: 'US'
};

describe('POST /register', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates a user', async () => {
    mockedRegisterUser.mockResolvedValueOnce({ userId: 1, ...payload });
    const app = buildServer();
    const res = await app.inject({
      method: 'POST',
      url: '/register',
      payload
    });
    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toMatch(/application\/json/);
    expect(res.json()).toEqual({ ok: true, data: { userId: 1, ...payload } });
    expect(mockedRegisterUser).toHaveBeenCalledWith(payload);
  });

  it('handles errors', async () => {
    mockedRegisterUser.mockRejectedValueOnce(new Error('fail'));
    const app = buildServer();
    const res = await app.inject({ method: 'POST', url: '/register', payload });
    expect(res.statusCode).toBe(500);
    expect(res.json()).toEqual({ ok: false, error: 'Registration failed', status: 500 });
  });
});
