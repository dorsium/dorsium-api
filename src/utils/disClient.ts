import { callInternal } from './callInternal.js';
import type { RegisterInput, DisUser } from '../types/register.js';

export async function disCreateUser(data: RegisterInput): Promise<DisUser> {
  return callInternal<DisUser>({
    method: 'POST',
    path: '/user/',
    body: data
  });
}

export type Role = 'miner' | 'validator' | 'node';

export async function disAssignRole(userId: number, role: Role): Promise<void> {
  await callInternal({
    method: 'POST',
    path: `/user/${userId}/roles`,
    body: { role }
  });
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
  await callInternal({
    method: 'POST',
    path: `/user/${userId}/preference`,
    body: prefs
  });
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
  await callInternal({
    method: 'POST',
    path: `/user/${userId}/socials`,
    body: socials
  });
}
