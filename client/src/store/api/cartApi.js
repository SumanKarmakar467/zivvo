import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.accessToken;
    if (token) headers.set("authorization", `Bearer ${token}`);
    return headers;
  }
});

export const cartApi = createApi({
  reducerPath: "cartApi",
  baseQuery,
  tagTypes: ["Cart"],
  endpoints: (builder) => ({
    getCart: builder.query({ query: () => "/cart", providesTags: ["Cart"] }),
    addToCart: builder.mutation({
      query: (body) => ({ url: "/cart/add", method: "POST", body }),
      invalidatesTags: ["Cart"]
    }),
    updateCartItem: builder.mutation({
      query: ({ itemId, quantity }) => ({ url: `/cart/${itemId}`, method: "PUT", body: { quantity } }),
      invalidatesTags: ["Cart"]
    }),
    removeFromCart: builder.mutation({
      query: (itemId) => ({ url: `/cart/${itemId}`, method: "DELETE" }),
      invalidatesTags: ["Cart"]
    }),
    applyCoupon: builder.mutation({
      query: (code) => ({ url: "/cart/coupon", method: "POST", body: { code } }),
      invalidatesTags: ["Cart"]
    }),
    removeCoupon: builder.mutation({
      query: () => ({ url: "/cart/coupon", method: "DELETE" }),
      invalidatesTags: ["Cart"]
    })
  })
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
  useApplyCouponMutation,
  useRemoveCouponMutation
} = cartApi;
