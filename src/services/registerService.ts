import {
  disCreateUser,
  disAssignRole,
  disSetPreference,
  disSetSocials,
  Role,
  PreferencePayload,
  SocialPayload
} from '../utils/disClient.js';
import type { RegisterInput, RegisterResponse } from '../types/register.js';

const defaultRole: Role = 'node';

const defaultPreference: PreferencePayload = {
  receiveUpdates: true,
  acceptTerms: true,
  acceptGdpr: true,
  darkModeEnabled: true,
  language: 'en',
  betaFeaturesEnabled: false,
  timezone: 'Europe/Bucharest'
};

const defaultSocials: SocialPayload = {
  platform: 'x',
  handle: '@example',
  verified: false,
  url: ''
};

export async function registerUser(
  input: RegisterInput
): Promise<RegisterResponse> {
  try {
    const user = await disCreateUser(input);
    const userId = Number(user.userId);
    await disAssignRole(userId, defaultRole);
    await disSetPreference(userId, defaultPreference);
    await disSetSocials(userId, defaultSocials);
    return user;
  } catch (err) {
    throw new Error('User registration failed', { cause: err as Error });
  }
}
