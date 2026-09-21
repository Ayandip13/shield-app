import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { ProviderDashboardScreen } from '../screens/provider/ProviderDashboardScreen';
import { BuildingsListScreen } from '../screens/provider/BuildingsListScreen';
import { ProviderSecurityActivityScreen } from '../screens/provider/ProviderSecurityActivityScreen';
import { ProfileScreen } from '../screens/common/ProfileScreen';
import { theme } from '../theme';

const Tab = createBottomTabNavigator();

export const ProviderAdminTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      initialRouteName="DashboardTab"
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerTintColor: theme.colors.primary,
        headerTitleStyle: {
          fontWeight: '600',
          color: theme.colors.textPrimary,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: '#64748B',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E2E8F0',
          borderTopWidth: 1,
          elevation: 8,
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 4,
          paddingTop: 4,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '500',
        },
      }}
    >
      <Tab.Screen
        name="DashboardTab"
        component={ProviderDashboardScreen}
        options={{
          title: 'Control Center',
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ color }) => (
            <Ionicons name="grid-outline" size={20} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="BuildingsTab"
        component={BuildingsListScreen}
        options={{
          title: 'Buildings',
          tabBarLabel: 'Buildings',
          tabBarIcon: ({ color }) => (
            <Ionicons name="business-outline" size={20} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ActivityTab"
        component={ProviderSecurityActivityScreen}
        options={{
          title: 'Security Activity',
          tabBarLabel: 'Activity',
          tabBarIcon: ({ color }) => (
            <Ionicons name="shield-checkmark-outline" size={20} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          title: 'My Profile',
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-outline" size={20} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
