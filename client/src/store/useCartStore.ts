import { create } from "zustand";
import type { CartItem, CartState, Coupon } from "@/types";

interface CartStore extends CartState {
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, variant?: string) => void;
  updateQty: (productId: string, qty: number, variant?: string) => void;
  applyCoupon: (coupon: Coupon) => void;
  removeCoupon: () => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getDiscount: () => number;
  getTotal: () => number;
  itemCount: () => number;
}

const sameLineItem = (item: CartItem, productId: string, variant?: string) =>
  item.productId === productId && (item.variant || "") === (variant || "");

const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  coupon: null,
  isLoading: false,
  error: null,
  addItem: (item) => {
    set((state) => {
      const existing = state.items.find((row) => sameLineItem(row, item.productId, item.variant));
      if (!existing) return { items: [...state.items, { ...item, qty: Math.min(item.qty, item.stock) }] };
      return {
        items: state.items.map((row) =>
          sameLineItem(row, item.productId, item.variant)
            ? { ...row, qty: Math.min(row.qty + item.qty, row.stock) }
            : row
        )
      };
    });
  },
  removeItem: (productId, variant) => {
    set((state) => ({ items: state.items.filter((item) => !sameLineItem(item, productId, variant)) }));
  },
  updateQty: (productId, qty, variant) => {
    set((state) => ({
      items: state.items.map((item) =>
        sameLineItem(item, productId, variant)
          ? { ...item, qty: Math.max(1, Math.min(qty, item.stock)) }
          : item
      )
    }));
  },
  applyCoupon: (coupon) => set({ coupon }),
  removeCoupon: () => set({ coupon: null }),
  clearCart: () => set({ items: [], coupon: null, error: null, isLoading: false }),
  getSubtotal: () => get().items.reduce((sum, item) => sum + item.price * item.qty, 0),
  getDiscount: () => {
    const coupon = get().coupon;
    if (!coupon) return 0;
    const subtotal = get().getSubtotal();
    return coupon.type === "percent" ? Math.round((subtotal * coupon.discount) / 100) : Math.min(coupon.discount, subtotal);
  },
  getTotal: () => Math.max(0, get().getSubtotal() - get().getDiscount()),
  itemCount: () => get().items.reduce((sum, item) => sum + item.qty, 0)
}));

export default useCartStore;
