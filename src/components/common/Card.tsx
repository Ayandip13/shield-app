import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { theme } from '../../theme';

export interface CardProps extends ViewProps {
  children: React.ReactNode;
  variant?: 'elevated' | 'outlined' | 'flat';
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'elevated',
  style,
  ...props
}) => {
  return (
    <View style={[styles.base, styles[variant], style]} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginVertical: theme.spacing.sm,
  },
  elevated: {
    ...theme.shadows.md,
    borderWidth: 1,
    borderColor: 'rgba(24, 119, 242, 0.08)',
  },
  outlined: {
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
  },
  flat: {
    backgroundColor: theme.colors.primaryLight,
  },
});
