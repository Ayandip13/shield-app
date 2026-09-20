import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { SafeAreaView, NativeSafeAreaViewProps } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { theme } from '../../theme';

export interface ScreenWrapperProps {
  children: React.ReactNode;
  style?: ViewStyle;
  safeArea?: boolean;
  hasHeader?: boolean;
  edges?: NativeSafeAreaViewProps['edges'];
}

export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children,
  style,
  safeArea = true,
  hasHeader = true,
  edges,
}) => {
  const resolvedEdges: NativeSafeAreaViewProps['edges'] = edges
    ? edges
    : safeArea
    ? hasHeader
      ? ['bottom', 'left', 'right']
      : ['top', 'bottom', 'left', 'right']
    : [];

  return (
    <SafeAreaView edges={resolvedEdges} style={[styles.container, style]}>
      <StatusBar style="dark" />
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
});

