export type NotificationType =
  | "new_order"
  | "order_status"
  | "review_received"
  | "low_stock"
  | "promo"
  | "return_requested"
  | "verification_request"
  | "verification_approved";

export interface INotification {
  _id: string;
  recipient: string;
  type: NotificationType;
  title: string;
  body: string;
  link: string;
  isRead: boolean;
  meta: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}
