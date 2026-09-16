import { getToken } from '../utils/storage';
import { ApiAuthResponse } from '../types/auth';

const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:5000/api/v1';

export async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiAuthResponse<T>> {
  const token = await getToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data: ApiAuthResponse<T> = await response.json();

  if (!response.ok || !data.success) {
    const errorMessage = data.message || data.error?.code || 'An error occurred during request execution';
    throw new Error(errorMessage);
  }

  return data;
}
