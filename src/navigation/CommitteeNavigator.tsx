import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CommitteeStackParamList } from '../types/navigation';
import { CommitteeHomeScreen } from '../screens/committee/CommitteeHomeScreen';
import { CommitteeAttendanceScreen } from '../screens/committee/CommitteeAttendanceScreen';
import { CommitteeEntryExitScreen } from '../screens/committee/CommitteeEntryExitScreen';
import { CommitteeSecurityActivityScreen } from '../screens/committee/CommitteeSecurityActivityScreen';
import { theme } from '../theme';

const Stack = createNativeStackNavigator<CommitteeStackParamList>();

export const CommitteeNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="CommitteeHome"
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerTintColor: theme.colors.committee,
        headerTitleStyle: {
          fontWeight: '600',
          color: theme.colors.textPrimary,
        },
        contentStyle: {
          backgroundColor: theme.colors.background,
        },
      }}
    >
      <Stack.Screen
        name="CommitteeHome"
        component={CommitteeHomeScreen}
        options={{ title: 'SecuShield - Committee Portal' }}
      />
      <Stack.Screen
        name="CommitteeAttendance"
        component={CommitteeAttendanceScreen}
        options={{ title: 'Building Attendance Logs' }}
      />
      <Stack.Screen
        name="CommitteeEntryExit"
        component={CommitteeEntryExitScreen}
        options={{ title: 'Visitor Entry / Exit Activity' }}
      />
      <Stack.Screen
        name="CommitteeSecurityActivity"
        component={CommitteeSecurityActivityScreen}
        options={{ title: 'Building Security Activity Log' }}
      />
    </Stack.Navigator>
  );
};
