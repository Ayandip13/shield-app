import { request } from './apiClient';
import { LoginResponse, RefreshResponse, MeResponse, User } from '../types/auth';

export async function login(
  email: string,
  password: string
): Promise<{ accessToken: string; refreshToken: string; user: User }> {
  const response = await request<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  if (!response.data || !response.data.accessToken || !response.data.refreshToken) {
    throw new Error('Invalid login response received from server.');
  }

  return {
    accessToken: response.data.accessToken,
    refreshToken: response.data.refreshToken,
    user: response.data.user,
  };
}

export async function refreshSession(
  refreshToken: string
): Promise<{ accessToken: string; refreshToken: string }> {
  const response = await request<RefreshResponse>('/auth/refresh', {
    method: 'POST',
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.data || !response.data.accessToken || !response.data.refreshToken) {
    throw new Error('Invalid refresh token response from server.');
  }

  return response.data;
}

export async function logoutSession(refreshToken?: string): Promise<void> {
  try {
    await request('/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  } catch {
    // Ignore logout network errors gracefully
  }
}

export async function logoutAllSessions(): Promise<void> {
  try {
    await request('/auth/logout-all', {
      method: 'POST',
    });
  } catch {
    // Ignore network errors gracefully
  }
}

export async function fetchCurrentUser(): Promise<User> {
  const response = await request<MeResponse>('/auth/me', {
    method: 'GET',
  });

  if (!response.data || !response.data.user) {
    throw new Error('Invalid user profile response from server.');
  }

  return response.data.user;
}
