import { callInternal } from '../utils/callInternal.js';
import type { UserInput, UserResponse } from '../types/user.js';

export async function registerUser(input: UserInput): Promise<UserResponse> {
  return callInternal<UserResponse>({
    method: 'POST',
    path: '/users',
    body: input
  });
}

export async function getUser(id: number): Promise<UserResponse> {
  return callInternal<UserResponse>({
    method: 'GET',
    path: `/users/${id}`
  });
}
