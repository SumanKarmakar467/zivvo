export type OrderStatus = "payment_pending" | "payment_confirmed" | "placed" | "confirmed" | "processing" | "shipped" | "out_for_delivery" | "delivered" | "cancelled" | "return_requested" | "returned";
export type OrderTrackingStatus = "payment_pending" | "payment_confirmed" | "processing" | "shipped" | "delivered" | "cancelled";

export interface IOrderItem {
  product: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  seller: string;
  variantSku: string;
  variantAttributes: Record<string, string>;
}

export interface IOrderStatusHistory {
  status: OrderStatus;
  timestamp: Date;
  note: string;
  updatedBy?: string;
}

export interface IOrderShippingAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface IOrder {
  _id: string;
  user: string;
  items: IOrderItem[];
  shippingAddress: IOrderShippingAddress;
  paymentMethod: "razorpay" | "cod";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  orderStatus: OrderStatus;
  status: OrderTrackingStatus;
  statusHistory: IOrderStatusHistory[];
  subtotal: number;
  discount: number;
  couponCode: string;
  discountAmount: number;
  couponDiscount: number;
  shipping: number;
  total: number;
  totalAmount: number;
  awbNumber: string;
  courierName: string;
  estimatedDelivery?: Date;
  trackingNumber: string;
  cancelReason: string;
  createdAt: Date;
  updatedAt: Date;
}
