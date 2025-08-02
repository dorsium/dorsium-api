import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  disCreateUser,
  disAssignRole,
  disSetPreference,
  disSetSocials
} from '../src/utils/disClient.js';
import { registerUser } from '../src/services/registerService.js';

vi.mock('../src/utils/disClient.js', () => ({
  disCreateUser: vi.fn(),
  disAssignRole: vi.fn(),
  disSetPreference: vi.fn(),
  disSetSocials: vi.fn()
}));

const mockedDisCreateUser = disCreateUser as unknown as ReturnType<
  typeof vi.fn
>;
const mockedDisAssignRole = disAssignRole as unknown as ReturnType<
  typeof vi.fn
>;
const mockedDisSetPreference = disSetPreference as unknown as ReturnType<
  typeof vi.fn
>;
const mockedDisSetSocials = disSetSocials as unknown as ReturnType<
  typeof vi.fn
>;

describe('registerUser', () => {
  const input = {
    name: 'John Doe',
    username: 'johndoe',
    authUserId: '11111111-1111-1111-8111-111111111111',
    country: 'US'
  };

  const user = { userId: '1', ...input };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('registers a user and assigns role, preferences, and socials', async () => {
    mockedDisCreateUser.mockResolvedValueOnce(user);
    mockedDisAssignRole.mockResolvedValueOnce(undefined);
    mockedDisSetPreference.mockResolvedValueOnce(undefined);
    mockedDisSetSocials.mockResolvedValueOnce(undefined);

    const result = await registerUser(input);

    expect(mockedDisCreateUser).toHaveBeenCalledWith(input);
    expect(mockedDisAssignRole).toHaveBeenCalledWith(1, 'node');
    expect(mockedDisSetPreference).toHaveBeenCalledWith(
      1,
      expect.objectContaining({
        receiveUpdates: true,
        acceptTerms: true,
        acceptGdpr: true,
        darkModeEnabled: true,
        language: 'en',
        betaFeaturesEnabled: false,
        timezone: 'Europe/Bucharest'
      })
    );
    expect(mockedDisSetSocials).toHaveBeenCalledWith(
      1,
      expect.objectContaining({
        platform: 'x',
        handle: '@example',
        verified: false,
        url: ''
      })
    );
    expect(result).toEqual(user);
  });

  it('throws an error if registration fails', async () => {
    mockedDisCreateUser.mockRejectedValueOnce(new Error('Oops'));

    await expect(registerUser(input)).rejects.toThrow(
      'User registration failed'
    );
  });
});
