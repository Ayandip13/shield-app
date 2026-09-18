import { request } from './apiClient';
import {
  UserProfile,
  UpdateProfilePayload,
  ChangePasswordPayload,
} from '../types/profile';

/**
 * Fetch authenticated user profile
 */
export async function getProfile(): Promise<UserProfile> {
  const response = await request<UserProfile>('/profile');
  return response.data!;
}

/**
 * Update personal profile information (name, phone)
 */
export async function updateProfile(payload: UpdateProfilePayload): Promise<UserProfile> {
  const response = await request<UserProfile>('/profile', {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
  return response.data!;
}

/**
 * Change account password
 */
export async function changePassword(payload: ChangePasswordPayload): Promise<{ message: string }> {
  const response = await request<{ message: string }>('/profile/password', {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
  return { message: response.message || 'Password changed successfully.' };
}
