import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../src/services/exampleService.js', () => ({
  getExample: vi.fn()
}));

import { buildServer } from '../src/server.js';
import { getExample } from '../src/services/exampleService.js';

const mockedGetExample = getExample as unknown as ReturnType<typeof vi.fn>;

describe('GET /example', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns data without query', async () => {
    mockedGetExample.mockResolvedValueOnce({ message: 'hello' });
    const app = buildServer();
    const res = await app.inject({ method: 'GET', url: '/example' });
    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toMatch(/application\/json/);
    expect(res.json()).toEqual({ ok: true, data: { message: 'hello' } });
    expect(mockedGetExample).toHaveBeenCalledWith(undefined);
  });

  it('returns data with query', async () => {
    mockedGetExample.mockResolvedValueOnce({ message: 'hi john' });
    const app = buildServer();
    const res = await app.inject({ method: 'GET', url: '/example?name=john' });
    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toMatch(/application\/json/);
    expect(res.json()).toEqual({ ok: true, data: { message: 'hi john' } });
    expect(mockedGetExample).toHaveBeenCalledWith('john');
  });
});
