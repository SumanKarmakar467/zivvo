// Selectors: see store/selectors.js
/** @typedef {import('../../store/types/searchTypes').SearchState} SearchState */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchSearchResults = createAsyncThunk(
  "search/fetchSearchResults",
  async (params, { rejectWithValue }) => {
    try {
      const query = new URLSearchParams();
      Object.entries(params || {}).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          query.set(key, String(value));
        }
      });

      const res = await fetch(`${import.meta.env.VITE_API_URL}/products/search?${query.toString()}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || "Failed to fetch search results");
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch search results");
    }
  }
);

const searchSlice = createSlice({
  name: "search",
  initialState: {
    results: [],
    total: 0,
    pages: 0,
    currentPage: 1,
    status: "idle",
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSearchResults.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchSearchResults.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.results = action.payload.products || [];
        state.total = action.payload.total || 0;
        state.pages = action.payload.pages || 0;
        state.currentPage = action.payload.page || 1;
      })
      .addCase(fetchSearchResults.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      });
  }
});

export default searchSlice.reducer;
