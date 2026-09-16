import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { ProviderHomeScreen } from '../screens/provider/ProviderHomeScreen';
import { CommitteeHomeScreen } from '../screens/committee/CommitteeHomeScreen';
import { GuardHomeScreen } from '../screens/guard/GuardHomeScreen';
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
          component={ProviderHomeScreen}
          options={{ title: 'SecuShield - Provider Control' }}
        />
      ) : user.role === 'committee' ? (
        // Authenticated Committee Stack
        <Stack.Screen
          name="Committee"
          component={CommitteeHomeScreen}
          options={{ title: 'SecuShield - Committee Portal' }}
        />
      ) : (
        // Authenticated Guard Stack
        <Stack.Screen
          name="Guard"
          component={GuardHomeScreen}
          options={{ title: 'SecuShield - Guard Terminal' }}
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
