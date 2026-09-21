import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { GuardHomeScreen } from '../screens/guard/GuardHomeScreen';
import { GuardEntryExitScreen } from '../screens/guard/GuardEntryExitScreen';
import { GuardAttendanceScreen } from '../screens/guard/GuardAttendanceScreen';
import { ProfileScreen } from '../screens/common/ProfileScreen';
import { theme } from '../theme';

const Tab = createBottomTabNavigator();

export const GuardTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      initialRouteName="GuardHomeTab"
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
        name="GuardHomeTab"
        component={GuardHomeScreen}
        options={{
          title: 'Guard Terminal',
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => (
            <Ionicons name="shield-outline" size={20} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="GuardEntryExitTab"
        component={GuardEntryExitScreen}
        options={{
          title: 'Visitor Log',
          tabBarLabel: 'Entry/Exit',
          tabBarIcon: ({ color }) => (
            <Ionicons name="log-in-outline" size={20} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="GuardAttendanceTab"
        component={GuardAttendanceScreen}
        options={{
          title: 'Duty Check-In',
          tabBarLabel: 'Attendance',
          tabBarIcon: ({ color }) => (
            <Ionicons name="checkbox-outline" size={20} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="GuardProfileTab"
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
