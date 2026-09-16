import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const TOKEN_KEY = 'secushield_auth_token';

// In-memory fallback for web or un-supported platforms
let memoryToken: string | null = null;

export async function saveToken(token: string): Promise<void> {
  try {
    memoryToken = token;
    if (Platform.OS !== 'web') {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
    }
  } catch (error) {
    console.warn('SecureStore saveToken failed, falling back to memory store:', error);
  }
}

export async function getToken(): Promise<string | null> {
  try {
    if (Platform.OS !== 'web') {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      if (token) return token;
    }
    return memoryToken;
  } catch (error) {
    console.warn('SecureStore getToken failed, returning memory store:', error);
    return memoryToken;
  }
}

export async function removeToken(): Promise<void> {
  try {
    memoryToken = null;
    if (Platform.OS !== 'web') {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    }
  } catch (error) {
    console.warn('SecureStore removeToken failed:', error);
  }
}
