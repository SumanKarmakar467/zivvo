import { createSlice } from "@reduxjs/toolkit";
const orderSlice = createSlice({ name: "order", initialState: { orders: [], currentOrder: null }, reducers: { setOrders: (s, a) => { s.orders = a.payload; }, setCurrentOrder: (s, a) => { s.currentOrder = a.payload; } } });
export const { setOrders, setCurrentOrder } = orderSlice.actions;
export default orderSlice.reducer;
