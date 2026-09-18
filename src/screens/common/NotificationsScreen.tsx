import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper } from '../../components/common/ScreenWrapper';
import { Text } from '../../components/common/Text';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { theme } from '../../theme';
import { Notification, NotificationType } from '../../types/notification';
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
} from '../../services/notificationService';

export const NotificationsScreen: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [isMarkingAll, setIsMarkingAll] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchNotifications = async (targetPage = 1, isPullToRefresh = false) => {
    if (isPullToRefresh) {
      setIsRefreshing(true);
    } else if (targetPage === 1) {
      setIsLoading(true);
    } else {
      setIsLoadingMore(true);
    }
    setErrorMessage(null);

    try {
      const data = await getNotifications(targetPage, 20);
      if (targetPage === 1) {
        setNotifications(data.notifications);
      } else {
        setNotifications((prev) => [...prev, ...data.notifications]);
      }
      setPage(data.pagination.page);
      setTotalPages(data.pagination.totalPages);
      setUnreadCount(data.unreadCount);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to load notifications.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
      setIsLoadingMore(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchNotifications(1);
    }, [])
  );

  const handleMarkAsRead = async (notification: Notification) => {
    if (notification.isRead) return;

    // Optimistic update
    setNotifications((prev) =>
      prev.map((item) =>
        item._id === notification._id ? { ...item, isRead: true } : item
      )
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));

    try {
      await markAsRead(notification._id);
    } catch (error) {
      // Revert if error
      setNotifications((prev) =>
        prev.map((item) =>
          item._id === notification._id ? { ...item, isRead: false } : item
        )
      );
      setUnreadCount((prev) => prev + 1);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (unreadCount === 0 || isMarkingAll) return;

    setIsMarkingAll(true);
    // Optimistic update
    setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })));
    const originalUnread = unreadCount;
    setUnreadCount(0);

    try {
      await markAllAsRead();
    } catch (error) {
      // Revert if error
      setNotifications((prev) => prev.map((item) => ({ ...item, isRead: false })));
      setUnreadCount(originalUnread);
    } finally {
      setIsMarkingAll(false);
    }
  };

  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;

      return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (e) {
      return dateString;
    }
  };

  const getTypeConfig = (type: NotificationType) => {
    switch (type) {
      case 'security_event':
        return {
          icon: 'alert-circle-outline' as const,
          color: theme.colors.danger,
          bg: '#FEE2E2',
        };
      case 'attendance_alert':
        return {
          icon: 'time-outline' as const,
          color: '#D97706',
          bg: '#FEF3C7',
        };
      case 'guard_status':
        return {
          icon: 'person-outline' as const,
          color: theme.colors.primary,
          bg: '#E0F2FE',
        };
      case 'building_update':
        return {
          icon: 'business-outline' as const,
          color: theme.colors.info,
          bg: '#F1F5F9',
        };
      case 'system_announcement':
      default:
        return {
          icon: 'notifications-outline' as const,
          color: theme.colors.primary,
          bg: '#EFF6FF',
        };
    }
  };

  const renderNotificationItem = ({ item }: { item: Notification }) => {
    const config = getTypeConfig(item.type);

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => handleMarkAsRead(item)}
      >
        <Card
          variant={item.isRead ? 'outlined' : 'elevated'}
          style={[
            styles.notificationCard,
            !item.isRead && styles.unreadCard,
          ]}
        >
          <View style={styles.cardHeader}>
            <View style={[styles.iconContainer, { backgroundColor: config.bg }]}>
              <Ionicons name={config.icon} size={20} color={config.color} />
            </View>

            <View style={styles.headerTitleArea}>
              <View style={styles.titleRow}>
                <Text
                  variant="body"
                  style={[
                    styles.notificationTitle,
                    !item.isRead && styles.unreadTitle,
                  ]}
                  numberOfLines={1}
                >
                  {item.title}
                </Text>
                {!item.isRead && <View style={styles.unreadDot} />}
              </View>
              <Text variant="caption" style={styles.timeText}>
                {formatTime(item.createdAt)}
              </Text>
            </View>
          </View>

          <Text variant="body" style={styles.messageText}>
            {item.message}
          </Text>
        </Card>
      </TouchableOpacity>
    );
  };

  const renderHeader = () => (
    <View style={styles.topBar}>
      <View style={styles.topBarTitleRow}>
        <Text variant="heading" style={styles.topBarTitle}>
          Notifications
        </Text>
        {unreadCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{unreadCount} new</Text>
          </View>
        )}
      </View>

      {unreadCount > 0 && (
        <TouchableOpacity
          onPress={handleMarkAllAsRead}
          disabled={isMarkingAll}
          style={styles.markAllBtn}
          activeOpacity={0.7}
        >
          {isMarkingAll ? (
            <ActivityIndicator size="small" color={theme.colors.primary} />
          ) : (
            <Text style={styles.markAllBtnText}>Mark all as read</Text>
          )}
        </TouchableOpacity>
      )}
    </View>
  );

  const renderFooter = () => {
    if (!isLoadingMore) return null;
    return (
      <View style={styles.loadingMoreContainer}>
        <ActivityIndicator size="small" color={theme.colors.primary} />
      </View>
    );
  };

  const renderEmpty = () => {
    if (isLoading && !isRefreshing) return null;

    if (errorMessage) {
      return (
        <Card variant="outlined" style={styles.errorCard}>
          <Ionicons name="alert-circle-outline" size={36} color={theme.colors.danger} />
          <Text variant="heading" style={styles.errorTitle}>
            Failed to Load Notifications
          </Text>
          <Text variant="caption" style={styles.errorSubtitle}>
            {errorMessage}
          </Text>
          <Button
            title="Try Again"
            variant="outline"
            size="sm"
            onPress={() => fetchNotifications(1)}
            style={styles.retryButton}
          />
        </Card>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconContainer}>
          <Ionicons
            name="notifications-off-outline"
            size={48}
            color={theme.colors.textMuted}
          />
        </View>
        <Text variant="heading" style={styles.emptyTitle}>
          No Notifications Yet
        </Text>
        <Text variant="caption" style={styles.emptySubtitle}>
          Security updates, system announcements, and alerts will appear here.
        </Text>
      </View>
    );
  };

  return (
    <ScreenWrapper style={styles.container}>
      {isLoading && !isRefreshing ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading Notifications...</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item._id}
          renderItem={renderNotificationItem}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmpty}
          ListFooterComponent={renderFooter}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => fetchNotifications(1, true)}
              colors={[theme.colors.primary]}
            />
          }
          onEndReached={() => {
            if (page < totalPages && !isLoadingMore && !isLoading) {
              fetchNotifications(page + 1);
            }
          }}
          onEndReachedThreshold={0.3}
        />
      )}
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
  },
  listContent: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xl * 2,
    gap: theme.spacing.md,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xl * 2,
  },
  loadingText: {
    marginTop: theme.spacing.md,
    color: theme.colors.textSecondary,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  topBarTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  topBarTitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  badge: {
    backgroundColor: `${theme.colors.primary}20`,
    paddingHorizontal: theme.spacing.xs + 2,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
  },
  badgeText: {
    color: theme.colors.primary,
    fontSize: 11,
    fontWeight: '700',
  },
  markAllBtn: {
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
  },
  markAllBtnText: {
    color: theme.colors.primary,
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: '600',
  },
  notificationCard: {
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  unreadCard: {
    backgroundColor: '#F0F7FF',
    borderColor: `${theme.colors.primary}40`,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleArea: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  notificationTitle: {
    fontWeight: '600',
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.textPrimary,
    flexShrink: 1,
  },
  unreadTitle: {
    fontWeight: '700',
    color: theme.colors.primary,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.primary,
  },
  timeText: {
    fontSize: 11,
    color: theme.colors.textMuted,
    marginTop: 1,
  },
  messageText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textSecondary,
    marginTop: 2,
    lineHeight: 20,
  },
  loadingMoreContainer: {
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
  },
  errorCard: {
    alignItems: 'center',
    padding: theme.spacing.xl,
    marginTop: theme.spacing.lg,
  },
  errorTitle: {
    marginTop: theme.spacing.sm,
    color: theme.colors.textPrimary,
  },
  errorSubtitle: {
    textAlign: 'center',
    marginVertical: theme.spacing.xs,
    color: theme.colors.textSecondary,
  },
  retryButton: {
    marginTop: theme.spacing.md,
    minWidth: 120,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xl * 2,
    paddingHorizontal: theme.spacing.lg,
  },
  emptyIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  emptyTitle: {
    fontSize: theme.typography.fontSizes.lg,
    color: theme.colors.textPrimary,
  },
  emptySubtitle: {
    textAlign: 'center',
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
});
