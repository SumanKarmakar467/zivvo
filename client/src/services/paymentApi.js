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

export const paymentApi = createApi({
  reducerPath: "paymentApi",
  baseQuery,
  endpoints: (b) => ({
    createRazorpayOrder: b.mutation({ query: (body) => ({ url: "/payment/create-order", method: "POST", body }) }),
    verifyPayment: b.mutation({ query: (body) => ({ url: "/payment/verify", method: "POST", body }) })
  })
});

export const { useCreateRazorpayOrderMutation, useVerifyPaymentMutation } = paymentApi;
