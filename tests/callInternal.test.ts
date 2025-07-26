import { describe, it, expect, beforeEach, vi } from 'vitest';

import { callInternal } from '../src/utils/callInternal.js';
import {
  InternalNetworkError,
  InternalParseError,
  InternalResponseError
} from '../src/utils/errors.js';

const defaultOptions = { method: 'GET', path: '/test' } as const;

describe('callInternal', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('returns parsed JSON on success', async () => {
    const data = { ok: true };
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(data)
    }));
    const result = await callInternal<typeof data>(defaultOptions);
    expect(result).toEqual(data);
  });

  it('throws network error when fetch fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('fail')));
    await expect(callInternal(defaultOptions)).rejects.toBeInstanceOf(InternalNetworkError);
  });

  it('throws response error for non-ok status', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500, json: vi.fn() }));
    await expect(callInternal(defaultOptions)).rejects.toBeInstanceOf(InternalResponseError);
  });

  it('throws parse error for invalid JSON', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockRejectedValue(new Error('invalid'))
    }));
    await expect(callInternal(defaultOptions)).rejects.toBeInstanceOf(InternalParseError);
  });
});
