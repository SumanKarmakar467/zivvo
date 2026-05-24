import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../api/axios";

const CartContext = createContext(null);
const STORAGE_KEY = "zivvo_cart";

const readGuestCart = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
};

export function CartProvider({ children }) {
  const [items, setItems] = useState(readGuestCart);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = async (product, options = {}) => {
    const size = options.size || "N/A";
    setItems((current) => {
      const existing = current.find((item) => item.id === product.id && item.size === size);
      if (existing) {
        return current.map((item) => item === existing ? { ...item, quantity: item.quantity + (options.quantity || 1) } : item);
      }
      return [...current, { ...product, size, quantity: options.quantity || 1, addedAt: new Date().toISOString() }];
    });

    try {
      await api.post("/cart/add", { productId: product.id, quantity: options.quantity || 1, size });
    } catch {
      // Guest carts intentionally stay local when the API cannot persist DummyJSON items.
    }
  };

  const updateQty = (id, size, quantity) => {
    setItems((current) =>
      current
        .map((item) => item.id === id && item.size === size ? { ...item, quantity: Math.max(1, quantity) } : item)
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = async (id, size) => {
    setItems((current) => current.filter((item) => !(item.id === id && item.size === size)));
    try {
      await api.delete(`/cart/remove/${id}`);
    } catch {
      // Local cart is still the source of truth for guests.
    }
  };

  const clearCart = () => setItems([]);

  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discount = 0;
    const delivery = subtotal > 100 ? 0 : subtotal ? 8 : 0;
    return { subtotal, discount, delivery, total: subtotal - discount + delivery };
  }, [items]);

  const value = useMemo(() => ({ items, count: items.reduce((sum, item) => sum + item.quantity, 0), totals, addItem, updateQty, removeItem, clearCart, setItems }), [items, totals]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCartContext must be used inside CartProvider");
  return context;
};
