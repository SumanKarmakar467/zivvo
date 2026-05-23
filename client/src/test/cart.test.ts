import { describe, it, expect, beforeEach } from "vitest";
import { act, renderHook } from "@testing-library/react";
import useCartStore from "@/store/useCartStore";
import type { CartItem } from "@/types";

const mockItem: CartItem = {
  productId: "prod_001",
  name: "Blue Pottery Vase",
  image: "https://example.com/vase.jpg",
  price: 4199,
  mrp: 6500,
  qty: 1,
  seller: "seller_001",
  stock: 10
};

const mockItem2: CartItem = {
  productId: "prod_002",
  name: "Silk Chanderi Kurta",
  image: "https://example.com/kurta.jpg",
  price: 2899,
  mrp: 3999,
  qty: 2,
  seller: "seller_002",
  stock: 5
};

describe("useCartStore", () => {
  beforeEach(() => {
    const { result } = renderHook(() => useCartStore());
    act(() => { result.current.clearCart(); });
  });

  it("adds a new item to the cart", () => {
    const { result } = renderHook(() => useCartStore());
    act(() => { result.current.addItem(mockItem); });
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].productId).toBe("prod_001");
  });

  it("increments quantity when same item added twice", () => {
    const { result } = renderHook(() => useCartStore());
    act(() => {
      result.current.addItem(mockItem);
      result.current.addItem(mockItem);
    });
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].qty).toBe(2);
  });

  it("does not exceed available stock when adding", () => {
    const { result } = renderHook(() => useCartStore());
    const lowStockItem = { ...mockItem, stock: 2 };
    act(() => {
      result.current.addItem(lowStockItem);
      result.current.addItem(lowStockItem);
      result.current.addItem(lowStockItem);
    });
    expect(result.current.items[0].qty).toBe(2);
  });

  it("removes an item from the cart", () => {
    const { result } = renderHook(() => useCartStore());
    act(() => {
      result.current.addItem(mockItem);
      result.current.removeItem("prod_001");
    });
    expect(result.current.items).toHaveLength(0);
  });

  it("updates item quantity correctly", () => {
    const { result } = renderHook(() => useCartStore());
    act(() => {
      result.current.addItem(mockItem);
      result.current.updateQty("prod_001", 3);
    });
    expect(result.current.items[0].qty).toBe(3);
  });

  it("calculates subtotal correctly for multiple items", () => {
    const { result } = renderHook(() => useCartStore());
    act(() => {
      result.current.addItem(mockItem);
      result.current.addItem(mockItem2);
    });
    expect(result.current.getSubtotal()).toBe(4199 + 2899 * 2);
  });

  it("applies flat coupon discount correctly", () => {
    const { result } = renderHook(() => useCartStore());
    act(() => {
      result.current.addItem(mockItem);
      result.current.applyCoupon({ code: "SAVE200", discount: 200, type: "flat" });
    });
    expect(result.current.getDiscount()).toBe(200);
  });

  it("applies percentage coupon discount correctly", () => {
    const { result } = renderHook(() => useCartStore());
    act(() => {
      result.current.addItem(mockItem);
      result.current.applyCoupon({ code: "OFF10", discount: 10, type: "percent" });
    });
    expect(result.current.getDiscount()).toBe(Math.round(4199 * 0.1));
  });

  it("calculates correct item count", () => {
    const { result } = renderHook(() => useCartStore());
    act(() => {
      result.current.addItem(mockItem);
      result.current.addItem(mockItem2);
    });
    expect(result.current.itemCount()).toBe(3);
  });

  it("clears the cart completely", () => {
    const { result } = renderHook(() => useCartStore());
    act(() => {
      result.current.addItem(mockItem);
      result.current.addItem(mockItem2);
      result.current.clearCart();
    });
    expect(result.current.items).toHaveLength(0);
    expect(result.current.coupon).toBeNull();
  });
});
