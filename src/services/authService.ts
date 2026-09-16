import { request } from './apiClient';
import { LoginResponse, MeResponse, User } from '../types/auth';

export async function login(email: string, password: string): Promise<{ token: string; user: User }> {
  const response = await request<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  if (!response.data) {
    throw new Error('Invalid login response from server');
  }

  return response.data;
}

export async function fetchCurrentUser(): Promise<User> {
  const response = await request<MeResponse>('/auth/me', {
    method: 'GET',
  });

  if (!response.data || !response.data.user) {
    throw new Error('Invalid user profile response from server');
  }

  return response.data.user;
}
