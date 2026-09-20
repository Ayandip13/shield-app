import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Skeleton, SkeletonCard, SkeletonCircle } from '../common/Skeleton';

export const DetailsSkeleton: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Header Profile / Card */}
      <SkeletonCard style={styles.headerCard}>
        <View style={styles.avatarRow}>
          <SkeletonCircle size={64} style={{ marginRight: 16 }} />
          <View style={{ flex: 1 }}>
            <Skeleton width="70%" height={20} style={{ marginBottom: 8 }} />
            <Skeleton width="45%" height={14} style={{ marginBottom: 6 }} />
            <Skeleton width="30%" height={22} borderRadius={11} />
          </View>
        </View>
      </SkeletonCard>

      {/* Details Sections */}
      <SkeletonCard>
        <Skeleton width={120} height={16} style={{ marginBottom: 16 }} />
        {Array.from({ length: 4 }).map((_, i) => (
          <View key={i} style={styles.infoRow}>
            <Skeleton width="35%" height={14} />
            <Skeleton width="50%" height={14} />
          </View>
        ))}
      </SkeletonCard>

      {/* Second Section */}
      <SkeletonCard>
        <Skeleton width={140} height={16} style={{ marginBottom: 16 }} />
        {Array.from({ length: 3 }).map((_, i) => (
          <View key={i} style={styles.infoRow}>
            <Skeleton width="30%" height={14} />
            <Skeleton width="40%" height={14} />
          </View>
        ))}
      </SkeletonCard>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 12,
  },
  headerCard: {
    padding: 20,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
});
