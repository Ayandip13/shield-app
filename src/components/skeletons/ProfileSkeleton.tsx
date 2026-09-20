import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Skeleton, SkeletonCard, SkeletonCircle } from '../common/Skeleton';

export const ProfileSkeleton: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <SkeletonCircle size={80} style={{ marginBottom: 12 }} />
        <Skeleton width={160} height={20} style={{ marginBottom: 6 }} />
        <Skeleton width={100} height={14} style={{ marginBottom: 8 }} />
        <Skeleton width={90} height={24} borderRadius={12} />
      </View>

      {/* Account Info Card */}
      <SkeletonCard>
        <Skeleton width={140} height={16} style={{ marginBottom: 16 }} />
        {Array.from({ length: 4 }).map((_, i) => (
          <View key={i} style={styles.fieldRow}>
            <Skeleton width="30%" height={14} />
            <Skeleton width="55%" height={14} />
          </View>
        ))}
      </SkeletonCard>

      {/* Action Buttons */}
      <SkeletonCard>
        <Skeleton height={46} borderRadius={8} style={{ marginBottom: 10 }} />
        <Skeleton height={46} borderRadius={8} />
      </SkeletonCard>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 12,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  fieldRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
});
