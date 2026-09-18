# SecuShield Mobile Application

React Native + Expo mobile client for building security management, personnel coordination, and duty terminal operations.

## Architecture

- **Framework**: React Native + Expo (SDK 57) + TypeScript
- **Navigation**: React Navigation (Native Stack & Bottom Tabs)
- **State & Auth**: React Context (`AuthContext`, `ToastContext`) + `expo-secure-store`
- **UI System**: Custom bluish-white theme design tokens (`src/theme/`)

## Environment Setup

Configure backend endpoint in `.env`:

```env
# For local physical device development (use machine IP):
EXPO_PUBLIC_API_URL=http://192.168.1.50:5000/api/v1

# For production builds:
EXPO_PUBLIC_API_URL=https://api.secushield.com/api/v1
```

> **Security Note**: Never include database credentials, JWT secrets, or backend private keys in the mobile application project.

## Scripts

```bash
# Start Expo development server
npm run start

# Run TypeScript type check
npm run typecheck
```
