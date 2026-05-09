import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const baseQuery = fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_URL, credentials: "include" });
export const paymentApi = createApi({ reducerPath: "paymentApi", baseQuery, endpoints: (b) => ({
  createRazorpayOrder: b.mutation({ query: (body) => ({ url: "/payment/create-order", method: "POST", body }) }),
  verifyPayment: b.mutation({ query: (body) => ({ url: "/payment/verify", method: "POST", body }) })
})});
export const { useCreateRazorpayOrderMutation, useVerifyPaymentMutation } = paymentApi;
