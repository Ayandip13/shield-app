import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';
import { theme } from '../../theme';

export interface TextProps extends RNTextProps {
  variant?: 'title' | 'subtitle' | 'heading' | 'body' | 'caption';
  color?: string;
  weight?: keyof typeof theme.typography.fontWeights;
  children: React.ReactNode;
}

export const Text: React.FC<TextProps> = ({
  variant = 'body',
  color,
  weight,
  style,
  children,
  ...props
}) => {
  return (
    <RNText
      style={[
        styles.base,
        styles[variant],
        color ? { color } : undefined,
        weight ? { fontWeight: theme.typography.fontWeights[weight] } : undefined,
        style,
      ]}
      {...props}
    >
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  base: {
    color: theme.colors.textPrimary,
  },
  title: {
    fontSize: theme.typography.fontSizes.xxxl,
    fontWeight: theme.typography.fontWeights.bold,
    lineHeight: theme.typography.fontSizes.xxxl * theme.typography.lineHeights.tight,
  },
  subtitle: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.semibold,
    lineHeight: theme.typography.fontSizes.xl * theme.typography.lineHeights.normal,
  },
  heading: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold,
  },
  body: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.regular,
    lineHeight: theme.typography.fontSizes.md * theme.typography.lineHeights.relaxed,
  },
  caption: {
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.textSecondary,
  },
});
