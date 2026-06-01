// Selectors: see store/selectors.js
/** @typedef {import('../../store/types/ordersTypes').OrdersState} OrdersState */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios";

export const updateOrderStatus = createAsyncThunk(
  "orders/updateStatus",
  async ({ orderId, status, note, awbNumber, courierName, estimatedDelivery }, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/orders/${orderId}/status`, { status, note, awbNumber, courierName, estimatedDelivery });
      return res.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || "Failed to update order status");
    }
  }
);

const ordersSlice = createSlice({
  name: "orders",
  initialState: { status: "idle", error: null, lastUpdatedOrder: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateOrderStatus.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.lastUpdatedOrder = action.payload;
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to update order status";
      });
  }
});

export default ordersSlice.reducer;
