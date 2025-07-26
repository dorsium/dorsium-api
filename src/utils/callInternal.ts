import { env } from '../config/env.js';

export interface InternalRequestOptions {
  method: string;
  path: string;
  query?: Record<string, string | undefined>;
  body?: unknown;
}

export async function callInternal<T>(options: InternalRequestOptions): Promise<T> {
  const url = new URL(options.path, env.INTERNAL_SERVICE_URL);
  if (options.query) {
    for (const [key, value] of Object.entries(options.query)) {
      if (value !== undefined) url.searchParams.set(key, value);
    }
  }
  const res = await fetch(url.toString(), {
    method: options.method,
    headers: { 'Content-Type': 'application/json' },
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  if (!res.ok) {
    throw new Error(`Internal service error: ${res.status}`);
  }

  return (await res.json()) as T;
}
