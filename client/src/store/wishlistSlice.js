// Selectors: see store/selectors.js
/** @typedef {import('./types/wishlistTypes').WishlistState} WishlistState */
import { createSlice } from "@reduxjs/toolkit";
import { addToWishlist, fetchWishlist, optimisticToggleWishlist, removeFromWishlist } from "../features/wishlist/wishlistSlice";

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: { items: [] },
  reducers: {
    toggleWishlist(state, action) {
      const product = action.payload;
      const exists = state.items.some((item) => String(item._id) === String(product._id));
      state.items = exists ? state.items.filter((item) => String(item._id) !== String(product._id)) : [...state.items, product];
    },
    clearWishlist(state) {
      state.items = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(optimisticToggleWishlist, (state, action) => {
        const { productId, product } = action.payload;
        const exists = state.items.some((item) => String(item._id) === String(productId));
        if (exists) {
          state.items = state.items.filter((item) => String(item._id) !== String(productId));
        } else {
          state.items.unshift(product || { _id: String(productId) });
        }
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.items = action.payload || [];
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.items = action.payload || [];
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.items = action.payload || [];
      });
  }
});

export const { toggleWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
