export interface RegisterInput {
  name: string;
  username: string;
  authUserId: string;
  country: string;
}

export interface DisUser {
  userId: number;
  name: string;
  username: string;
  authUserId: string;
  country: string;
  [key: string]: unknown;
}

export type RegisterResponse = DisUser;
