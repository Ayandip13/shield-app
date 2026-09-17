import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { getToken } from '../utils/storage';
import { ApiAuthResponse } from '../types/auth';

const getBaseUrl = (): string => {
  if (process.env.EXPO_PUBLIC_API_BASE_URL) {
    return process.env.EXPO_PUBLIC_API_BASE_URL;
  }

  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    const hostIp = hostUri.split(':')[0];
    if (hostIp && hostIp !== 'localhost' && hostIp !== '127.0.0.1') {
      return `http://${hostIp}:5000/api/v1`;
    }
  }

  return 'http://192.168.0.101:5000/api/v1';
};

const BASE_URL = getBaseUrl();

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

  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });
  } catch (error: any) {
    throw new Error('Unable to connect to backend server. Please check your connection.');
  }

  let data: ApiAuthResponse<T>;
  try {
    data = await response.json();
  } catch (parseError) {
    throw new Error('Invalid response format received from server.');
  }

  if (!response.ok || !data.success) {
    const errorMessage = data.message || data.error?.code || 'An error occurred during request execution';
    throw new Error(errorMessage);
  }

  return data;
}

