export type AsyncStatus = "idle" | "loading" | "succeeded" | "failed";

export interface AnalyticsState {
  overview: unknown | null;
  revenueChart: unknown | null;
  topProducts: unknown[];
  orderFunnel: unknown[];
  lowStock: unknown[];
  status: AsyncStatus;
  error: string | null;
}

export type AnalyticsPeriodPayload = string | undefined;
export type TopProductsByPayload = string | undefined;
