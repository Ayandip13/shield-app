export type NotificationType =
  | 'attendance_alert'
  | 'security_event'
  | 'guard_status'
  | 'building_update'
  | 'system_announcement';

export type RelatedEntityType =
  | 'attendance'
  | 'entry_log'
  | 'guard'
  | 'building'
  | 'user'
  | 'system';

export interface Notification {
  _id: string;
  providerId: string;
  buildingId?: string;
  recipientUserId?: string;
  type: NotificationType;
  title: string;
  message: string;
  relatedEntityType?: RelatedEntityType;
  relatedEntityId?: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface NotificationResponse {
  success: boolean;
  message?: string;
  data: {
    notifications: Notification[];
    pagination: NotificationPagination;
    unreadCount: number;
  };
}

export interface UnreadCountResponse {
  success: boolean;
  message?: string;
  data: {
    unreadCount: number;
  };
}
