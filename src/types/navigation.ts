import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { Building } from './building';

export type ProviderStackParamList = {
  ProviderDashboard: undefined;
  BuildingsList: undefined;
  BuildingDetails: { buildingId: string };
  AddBuilding: undefined;
  EditBuilding: { building: Building };
};

export type RootStackParamList = {
  Home: undefined;
  Auth: undefined;
  ProviderAdmin: undefined;
  Committee: undefined;
  Guard: undefined;
};

export type NavigationProp<T extends keyof RootStackParamList> = NativeStackNavigationProp<
  RootStackParamList,
  T
>;

export type ScreenRouteProp<T extends keyof RootStackParamList> = RouteProp<
  RootStackParamList,
  T
>;

export type ProviderNavigationProp<T extends keyof ProviderStackParamList> = NativeStackNavigationProp<
  ProviderStackParamList,
  T
>;

export type ProviderScreenRouteProp<T extends keyof ProviderStackParamList> = RouteProp<
  ProviderStackParamList,
  T
>;
