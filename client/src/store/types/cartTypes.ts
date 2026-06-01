export interface CartProduct {
  _id?: string;
  name?: string;
  price?: number;
  images?: string[];
  image?: string;
}

export interface CartItem {
  _id?: string;
  product?: CartProduct | string;
  quantity: number;
  price: number;
  variantSku?: string;
  variantAttributes?: Record<string, string>;
}

export interface AppliedCoupon {
  code: string;
  discount: number;
  finalTotal: number;
}

export interface CartState {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  couponDiscount: number;
  total: number;
  couponCode: string;
  appliedCoupon: AppliedCoupon | null;
  itemCount: number;
  loading: boolean;
}

export interface SetCartPayload extends Partial<CartState> {}
export interface AddToCartPayload {
  productId: string;
  quantity?: number;
  productData?: CartProduct;
  variantSku?: string;
  variantAttributes?: Record<string, string>;
  priceOverride?: number | null;
}

export interface UpdateCartItemPayload {
  itemId: string;
  quantity: number;
}
