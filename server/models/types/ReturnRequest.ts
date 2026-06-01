export type ReturnReason = "defective" | "wrong_item" | "not_as_described" | "changed_mind" | "damaged_in_transit" | "other";
export type ReturnStatus = "requested" | "approved" | "rejected" | "refund_initiated" | "refunded" | "closed";

export interface IReturnItem {
  product: string;
  variantSku: string;
  qty: number;
  reason: ReturnReason;
  description: string;
  images: string[];
}

export interface IReturnStatusHistory {
  status: string;
  note: string;
  updatedBy?: string;
  timestamp: Date;
}

export interface IReturnRequest {
  _id: string;
  order: string;
  buyer: string;
  seller: string;
  items: IReturnItem[];
  status: ReturnStatus;
  statusHistory: IReturnStatusHistory[];
  refundAmount: number;
  razorpayRefundId: string;
  sellerNote: string;
  resolvedAt?: Date;
  returnWindow: number;
  createdAt: Date;
  updatedAt: Date;
}
