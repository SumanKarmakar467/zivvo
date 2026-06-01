// Selectors: see store/selectors.js
/** @typedef {import('../store/types/cartTypes').CartState} CartState */
import { createSlice } from "@reduxjs/toolkit";
const initialState = { items: [], totalItems: 0, totalPrice: 0, coupon: null };
const calc = (s) => {
  s.totalItems = s.items.reduce((a, b) => a + b.quantity, 0);
  s.totalPrice = s.items.reduce((a, b) => a + b.quantity * b.price, 0);
};
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (s, a) => { const f = s.items.find((i) => i.product === a.payload.product && i.variant === a.payload.variant); if (f) f.quantity += a.payload.quantity || 1; else s.items.push(a.payload); calc(s); },
    removeItem: (s, a) => { s.items = s.items.filter((i) => i.product !== a.payload); calc(s); },
    updateQuantity: (s, a) => { const f = s.items.find((i) => i.product === a.payload.product); if (f) f.quantity = a.payload.quantity; calc(s); },
    clearCart: () => initialState,
    syncWithServer: (s, a) => ({ ...s, ...a.payload })
  }
});
export const { addItem, removeItem, updateQuantity, clearCart, syncWithServer } = cartSlice.actions;
export default cartSlice.reducer;
