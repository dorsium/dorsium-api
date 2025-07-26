export interface UserInput {
  name: string;
  username: string;
}

export interface User {
  id: number;
  name: string;
  username: string;
  [key: string]: unknown;
}

export type UserResponse = User;

export interface LoginInput {
  username: string;
  password: string;
}

export interface LoginResponse {
  id: number;
  [key: string]: unknown;
}
