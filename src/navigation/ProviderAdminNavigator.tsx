import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProviderStackParamList } from '../types/navigation';
import { ProviderAdminTabNavigator } from './ProviderAdminTabNavigator';
import { ProviderDashboardScreen } from '../screens/provider/ProviderDashboardScreen';
import { BuildingsListScreen } from '../screens/provider/BuildingsListScreen';
import { BuildingDetailsScreen } from '../screens/provider/BuildingDetailsScreen';
import { AddBuildingScreen } from '../screens/provider/AddBuildingScreen';
import { EditBuildingScreen } from '../screens/provider/EditBuildingScreen';
import { GuardsListScreen } from '../screens/provider/GuardsListScreen';
import { AddGuardScreen } from '../screens/provider/AddGuardScreen';
import { GuardDetailsScreen } from '../screens/provider/GuardDetailsScreen';
import { EditGuardScreen } from '../screens/provider/EditGuardScreen';
import { CommitteeListScreen } from '../screens/provider/CommitteeListScreen';
import { AddCommitteeMemberScreen } from '../screens/provider/AddCommitteeMemberScreen';
import { CommitteeDetailsScreen } from '../screens/provider/CommitteeDetailsScreen';
import { EditCommitteeMemberScreen } from '../screens/provider/EditCommitteeMemberScreen';
import { ProviderAttendanceScreen } from '../screens/provider/ProviderAttendanceScreen';
import { ProviderEntryExitScreen } from '../screens/provider/ProviderEntryExitScreen';
import { ProviderSecurityActivityScreen } from '../screens/provider/ProviderSecurityActivityScreen';
import { ProfileScreen } from '../screens/common/ProfileScreen';
import { EditProfileScreen } from '../screens/common/EditProfileScreen';
import { ChangePasswordScreen } from '../screens/common/ChangePasswordScreen';
import { NotificationsScreen } from '../screens/common/NotificationsScreen';
import { theme } from '../theme';

const Stack = createNativeStackNavigator<ProviderStackParamList>();

export const ProviderAdminNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="ProviderDashboard"
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
        name="ProviderDashboard"
        component={ProviderAdminTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="BuildingsList"
        component={BuildingsListScreen}
        options={{ title: 'All Security Buildings' }}
      />
      <Stack.Screen
        name="BuildingDetails"
        component={BuildingDetailsScreen}
        options={{ title: 'Building Details' }}
      />
      <Stack.Screen
        name="AddBuilding"
        component={AddBuildingScreen}
        options={{ title: 'Register Building' }}
      />
      <Stack.Screen
        name="EditBuilding"
        component={EditBuildingScreen}
        options={{ title: 'Edit Building' }}
      />
      <Stack.Screen
        name="GuardsList"
        component={GuardsListScreen}
        options={{ title: 'Security Personnel' }}
      />
      <Stack.Screen
        name="AddGuard"
        component={AddGuardScreen}
        options={{ title: 'Register Guard' }}
      />
      <Stack.Screen
        name="GuardDetails"
        component={GuardDetailsScreen}
        options={{ title: 'Guard Overview' }}
      />
      <Stack.Screen
        name="EditGuard"
        component={EditGuardScreen}
        options={{ title: 'Edit Guard Profile' }}
      />
      <Stack.Screen
        name="CommitteeList"
        component={CommitteeListScreen}
        options={{ title: 'Building Committee' }}
      />
      <Stack.Screen
        name="AddCommitteeMember"
        component={AddCommitteeMemberScreen}
        options={{ title: 'Register Committee Member' }}
      />
      <Stack.Screen
        name="CommitteeDetails"
        component={CommitteeDetailsScreen}
        options={{ title: 'Committee Representative' }}
      />
      <Stack.Screen
        name="EditCommitteeMember"
        component={EditCommitteeMemberScreen}
        options={{ title: 'Edit Committee Member' }}
      />
      <Stack.Screen
        name="ProviderAttendance"
        component={ProviderAttendanceScreen}
        options={{ title: 'Attendance Overview' }}
      />
      <Stack.Screen
        name="ProviderEntryExit"
        component={ProviderEntryExitScreen}
        options={{ title: 'Visitor Entry / Exit Logs' }}
      />
      <Stack.Screen
        name="ProviderSecurityActivity"
        component={ProviderSecurityActivityScreen}
        options={{ title: 'Security Activity Log' }}
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
