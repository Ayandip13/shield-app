import Constants from 'expo-constants';

const LIVE_PRODUCTION_API_URL = 'https://shield-api-pkfz.onrender.com/api/v1';

function sanitizeApiUrl(rawUrl?: string): string {
  if (!rawUrl || typeof rawUrl !== 'string') return LIVE_PRODUCTION_API_URL;
  let clean = rawUrl.trim().replace(/\/+$/, '');
  if (clean.includes('shield-api-10yp') || clean.includes('localhost') || clean.includes('127.0.0.1')) {
    return LIVE_PRODUCTION_API_URL;
  }
  if (!clean.endsWith('/api/v1')) {
    if (clean.endsWith('/api')) {
      clean += '/v1';
    } else {
      clean += '/api/v1';
    }
  }
  return clean;
}

export const envConfig = {
  apiBaseUrl: sanitizeApiUrl(
    process.env.EXPO_PUBLIC_API_URL ||
    process.env.EXPO_PUBLIC_API_BASE_URL ||
    Constants.expoConfig?.extra?.apiBaseUrl ||
    LIVE_PRODUCTION_API_URL
  ),
};

