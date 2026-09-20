import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../../constants/queryKeys';
import { markAsRead, markAllAsRead } from '../../services/notificationService';

export function useMarkNotificationAsReadMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (notificationId: string) => markAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.root });
    },
  });
}

export function useMarkAllNotificationsAsReadMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.root });
    },
  });
}
