import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../src/services/userService.js', () => ({
  registerUser: vi.fn(),
  getUser: vi.fn()
}));

import { buildServer } from '../src/server.js';
import { registerUser, getUser } from '../src/services/userService.js';

const mockedRegisterUser = registerUser as unknown as ReturnType<typeof vi.fn>;
const mockedGetUser = getUser as unknown as ReturnType<typeof vi.fn>;

const payload = { name: 'Jane', username: 'jane' };

describe('POST /users', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates a user', async () => {
    mockedRegisterUser.mockResolvedValueOnce({ id: 1, ...payload });
    const app = buildServer();
    const res = await app.inject({ method: 'POST', url: '/users', payload });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ ok: true, data: { id: 1, ...payload } });
    expect(mockedRegisterUser).toHaveBeenCalledWith(payload);
  });

  it('handles errors', async () => {
    mockedRegisterUser.mockRejectedValueOnce(new Error('fail'));
    const app = buildServer();
    const res = await app.inject({ method: 'POST', url: '/users', payload });
    expect(res.statusCode).toBe(500);
    expect(res.json()).toEqual({ ok: false, error: 'User creation failed', status: 500 });
  });
});

describe('GET /users/:id', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns user data', async () => {
    mockedGetUser.mockResolvedValueOnce({ id: 2, ...payload });
    const app = buildServer();
    const res = await app.inject({ method: 'GET', url: '/users/2' });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ ok: true, data: { id: 2, ...payload } });
    expect(mockedGetUser).toHaveBeenCalledWith(2);
  });

  it('handles errors', async () => {
    mockedGetUser.mockRejectedValueOnce(new Error('fail'));
    const app = buildServer();
    const res = await app.inject({ method: 'GET', url: '/users/2' });
    expect(res.statusCode).toBe(500);
    expect(res.json()).toEqual({ ok: false, error: 'User fetch failed', status: 500 });
  });
});
