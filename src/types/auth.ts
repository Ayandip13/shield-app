export type UserRole = 'provider_admin' | 'committee' | 'guard';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  providerId: string;
  buildingId?: string | null;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface MeResponse {
  user: User;
}

export interface ApiAuthResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: {
    code: string;
    details?: unknown;
  };
  timestamp: string;
}
