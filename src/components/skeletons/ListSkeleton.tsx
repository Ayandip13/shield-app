import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Skeleton, SkeletonCard, SkeletonCircle } from '../common/Skeleton';

interface ListSkeletonProps {
  count?: number;
  hasSearch?: boolean;
}

export const ListSkeleton: React.FC<ListSkeletonProps> = ({
  count = 5,
  hasSearch = true,
}) => {
  return (
    <View style={styles.container}>
      {hasSearch && (
        <View style={styles.searchBar}>
          <Skeleton height={46} borderRadius={10} />
        </View>
      )}

      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} style={styles.card}>
          <View style={styles.row}>
            <SkeletonCircle size={44} style={{ marginRight: 12 }} />
            <View style={styles.textContainer}>
              <Skeleton width="65%" height={16} style={{ marginBottom: 6 }} />
              <Skeleton width="45%" height={12} style={{ marginBottom: 4 }} />
              <Skeleton width="30%" height={12} />
            </View>
            <Skeleton width={60} height={24} borderRadius={12} />
          </View>
        </SkeletonCard>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  searchBar: {
    marginBottom: 16,
  },
  card: {
    padding: 14,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
});
