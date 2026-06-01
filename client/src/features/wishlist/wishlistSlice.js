// Selectors: see store/selectors.js
/** @typedef {import('../../store/types/wishlistTypes').WishlistState} WishlistState */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const isJwtLike = (token) => typeof token === "string" && token.split(".").length === 3;

const authHeaders = (getState) => {
  const token = getState().auth.accessToken;
  return isJwtLike(token) ? { Authorization: `Bearer ${token}` } : {};
};

const wishlistRequest = async ({ path = "", method = "GET", getState }) => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/wishlist${path}`, {
    method,
    credentials: "include",
    headers: authHeaders(getState)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Wishlist request failed");
  return data.items || [];
};

export const fetchWishlist = createAsyncThunk("wishlist/fetchWishlist", async (_, { getState }) => {
  return wishlistRequest({ getState });
});

export const addToWishlist = createAsyncThunk("wishlist/addToWishlist", async (productId, { getState }) => {
  return wishlistRequest({ path: `/${productId}`, method: "POST", getState });
});

export const removeFromWishlist = createAsyncThunk("wishlist/removeFromWishlist", async (productId, { getState }) => {
  return wishlistRequest({ path: `/${productId}`, method: "DELETE", getState });
});

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: { items: [], status: "idle" },
  reducers: {
    optimisticToggleWishlist: (state, action) => {
      const { productId, product } = action.payload;
      const exists = state.items.some((item) => String(item._id) === String(productId));
      if (exists) {
        state.items = state.items.filter((item) => String(item._id) !== String(productId));
      } else if (product) {
        state.items.unshift(product);
      } else {
        state.items.unshift({ _id: String(productId) });
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      });
  }
});

export const { optimisticToggleWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
