import { callInternal } from './callInternal.js';
import type { RegisterInput, DisUser } from '../types/register.js';

export async function disCreateUser(data: RegisterInput): Promise<DisUser> {
  try {
    return await callInternal<DisUser>({
      method: 'POST',
      path: '/user/',
      body: data
    });
  } catch (err) {
    throw new Error('Failed to create user', { cause: err as Error });
  }
}

export type Role = 'miner' | 'validator' | 'node';

export async function disAssignRole(userId: number, role: Role): Promise<void> {
  try {
    await callInternal({
      method: 'POST',
      path: `/user/${userId}/roles`,
      body: { role }
    });
  } catch (err) {
    throw new Error('Failed to assign role', { cause: err as Error });
  }
}

export interface PreferencePayload {
  receiveUpdates: boolean;
  acceptTerms: boolean;
  acceptGdpr: boolean;
  darkModeEnabled: boolean;
  language: string;
  betaFeaturesEnabled: boolean;
  timezone: string;
}

export async function disSetPreference(
  userId: number,
  prefs: PreferencePayload
): Promise<void> {
  try {
    await callInternal({
      method: 'POST',
      path: `/user/${userId}/preference`,
      body: prefs
    });
  } catch (err) {
    throw new Error('Failed to set preferences', { cause: err as Error });
  }
}

export interface SocialPayload {
  platform: string;
  handle: string;
  verified: boolean;
  url: string;
}

export async function disSetSocials(
  userId: number,
  socials: SocialPayload
): Promise<void> {
  try {
    await callInternal({
      method: 'POST',
      path: `/user/${userId}/socials`,
      body: socials
    });
  } catch (err) {
    throw new Error('Failed to set socials', { cause: err as Error });
  }
}
