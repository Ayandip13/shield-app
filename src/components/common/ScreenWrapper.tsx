import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { theme } from '../../theme';

export interface ScreenWrapperProps {
  children: React.ReactNode;
  style?: ViewStyle;
  safeArea?: boolean;
}

export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children,
  style,
  safeArea = true,
}) => {
  const Container = safeArea ? SafeAreaView : View;

  return (
    <Container style={[styles.container, style]}>
      <StatusBar style="dark" />
      {children}
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
});
