import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { CommitteeHomeScreen } from '../screens/committee/CommitteeHomeScreen';
import { CommitteeEntryExitScreen } from '../screens/committee/CommitteeEntryExitScreen';
import { CommitteeAttendanceScreen } from '../screens/committee/CommitteeAttendanceScreen';
import { ProfileScreen } from '../screens/common/ProfileScreen';
import { theme } from '../theme';

const Tab = createBottomTabNavigator();

export const CommitteeTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      initialRouteName="CommitteeHomeTab"
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
        name="CommitteeHomeTab"
        component={CommitteeHomeScreen}
        options={{
          title: 'Committee Portal',
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => (
            <Ionicons name="home-outline" size={20} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="CommitteeSecurityTab"
        component={CommitteeEntryExitScreen}
        options={{
          title: 'Visitor Records',
          tabBarLabel: 'Security',
          tabBarIcon: ({ color }) => (
            <Ionicons name="list-outline" size={20} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="CommitteeAttendanceTab"
        component={CommitteeAttendanceScreen}
        options={{
          title: 'Guard Attendance',
          tabBarLabel: 'Attendance',
          tabBarIcon: ({ color }) => (
            <Ionicons name="time-outline" size={20} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="CommitteeProfileTab"
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
