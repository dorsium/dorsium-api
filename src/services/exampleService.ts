import { ExampleResponse } from '../types/example.js';
import { callInternal } from '../utils/callInternal.js';

export async function getExample(name?: string): Promise<ExampleResponse> {
  try {
    return await callInternal<ExampleResponse>({
      method: 'GET',
      path: '/example',
      query: { name }
    });
  } catch (err) {
    throw new Error('Example fetch failed', { cause: err as Error });
  }
}
