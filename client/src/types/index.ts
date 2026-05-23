export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: "user" | "buyer" | "seller" | "admin";
  avatar?: string | null;
  addresses?: Address[];
  sellerInfo?: SellerInfo;
  createdAt?: string;
}

export interface SellerInfo {
  shopName: string;
  description?: string;
  location?: string;
  isVerified: boolean;
  rating: number;
  totalSales: number;
}

export interface Address {
  _id?: string;
  name?: string;
  fullName?: string;
  phone: string;
  flat?: string;
  area?: string;
  landmark?: string;
  addressLine1?: string;
  addressLine2?: string;
  line1?: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country?: string;
  type?: "Home" | "Work";
  isDefault?: boolean;
}

export interface Product {
  _id: string;
  slug?: string;
  name: string;
  brand: string;
  seller: string | User;
  category: string | { _id: string; name: string; slug?: string };
  subcategory?: string;
  description: string;
  price: number;
  mrp: number;
  discount: number;
  stock: number;
  images: string[];
  variants?: ProductVariant[];
  tags?: string[];
  specifications?: Specification[];
  specs?: Record<string, string>;
  averageRating: number;
  totalReviews?: number;
  totalSales?: number;
  totalStock?: number;
  reviewCount?: number;
  numReviews?: number;
  isFeatured?: boolean;
  badge?: "HOT" | "NEW" | "SALE" | "POPULAR";
  status?: "active" | "paused" | "deleted";
  isActive?: boolean;
  createdAt?: string;
}

export interface ProductVariant {
  name?: string;
  options?: string[];
  sku?: string;
  attributes?: Record<string, string>;
  stock?: number;
  priceDelta?: number;
  images?: string[];
  isActive?: boolean;
}

export interface Specification {
  key: string;
  value: string;
}

export interface CartItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  mrp: number;
  qty: number;
  variant?: string;
  seller: string;
  stock: number;
}

export interface CartState {
  items: CartItem[];
  coupon: Coupon | null;
  isLoading: boolean;
  error: string | null;
}

export interface Coupon {
  code: string;
  discount: number;
  type: "flat" | "percent";
}

export interface Order {
  _id: string;
  user: string | User;
  items: OrderItem[];
  address?: Address;
  shippingAddress?: Address;
  payment?: Payment;
  paymentMethod?: string;
  paymentStatus?: "pending" | "paid" | "failed" | "refunded";
  coupon?: Coupon;
  subtotal: number;
  discount: number;
  deliveryCharge?: number;
  shipping?: number;
  total?: number;
  totalAmount: number;
  status?: OrderStatus;
  orderStatus?: OrderStatus | "placed" | "return_requested";
  timeline?: TimelineEntry[];
  statusHistory?: TimelineEntry[];
  trackingId?: string;
  trackingNumber?: string;
  awbNumber?: string;
  courier?: string;
  courierName?: string;
  estimatedDelivery?: string;
  cancelReason?: string;
  createdAt: string;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "cancelled"
  | "returned";

export interface OrderItem {
  product: string | Product;
  name: string;
  image: string;
  price: number;
  qty?: number;
  quantity?: number;
  variant?: string;
  seller?: string | User;
}

export interface Payment {
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  method?: string;
  status: "pending" | "paid" | "failed";
}

export interface TimelineEntry {
  status: string;
  message?: string;
  note?: string;
  timestamp: string;
}

export interface Review {
  _id: string;
  product: string;
  user: User;
  rating: number;
  title: string;
  body: string;
  photos?: string[];
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  createdAt: string;
}

export interface SearchFilters {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  discount?: number;
  inStock?: boolean;
  sort?: SortOption;
}

export type SortOption =
  | "relevance"
  | "price_asc"
  | "price_desc"
  | "newest"
  | "rating"
  | "popularity";

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  total?: number;
  page?: number;
  totalPages?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  totalPages: number;
}

export interface SellerStats {
  totalRevenue: number;
  ordersToday?: number;
  totalOrders?: number;
  totalProducts: number;
  averageRating: number;
  revenueByDay: RevenuePoint[];
  recentOrders: Order[];
  lowStockProducts: Product[];
}

export interface RevenuePoint {
  date: string;
  revenue: number;
  orders: number;
}

export interface NotificationItem {
  _id: string;
  type: "order_update" | "offer" | "review_reply" | "price_drop";
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export interface ThemeContextType {
  theme: "dark" | "light";
  toggleTheme: () => void;
}
