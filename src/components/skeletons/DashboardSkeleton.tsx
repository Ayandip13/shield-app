import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Skeleton, SkeletonCard, SkeletonCircle, SkeletonText } from '../common/Skeleton';
import { colors } from '../../constants/colors';

export const DashboardSkeleton: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Header Profile Greeting Skeleton */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Skeleton width={140} height={14} style={{ marginBottom: 8 }} />
          <Skeleton width={200} height={22} />
        </View>
        <SkeletonCircle size={44} />
      </View>

      {/* Primary KPI Card Skeleton */}
      <SkeletonCard style={styles.heroCard}>
        <Skeleton width={120} height={14} style={{ marginBottom: 12 }} />
        <Skeleton width={80} height={32} style={{ marginBottom: 16 }} />
        <View style={styles.row}>
          <Skeleton width="45%" height={14} />
          <Skeleton width="45%" height={14} />
        </View>
      </SkeletonCard>

      {/* Grid Cards Skeleton */}
      <View style={styles.grid}>
        <SkeletonCard style={styles.gridCard}>
          <SkeletonCircle size={36} style={{ marginBottom: 12 }} />
          <Skeleton width={60} height={24} style={{ marginBottom: 6 }} />
          <Skeleton width={80} height={12} />
        </SkeletonCard>
        <SkeletonCard style={styles.gridCard}>
          <SkeletonCircle size={36} style={{ marginBottom: 12 }} />
          <Skeleton width={60} height={24} style={{ marginBottom: 6 }} />
          <Skeleton width={80} height={12} />
        </SkeletonCard>
      </View>

      {/* Recent Activity List Header */}
      <View style={styles.sectionHeader}>
        <Skeleton width={160} height={18} />
        <Skeleton width={60} height={14} />
      </View>

      {/* List Items Skeleton */}
      {Array.from({ length: 3 }).map((_, idx) => (
        <SkeletonCard key={idx} style={styles.activityItem}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <SkeletonCircle size={40} style={{ marginRight: 12 }} />
            <View style={{ flex: 1 }}>
              <Skeleton width="60%" height={14} style={{ marginBottom: 6 }} />
              <Skeleton width="40%" height={12} />
            </View>
            <Skeleton width={50} height={14} />
          </View>
        </SkeletonCard>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  heroCard: {
    backgroundColor: colors.surface,
    padding: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  grid: {
    flexDirection: 'row',
    gap: 12,
  },
  gridCard: {
    flex: 1,
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 4,
  },
  activityItem: {
    padding: 14,
    marginBottom: 8,
  },
});
