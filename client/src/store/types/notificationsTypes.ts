export type AsyncStatus = "idle" | "loading" | "succeeded" | "failed";

export interface NotificationItem {
  _id?: string;
  isRead?: boolean;
  [key: string]: unknown;
}

export interface NotificationsState {
  items: NotificationItem[];
  unreadCount: number;
  status: AsyncStatus;
  error: string | null;
  page: number;
  pages: number;
}

export interface FetchNotificationsPayload {
  page?: number;
  limit?: number;
  unreadOnly?: boolean;
}

export type NotificationIdPayload = string;
export type AddNotificationPayload = NotificationItem;
