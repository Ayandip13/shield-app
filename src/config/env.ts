import Constants from 'expo-constants';

export const envConfig = {
  apiBaseUrl:
    process.env.EXPO_PUBLIC_API_URL ||
    process.env.EXPO_PUBLIC_API_BASE_URL ||
    Constants.expoConfig?.extra?.apiBaseUrl ||
    'https://shield-api-10yp.onrender.com/api/v1',
};

