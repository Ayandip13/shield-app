import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../../constants/queryKeys';
import { getNotifications, getUnreadCount } from '../../services/notificationService';

export function useNotificationsQuery(page = 1, limit = 20) {
  return useQuery({
    queryKey: queryKeys.notifications.list(page, limit),
    queryFn: () => getNotifications(page, limit),
  });
}

export function useUnreadNotificationCountQuery() {
  return useQuery({
    queryKey: queryKeys.notifications.unreadCount(),
    queryFn: () => getUnreadCount(),
    refetchInterval: 30000, // Background poll count every 30s
  });
}
