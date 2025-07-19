import { ExampleResponse } from '../types/example.js';
import { callInternal } from '../utils/callInternal.js';

export async function getExample(name?: string): Promise<ExampleResponse> {
  return callInternal<ExampleResponse>({
    method: 'GET',
    path: '/example',
    query: { name }
  });
}
