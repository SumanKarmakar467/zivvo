export interface OrderState {
  orders: unknown[];
  currentOrder: unknown | null;
}

export type SetOrdersPayload = unknown[];
export type SetCurrentOrderPayload = unknown | null;
