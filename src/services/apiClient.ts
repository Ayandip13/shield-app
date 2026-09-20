import Constants from 'expo-constants';
import { getAccessToken, getRefreshToken, saveTokens, removeTokens } from '../utils/storage';
import { ApiAuthResponse, RefreshResponse } from '../types/auth';

let onUnauthorizedHandler: (() => void) | null = null;
let refreshPromise: Promise<RefreshResponse> | null = null;

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

  return 'https://shield-api-pkfz.onrender.com/api/v1';
};

const BASE_URL = getBaseUrl();

export interface CustomRequestOptions extends RequestInit {
  _isRetry?: boolean;
}

export async function request<T>(
  endpoint: string,
  options: CustomRequestOptions = {}
): Promise<ApiAuthResponse<T>> {
  const token = await getAccessToken();

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
    throw new Error(
      'Unable to connect to the server. Please check your internet connection and try again.'
    );
  }

  let data: ApiAuthResponse<T>;
  try {
    data = await response.json();
  } catch (parseError) {
    throw new Error('Invalid response format received from server.');
  }

  // Handle HTTP 401 Unauthorized (Expired / Invalid Access Token)
  if (
    response.status === 401 &&
    endpoint !== '/auth/login' &&
    endpoint !== '/auth/refresh'
  ) {
    // Prevent infinite retry loops if request has already been retried once
    if (!options._isRetry) {
      try {
        // SINGLE-FLIGHT REFRESH: If multiple 401s occur simultaneously, share the single refresh promise
        if (!refreshPromise) {
          refreshPromise = (async () => {
            const refreshToken = await getRefreshToken();
            if (!refreshToken) {
              throw new Error('No refresh token available');
            }

            const refreshRes = await fetch(`${BASE_URL}/auth/refresh`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ refreshToken }),
            });

            const refreshData = await refreshRes.json();
            if (
              !refreshRes.ok ||
              !refreshData.success ||
              !refreshData.data?.accessToken
            ) {
              throw new Error(refreshData.message || 'Session refresh failed');
            }

            const newTokens: RefreshResponse = refreshData.data;
            await saveTokens(newTokens.accessToken, newTokens.refreshToken);
            return newTokens;
          })().finally(() => {
            refreshPromise = null;
          });
        }

        // Wait for the single-flight refresh operation
        await refreshPromise;

        // Retry the original request ONCE with the new access token
        return request<T>(endpoint, {
          ...options,
          _isRetry: true,
        });
      } catch (refreshErr) {
        // Refresh failed: clear auth state & trigger unauthorized handler
        await removeTokens();
        if (onUnauthorizedHandler) {
          onUnauthorizedHandler();
        }
        throw new Error('Your session has expired. Please sign in again.');
      }
    } else {
      // Retried request failed again with 401: clear tokens & trigger handler
      await removeTokens();
      if (onUnauthorizedHandler) {
        onUnauthorizedHandler();
      }
      throw new Error('Your session has expired. Please sign in again.');
    }
  }

  if (!response.ok || !data.success) {
    let userMessage = data.message;

    if (
      !userMessage ||
      userMessage.includes('CastError') ||
      userMessage.includes('ValidationError')
    ) {
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

    throw new Error(userMessage);
  }

  return data;
}
