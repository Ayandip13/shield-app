import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const ACCESS_TOKEN_KEY = 'secushield_access_token';
const REFRESH_TOKEN_KEY = 'secushield_refresh_token';

// In-memory fallbacks for web or unsupported platforms
let memoryAccessToken: string | null = null;
let memoryRefreshToken: string | null = null;

export async function saveTokens(accessToken: string, refreshToken: string): Promise<void> {
  try {
    memoryAccessToken = accessToken;
    memoryRefreshToken = refreshToken;
    if (Platform.OS !== 'web') {
      await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
    }
  } catch (error) {
    console.warn('SecureStore saveTokens failed, falling back to memory store:', error);
  }
}

export async function getAccessToken(): Promise<string | null> {
  try {
    if (Platform.OS !== 'web') {
      const token = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
      if (token) return token;
    }
    return memoryAccessToken;
  } catch (error) {
    console.warn('SecureStore getAccessToken failed, returning memory store:', error);
    return memoryAccessToken;
  }
}

export async function getRefreshToken(): Promise<string | null> {
  try {
    if (Platform.OS !== 'web') {
      const token = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
      if (token) return token;
    }
    return memoryRefreshToken;
  } catch (error) {
    console.warn('SecureStore getRefreshToken failed, returning memory store:', error);
    return memoryRefreshToken;
  }
}

export async function removeTokens(): Promise<void> {
  try {
    memoryAccessToken = null;
    memoryRefreshToken = null;
    if (Platform.OS !== 'web') {
      await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
      await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
    }
  } catch (error) {
    console.warn('SecureStore removeTokens failed:', error);
  }
}

// Backward compatibility helpers
export async function saveToken(token: string): Promise<void> {
  memoryAccessToken = token;
  if (Platform.OS !== 'web') {
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token);
  }
}

export async function getToken(): Promise<string | null> {
  return getAccessToken();
}

export async function removeToken(): Promise<void> {
  return removeTokens();
}
