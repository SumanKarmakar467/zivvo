import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const baseQuery = fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_URL, credentials: "include" });
export const orderApi = createApi({ reducerPath: "orderApi", baseQuery, tagTypes: ["Order"], endpoints: (b) => ({
  createOrder: b.mutation({ query: (body) => ({ url: "/orders", method: "POST", body }), invalidatesTags: ["Order"] }),
  getMyOrders: b.query({ query: () => "/orders/my", providesTags: ["Order"] }),
  getOrderById: b.query({ query: (id) => `/orders/${id}`, providesTags: ["Order"] }),
  trackOrder: b.query({ query: (id) => `/orders/${id}/track`, providesTags: ["Order"] }),
  cancelOrder: b.mutation({ query: (id) => ({ url: `/orders/${id}/cancel`, method: "PATCH" }), invalidatesTags: ["Order"] })
})});
export const { useCreateOrderMutation, useGetMyOrdersQuery, useGetOrderByIdQuery, useTrackOrderQuery, useCancelOrderMutation } = orderApi;
