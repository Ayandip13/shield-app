import { request } from './apiClient';
import {
  Notification,
  NotificationPagination,
} from '../types/notification';

export interface GetNotificationsResult {
  notifications: Notification[];
  pagination: NotificationPagination;
  unreadCount: number;
}

/**
 * Fetch paginated notifications for current user/tenant context
 */
export async function getNotifications(
  page = 1,
  limit = 20
): Promise<GetNotificationsResult> {
  const queryParams = new URLSearchParams();
  queryParams.append('page', String(page));
  queryParams.append('limit', String(limit));

  const response = await request<GetNotificationsResult>(
    `/notifications?${queryParams.toString()}`
  );
  return response.data!;
}

/**
 * Mark a single notification as read
 */
export async function markAsRead(notificationId: string): Promise<Notification> {
  const response = await request<Notification>(
    `/notifications/${notificationId}/read`,
    {
      method: 'PATCH',
    }
  );
  return response.data!;
}

/**
 * Mark all unread notifications as read
 */
export async function markAllAsRead(): Promise<void> {
  await request<null>('/notifications/read-all', {
    method: 'PATCH',
  });
}

/**
 * Get total unread notifications count for current user context
 */
export async function getUnreadCount(): Promise<number> {
  const response = await request<{ unreadCount: number }>('/notifications/unread-count');
  return response.data?.unreadCount || 0;
}
