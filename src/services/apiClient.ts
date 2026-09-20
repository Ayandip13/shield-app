import Constants from 'expo-constants';
import { getToken } from '../utils/storage';
import { ApiAuthResponse } from '../types/auth';

let onUnauthorizedHandler: (() => void) | null = null;

export function setUnauthorizedHandler(handler: () => void) {
  onUnauthorizedHandler = handler;
}

const getBaseUrl = (): string => {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
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

  return 'https://shield-api-10yp.onrender.com/api/v1';
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
    throw new Error('Unable to connect to the server. Please check your internet connection and try again.');
  }

  let data: ApiAuthResponse<T>;
  try {
    data = await response.json();
  } catch (parseError) {
    throw new Error('Invalid response format received from server.');
  }

  if (!response.ok || !data.success) {
    let userMessage = data.message;

    if (!userMessage || userMessage.includes('CastError') || userMessage.includes('ValidationError')) {
      switch (response.status) {
        case 401:
          userMessage = 'Your session has expired. Please sign in again.';
          break;
        case 403:
          userMessage = "You don't have permission to perform this action.";
          break;
        case 404:
          userMessage = 'The requested record could not be found.';
          break;
        case 409:
          userMessage = 'This record already exists or conflicts with existing data.';
          break;
        case 429:
          userMessage = 'Too many requests. Please wait a moment and try again.';
          break;
        case 500:
        default:
          userMessage = 'Something went wrong on the server. Please try again.';
          break;
      }
    }

    if (response.status === 401 && endpoint !== '/auth/login') {
      if (onUnauthorizedHandler) {
        onUnauthorizedHandler();
      }
    }

    throw new Error(userMessage);
  }

  return data;
}


