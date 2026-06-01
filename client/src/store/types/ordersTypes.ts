export type AsyncStatus = "idle" | "loading" | "succeeded" | "failed";

export interface OrdersState {
  status: AsyncStatus;
  error: string | null;
  lastUpdatedOrder: unknown | null;
}

export interface UpdateOrderStatusPayload {
  orderId: string;
  status: string;
  note?: string;
  awbNumber?: string;
  courierName?: string;
  estimatedDelivery?: string | Date;
}
