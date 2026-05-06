export interface User {
  id: string;
  username: string;
  email: string;
  role: 'ADMIN' | 'USER';
  createdAt: string;
}

export interface AuthTokenResponse {
  accessToken: string;
  expiresIn: number;
  user: User;
}