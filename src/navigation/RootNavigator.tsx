import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { ProviderAdminNavigator } from './ProviderAdminNavigator';
import { CommitteeNavigator } from './CommitteeNavigator';
import { GuardNavigator } from './GuardNavigator';
import { useAuth } from '../context/AuthContext';
import { theme } from '../theme';
import { Text } from '../components/common/Text';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Initializing SecuShield Session...</Text>
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerTintColor: theme.colors.primary,
        headerTitleStyle: {
          fontWeight: '600',
          color: theme.colors.textPrimary,
        },
        contentStyle: {
          backgroundColor: theme.colors.background,
        },
      }}
    >
      {!user ? (
        // Unauthenticated Stack
        <Stack.Screen
          name="Auth"
          component={LoginScreen}
          options={{ title: 'SecuShield Sign In', headerBackVisible: false }}
        />
      ) : user.role === 'provider_admin' ? (
        // Authenticated Provider Admin Stack
        <Stack.Screen
          name="ProviderAdmin"
          component={ProviderAdminNavigator}
          options={{ headerShown: false }}
        />
      ) : user.role === 'committee' ? (
        // Authenticated Committee Stack
        <Stack.Screen
          name="Committee"
          component={CommitteeNavigator}
          options={{ headerShown: false }}
        />
      ) : (
        // Authenticated Guard Stack
        <Stack.Screen
          name="Guard"
          component={GuardNavigator}
          options={{ headerShown: false }}
        />
      )}
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  loadingText: {
    marginTop: theme.spacing.md,
    color: theme.colors.textSecondary,
  },
});
