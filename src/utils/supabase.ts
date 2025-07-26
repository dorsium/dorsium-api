import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { env } from '../config/env.js';
import type { Database } from '../types/supabase.js';

let client: SupabaseClient<Database> | undefined;

export function getSupabaseClient(): SupabaseClient<Database> {
  if (!client) {
    client = createClient<Database>(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
  }
  return client;
}
