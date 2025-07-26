import { callInternal } from '../utils/callInternal.js';
import type {
  UserInput,
  UserResponse,
  LoginInput,
  LoginResponse
} from '../types/user.js';

export async function registerUser(input: UserInput): Promise<UserResponse> {
  try {
    return await callInternal<UserResponse>({
      method: 'POST',
      path: '/users',
      body: input
    });
  } catch (err) {
    throw new Error('User creation failed', { cause: err as Error });
  }
}

export async function getUser(id: number): Promise<UserResponse> {
  try {
    return await callInternal<UserResponse>({
      method: 'GET',
      path: `/users/${id}`
    });
  } catch (err) {
    throw new Error('User fetch failed', { cause: err as Error });
  }
}

export async function verifyCredentials(
  input: LoginInput
): Promise<LoginResponse> {
  try {
    return await callInternal<LoginResponse>({
      method: 'POST',
      path: '/login',
      body: input
    });
  } catch (err) {
    throw new Error('Credential verification failed', { cause: err as Error });
  }
}
