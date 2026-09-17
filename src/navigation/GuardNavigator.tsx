import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GuardStackParamList } from '../types/navigation';
import { GuardHomeScreen } from '../screens/guard/GuardHomeScreen';
import { GuardAttendanceScreen } from '../screens/guard/GuardAttendanceScreen';
import { GuardShiftScreen } from '../screens/guard/GuardShiftScreen';
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
        component={GuardHomeScreen}
        options={{ title: 'SecuShield - Guard Terminal' }}
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
    </Stack.Navigator>
  );
};
