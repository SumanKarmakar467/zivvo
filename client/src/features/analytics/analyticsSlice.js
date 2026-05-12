import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios";

const initialState = {
  overview: null,
  revenueChart: null,
  topProducts: [],
  orderFunnel: [],
  lowStock: [],
  status: "idle",
  error: null
};

const withError = (err) => err?.response?.data?.message || err?.message || "Request failed";

export const fetchOverview = createAsyncThunk("analytics/fetchOverview", async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get("/analytics/overview");
    return data;
  } catch (error) {
    return rejectWithValue(withError(error));
  }
});

export const fetchRevenueChart = createAsyncThunk("analytics/fetchRevenueChart", async (period, { rejectWithValue }) => {
  try {
    const { data } = await api.get("/analytics/revenue-chart", { params: { period } });
    return data;
  } catch (error) {
    return rejectWithValue(withError(error));
  }
});

export const fetchTopProducts = createAsyncThunk("analytics/fetchTopProducts", async (by, { rejectWithValue }) => {
  try {
    const { data } = await api.get("/analytics/top-products", { params: { by } });
    return data;
  } catch (error) {
    return rejectWithValue(withError(error));
  }
});

export const fetchOrderFunnel = createAsyncThunk("analytics/fetchOrderFunnel", async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get("/analytics/order-funnel");
    return data;
  } catch (error) {
    return rejectWithValue(withError(error));
  }
});

export const fetchLowStock = createAsyncThunk("analytics/fetchLowStock", async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get("/analytics/low-stock");
    return data;
  } catch (error) {
    return rejectWithValue(withError(error));
  }
});

const analyticsSlice = createSlice({
  name: "analytics",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOverview.pending, (state) => { state.status = "loading"; state.error = null; })
      .addCase(fetchOverview.fulfilled, (state, action) => { state.status = "succeeded"; state.overview = action.payload; })
      .addCase(fetchOverview.rejected, (state, action) => { state.status = "failed"; state.error = action.payload; })
      .addCase(fetchRevenueChart.pending, (state) => { state.status = "loading"; state.error = null; })
      .addCase(fetchRevenueChart.fulfilled, (state, action) => { state.status = "succeeded"; state.revenueChart = action.payload; })
      .addCase(fetchRevenueChart.rejected, (state, action) => { state.status = "failed"; state.error = action.payload; })
      .addCase(fetchTopProducts.pending, (state) => { state.status = "loading"; state.error = null; })
      .addCase(fetchTopProducts.fulfilled, (state, action) => { state.status = "succeeded"; state.topProducts = action.payload; })
      .addCase(fetchTopProducts.rejected, (state, action) => { state.status = "failed"; state.error = action.payload; })
      .addCase(fetchOrderFunnel.pending, (state) => { state.status = "loading"; state.error = null; })
      .addCase(fetchOrderFunnel.fulfilled, (state, action) => { state.status = "succeeded"; state.orderFunnel = action.payload; })
      .addCase(fetchOrderFunnel.rejected, (state, action) => { state.status = "failed"; state.error = action.payload; })
      .addCase(fetchLowStock.pending, (state) => { state.status = "loading"; state.error = null; })
      .addCase(fetchLowStock.fulfilled, (state, action) => { state.status = "succeeded"; state.lowStock = action.payload; })
      .addCase(fetchLowStock.rejected, (state, action) => { state.status = "failed"; state.error = action.payload; });
  }
});

export default analyticsSlice.reducer;
