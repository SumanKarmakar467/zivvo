import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios";

const initialState = {
  addresses: [],
  defaultAddress: null,
  status: "idle",
  error: null
};

export const fetchAddresses = createAsyncThunk("address/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get("/addresses");
    return data;
  } catch (err) {
    return rejectWithValue(err?.response?.data?.message || "Failed to fetch addresses");
  }
});

export const addAddress = createAsyncThunk("address/add", async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post("/addresses", payload);
    return data;
  } catch (err) {
    return rejectWithValue(err?.response?.data?.message || "Failed to add address");
  }
});

export const updateAddress = createAsyncThunk("address/update", async ({ id, data: payload }, { rejectWithValue }) => {
  try {
    const { data } = await api.patch(`/addresses/${id}`, payload);
    return data;
  } catch (err) {
    return rejectWithValue(err?.response?.data?.message || "Failed to update address");
  }
});

export const deleteAddress = createAsyncThunk("address/delete", async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/addresses/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(err?.response?.data?.message || "Failed to delete address");
  }
});

export const setDefaultAddress = createAsyncThunk("address/setDefault", async (id, { rejectWithValue }) => {
  try {
    const { data } = await api.patch(`/addresses/${id}/default`);
    return data;
  } catch (err) {
    return rejectWithValue(err?.response?.data?.message || "Failed to set default address");
  }
});

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAddresses.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.addresses = action.payload.addresses || [];
        state.defaultAddress = action.payload.defaultAddress || state.addresses.find((item) => item.isDefault) || null;
      })
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(addAddress.fulfilled, (state, action) => {
        state.addresses.unshift(action.payload);
        if (action.payload.isDefault) {
          state.addresses = state.addresses.map((item) => ({ ...item, isDefault: item._id === action.payload._id }));
          state.defaultAddress = action.payload;
        }
      })
      .addCase(updateAddress.fulfilled, (state, action) => {
        state.addresses = state.addresses.map((item) => (item._id === action.payload._id ? action.payload : item));
        if (action.payload.isDefault) {
          state.addresses = state.addresses.map((item) => ({ ...item, isDefault: item._id === action.payload._id }));
          state.defaultAddress = action.payload;
        }
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.addresses = state.addresses.filter((item) => item._id !== action.payload);
        state.defaultAddress = state.addresses.find((item) => item.isDefault) || null;
      })
      .addCase(setDefaultAddress.fulfilled, (state, action) => {
        state.addresses = state.addresses.map((item) => ({ ...item, isDefault: item._id === action.payload._id }));
        state.defaultAddress = action.payload;
      });
  }
});

export const selectDefaultAddress = (state) => state.address.defaultAddress;

export default addressSlice.reducer;

