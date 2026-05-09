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

export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery,
  tagTypes: ["Order"],
  endpoints: (b) => ({
    getMyOrders: b.query({
      query: ({ page = 1, limit = 10, status = "" } = {}) => `/orders/my?page=${page}&limit=${limit}&status=${status}`,
      providesTags: ["Order"]
    }),
    getOrderById: b.query({ query: (id) => `/orders/${id}`, providesTags: ["Order"] }),
    cancelOrder: b.mutation({
      query: ({ id, reason }) => ({ url: `/orders/${id}/cancel`, method: "PUT", body: { reason } }),
      invalidatesTags: ["Order"]
    }),
    updateOrderStatus: b.mutation({
      query: ({ id, ...body }) => ({ url: `/orders/${id}/status`, method: "PUT", body }),
      invalidatesTags: ["Order"]
    })
  })
});

export const { useGetMyOrdersQuery, useGetOrderByIdQuery, useCancelOrderMutation, useUpdateOrderStatusMutation } = orderApi;
