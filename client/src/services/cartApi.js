import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const baseQuery = fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_URL, credentials: "include" });
export const cartApi = createApi({ reducerPath: "cartApi", baseQuery, tagTypes: ["Cart"], endpoints: (b) => ({
  getCart: b.query({ query: () => "/cart", providesTags: ["Cart"] }),
  addToCart: b.mutation({ query: (body) => ({ url: "/cart/add", method: "POST", body }), invalidatesTags: ["Cart"] }),
  updateCartItem: b.mutation({ query: ({ itemId, ...body }) => ({ url: `/cart/${itemId}`, method: "PATCH", body }), invalidatesTags: ["Cart"] }),
  removeFromCart: b.mutation({ query: (itemId) => ({ url: `/cart/${itemId}`, method: "DELETE" }), invalidatesTags: ["Cart"] }),
  clearCart: b.mutation({ query: () => ({ url: "/cart/clear", method: "DELETE" }), invalidatesTags: ["Cart"] }),
  applyCoupon: b.mutation({ query: (code) => ({ url: "/cart/apply-coupon", method: "POST", body: { code } }), invalidatesTags: ["Cart"] })
})});
export const { useGetCartQuery, useAddToCartMutation, useUpdateCartItemMutation, useRemoveFromCartMutation, useClearCartMutation, useApplyCouponMutation } = cartApi;
