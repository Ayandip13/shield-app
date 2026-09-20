import React, { useEffect, useRef } from 'react';
import { Animated, StyleProp, ViewStyle, StyleSheet, View } from 'react-native';
import { colors } from '../../constants/colors';

interface SkeletonProps {
  width?: number | `${number}%` | 'auto';
  height?: number;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 16,
  borderRadius = 8,
  style,
}) => {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.9,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width: width as any,
          height,
          borderRadius,
          opacity,
        },
        style,
      ]}
    />
  );
};

export const SkeletonCircle: React.FC<{ size?: number; style?: StyleProp<ViewStyle> }> = ({
  size = 48,
  style,
}) => {
  return <Skeleton width={size} height={size} borderRadius={size / 2} style={style} />;
};

export const SkeletonText: React.FC<{
  lines?: number;
  height?: number;
  style?: StyleProp<ViewStyle>;
}> = ({ lines = 1, height = 14, style }) => {
  return (
    <View style={[{ gap: 8 }, style]}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          height={height}
          width={i === lines - 1 && lines > 1 ? '70%' : '100%'}
        />
      ))}
    </View>
  );
};

export const SkeletonCard: React.FC<{
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}> = ({ children, style }) => {
  return <View style={[styles.card, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: '#E2E8F0',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    marginBottom: 12,
  },
});
