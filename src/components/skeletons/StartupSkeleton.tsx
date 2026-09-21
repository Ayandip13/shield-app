import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ScreenWrapper } from '../common/ScreenWrapper';
import { Skeleton, SkeletonCard, SkeletonCircle } from '../common/Skeleton';
import { colors } from '../../constants/colors';
import { theme } from '../../theme';

export const StartupSkeleton: React.FC = () => {
  return (
    <ScreenWrapper hasHeader={false} style={styles.container}>
      <View style={styles.content}>
        {/* Brand Header Banner */}
        <View style={styles.brandHeader}>
          <View style={styles.brandRow}>
            <SkeletonCircle size={38} style={styles.shieldIcon} />
            <View style={styles.brandInfo}>
              <Skeleton width={110} height={18} style={{ marginBottom: 4 }} />
              <Skeleton width={180} height={12} />
            </View>
          </View>
        </View>

        {/* User Session Hero Card */}
        <SkeletonCard style={styles.heroCard}>
          <View style={styles.userRow}>
            <SkeletonCircle size={48} style={{ marginRight: 14 }} />
            <View style={{ flex: 1 }}>
              <Skeleton width={160} height={18} style={{ marginBottom: 6 }} />
              <Skeleton width={120} height={13} style={{ marginBottom: 8 }} />
              <Skeleton width={140} height={16} borderRadius={12} />
            </View>
          </View>
        </SkeletonCard>

        {/* 2x2 Metrics Grid */}
        <View style={styles.grid}>
          <SkeletonCard style={styles.gridCard}>
            <SkeletonCircle size={32} style={{ marginBottom: 10 }} />
            <Skeleton width={50} height={22} style={{ marginBottom: 6 }} />
            <Skeleton width={75} height={11} />
          </SkeletonCard>
          <SkeletonCard style={styles.gridCard}>
            <SkeletonCircle size={32} style={{ marginBottom: 10 }} />
            <Skeleton width={50} height={22} style={{ marginBottom: 6 }} />
            <Skeleton width={75} height={11} />
          </SkeletonCard>
        </View>

        {/* Section Header Placeholder */}
        <View style={styles.sectionHeader}>
          <Skeleton width={180} height={16} />
          <Skeleton width={50} height={12} />
        </View>

        {/* Activity Items Placeholder */}
        <SkeletonCard style={styles.activityCard}>
          <View style={styles.activityRow}>
            <SkeletonCircle size={36} style={{ marginRight: 12 }} />
            <View style={{ flex: 1 }}>
              <Skeleton width="65%" height={14} style={{ marginBottom: 6 }} />
              <Skeleton width="40%" height={12} />
            </View>
          </View>
        </SkeletonCard>

        <SkeletonCard style={styles.activityCard}>
          <View style={styles.activityRow}>
            <SkeletonCircle size={36} style={{ marginRight: 12 }} />
            <View style={{ flex: 1 }}>
              <Skeleton width="55%" height={14} style={{ marginBottom: 6 }} />
              <Skeleton width="35%" height={12} />
            </View>
          </View>
        </SkeletonCard>
      </View>

      {/* Bottom Navigation Placeholder */}
      <View style={styles.bottomBarPlaceholder}>
        <SkeletonCircle size={24} />
        <SkeletonCircle size={24} />
        <SkeletonCircle size={24} />
        <SkeletonCircle size={24} />
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    padding: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  brandHeader: {
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shieldIcon: {
    marginRight: theme.spacing.md,
  },
  brandInfo: {
    flex: 1,
  },
  heroCard: {
    padding: theme.spacing.lg,
    backgroundColor: colors.surface,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  grid: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  gridCard: {
    flex: 1,
    padding: theme.spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: theme.spacing.xs,
  },
  activityCard: {
    padding: theme.spacing.md,
    marginBottom: theme.spacing.xs,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bottomBarPlaceholder: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 50,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceBorder,
    paddingHorizontal: theme.spacing.xl,
  },
});
