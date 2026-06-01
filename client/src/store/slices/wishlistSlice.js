// Selectors: see store/selectors.js
/** @typedef {import('../types/wishlistTypes').WishlistState} WishlistState */
import { createSlice } from "@reduxjs/toolkit";

const KEY = "zivvo_wishlist_ids";

const load = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
};

const save = (ids) => {
  localStorage.setItem(KEY, JSON.stringify(ids));
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: { items: load() },
  reducers: {
    setWishlist: (state, action) => {
      state.items = action.payload || [];
      save(state.items);
    },
    toggleWishlistItem: (state, action) => {
      const id = String(action.payload);
      const exists = state.items.includes(id);
      state.items = exists ? state.items.filter((x) => x !== id) : [...state.items, id];
      save(state.items);
    }
  }
});

export const { setWishlist, toggleWishlistItem } = wishlistSlice.actions;
export default wishlistSlice.reducer;
