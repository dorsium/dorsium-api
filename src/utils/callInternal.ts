import { env } from '../config/env.js';
import {
  InternalNetworkError,
  InternalParseError,
  InternalResponseError
} from './errors.js';

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

  let res: Response;
  try {
    res = await fetch(url.toString(), {
      method: options.method,
      headers: { 'Content-Type': 'application/json' },
      body: options.body ? JSON.stringify(options.body) : undefined
    });
  } catch (err) {
    throw new InternalNetworkError((err as Error).message);
  }

  if (!res.ok) {
    throw new InternalResponseError(res.status);
  }

  try {
    return (await res.json()) as T;
  } catch {
    throw new InternalParseError();
  }
}
