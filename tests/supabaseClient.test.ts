import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn()
}));

import { createClient } from '@supabase/supabase-js';
import { env } from '../src/config/env.js';

const mockedCreateClient = createClient as unknown as ReturnType<typeof vi.fn>;

describe('getSupabaseClient', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it('initializes only once with env vars', async () => {
    const fakeClient = { db: true } as unknown;
    mockedCreateClient.mockReturnValue(fakeClient);
    const { getSupabaseClient } = await import('../src/utils/supabase.js');
    const client1 = getSupabaseClient();
    const client2 = getSupabaseClient();
    expect(client1).toBe(fakeClient);
    expect(client2).toBe(fakeClient);
    expect(mockedCreateClient).toHaveBeenCalledTimes(1);
    expect(mockedCreateClient).toHaveBeenCalledWith(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
  });
});
