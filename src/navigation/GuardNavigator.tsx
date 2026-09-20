import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GuardStackParamList } from '../types/navigation';
import { GuardTabNavigator } from './GuardTabNavigator';
import { GuardHomeScreen } from '../screens/guard/GuardHomeScreen';
import { GuardAttendanceScreen } from '../screens/guard/GuardAttendanceScreen';
import { GuardShiftScreen } from '../screens/guard/GuardShiftScreen';
import { GuardEntryExitScreen } from '../screens/guard/GuardEntryExitScreen';
import { AddEntryLogScreen } from '../screens/guard/AddEntryLogScreen';
import { EntryLogHistoryScreen } from '../screens/guard/EntryLogHistoryScreen';
import { EntryLogDetailsScreen } from '../screens/guard/EntryLogDetailsScreen';
import { ProfileScreen } from '../screens/common/ProfileScreen';
import { EditProfileScreen } from '../screens/common/EditProfileScreen';
import { ChangePasswordScreen } from '../screens/common/ChangePasswordScreen';
import { NotificationsScreen } from '../screens/common/NotificationsScreen';
import { theme } from '../theme';

const Stack = createNativeStackNavigator<GuardStackParamList>();

export const GuardNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="GuardHome"
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
      <Stack.Screen
        name="GuardHome"
        component={GuardTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="GuardAttendance"
        component={GuardAttendanceScreen}
        options={{ title: 'Duty Attendance' }}
      />
      <Stack.Screen
        name="GuardShift"
        component={GuardShiftScreen}
        options={{ title: 'My Shift Schedule' }}
      />
      <Stack.Screen
        name="GuardEntryExit"
        component={GuardEntryExitScreen}
        options={{ title: 'Entry / Exit Terminal' }}
      />
      <Stack.Screen
        name="AddEntryLog"
        component={AddEntryLogScreen}
        options={{ title: 'Record Building Entry' }}
      />
      <Stack.Screen
        name="EntryLogHistory"
        component={EntryLogHistoryScreen}
        options={{ title: 'Visitor & Access History' }}
      />
      <Stack.Screen
        name="EntryLogDetails"
        component={EntryLogDetailsScreen}
        options={{ title: 'Entry Log Details' }}
      />
      <Stack.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{ title: 'Notifications Center' }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'My Account Profile' }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ title: 'Edit Profile' }}
      />
      <Stack.Screen
        name="ChangePassword"
        component={ChangePasswordScreen}
        options={{ title: 'Change Password' }}
      />
    </Stack.Navigator>
  );
};
