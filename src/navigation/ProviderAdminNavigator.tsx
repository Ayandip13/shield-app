import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProviderStackParamList } from '../types/navigation';
import { ProviderDashboardScreen } from '../screens/provider/ProviderDashboardScreen';
import { BuildingsListScreen } from '../screens/provider/BuildingsListScreen';
import { BuildingDetailsScreen } from '../screens/provider/BuildingDetailsScreen';
import { AddBuildingScreen } from '../screens/provider/AddBuildingScreen';
import { EditBuildingScreen } from '../screens/provider/EditBuildingScreen';
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
        component={ProviderDashboardScreen}
        options={{ title: 'SecuShield - Control Center' }}
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
    </Stack.Navigator>
  );
};
