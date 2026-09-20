import React, { useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { ScreenWrapper } from '../../components/common/ScreenWrapper';
import { Text } from '../../components/common/Text';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { theme } from '../../theme';
import { ActivityItem } from '../../types/dashboard';
import { formatRelativeDateTime } from '../../utils/dateFormatter';
import { Ionicons } from '@expo/vector-icons';
import { useSecurityActivityQuery } from '../../hooks/queries/useDashboard';
import { ListSkeleton } from '../../components/skeletons/ListSkeleton';

export const CommitteeSecurityActivityScreen: React.FC = () => {
  const {
    data: activities = [],
    isLoading,
    isRefetching: isRefreshing,
    error,
    refetch,
  } = useSecurityActivityQuery(undefined, 50);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [])
  );

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'ENTRY':
        return <Ionicons name="log-in" size={20} color={theme.colors.success} />;
      case 'EXIT':
        return <Ionicons name="log-out" size={20} color="#D97706" />;
      case 'ATTENDANCE':
        return <Ionicons name="shield-checkmark" size={20} color={theme.colors.committee} />;
      default:
        return <Ionicons name="ellipse" size={20} color={theme.colors.textMuted} />;
    }
  };

  const renderActivityItem = ({ item }: { item: ActivityItem }) => (
    <Card variant="flat" style={styles.activityCard}>
      <View style={styles.activityRow}>
        <View style={styles.iconCircle}>{getActivityIcon(item.type)}</View>
        <View style={styles.activityContent}>
          <View style={styles.titleRow}>
            <Text variant="body" style={styles.activityTitle} numberOfLines={1}>
              {item.title}
            </Text>
            <Text variant="caption" style={styles.timeText}>
              {formatRelativeDateTime(item.timestamp)}
            </Text>
          </View>
          <Text variant="caption" style={styles.activityDesc} numberOfLines={1}>
            {item.description}
          </Text>
          <View style={styles.metaRow}>
            <View style={styles.buildingBadge}>
              <Ionicons name="business-outline" size={11} color={theme.colors.committee} />
              <Text style={styles.buildingBadgeText}>{item.buildingName}</Text>
            </View>
            <View style={styles.typeBadge}>
              <Text style={styles.typeBadgeText}>{item.type}</Text>
            </View>
          </View>
        </View>
      </View>
    </Card>
  );

  return (
    <ScreenWrapper style={styles.container}>
      <View style={styles.headerArea}>
        <Text variant="heading" style={styles.screenHeaderTitle}>
          Building Security Activity Log
        </Text>
        <Text variant="caption" style={styles.screenHeaderSub}>
          Real-time record of visitor entries, exits & duty shift check-ins
        </Text>
      </View>

      {isLoading && !isRefreshing ? (
        <View style={{ padding: theme.spacing.lg }}>
          <ListSkeleton count={6} hasSearch={false} />
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Ionicons name="alert-circle-outline" size={40} color={theme.colors.danger} />
          <Text style={styles.errorText}>{(error as any)?.message || 'Failed to load building security activities.'}</Text>
          <Button title="Retry" variant="outline" size="sm" onPress={() => refetch()} style={{ marginTop: 12 }} />
        </View>
      ) : (
        <FlatList
          data={activities}
          keyExtractor={(item) => item.id}
          renderItem={renderActivityItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => refetch()}
              colors={[theme.colors.committee]}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="shield-outline" size={48} color={theme.colors.textMuted} />
              <Text variant="heading" style={styles.emptyTitle}>
                No Recent Security Activity
              </Text>
              <Text variant="caption" style={styles.emptySubtitle}>
                No entry, exit, or guard attendance records found for your building.
              </Text>
            </View>
          }
        />
      )}
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
  },
  headerArea: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceBorder,
  },
  screenHeaderTitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  screenHeaderSub: {
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  listContent: {
    padding: theme.spacing.lg,
    gap: theme.spacing.sm,
    paddingBottom: theme.spacing.xl * 2,
  },
  activityCard: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.md,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.surfaceHover,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  activityContent: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activityTitle: {
    fontWeight: '700',
    color: theme.colors.textPrimary,
    flex: 1,
    marginRight: theme.spacing.xs,
  },
  timeText: {
    fontSize: 11,
    color: theme.colors.textMuted,
  },
  activityDesc: {
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    marginTop: theme.spacing.xs,
  },
  buildingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: theme.colors.successLight,
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
  },
  buildingBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#065F46',
  },
  typeBadge: {
    backgroundColor: theme.colors.surfaceHover,
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
  },
  typeBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: theme.colors.textSecondary,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  errorText: {
    color: theme.colors.danger,
    marginTop: theme.spacing.sm,
    textAlign: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xl * 2,
  },
  emptyTitle: {
    marginTop: theme.spacing.md,
    color: theme.colors.textPrimary,
  },
  emptySubtitle: {
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
});
