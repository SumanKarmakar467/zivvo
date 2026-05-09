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

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery,
  tagTypes: ["Auth"],
  endpoints: (builder) => ({
    register: builder.mutation({ query: (body) => ({ url: "/auth/register", method: "POST", body }) }),
    login: builder.mutation({ query: (body) => ({ url: "/auth/login", method: "POST", body }) }),
    googleLogin: builder.mutation({ query: (body) => ({ url: "/auth/google", method: "POST", body }) }),
    refresh: builder.mutation({ query: () => ({ url: "/auth/refresh", method: "POST" }) }),
    logoutApi: builder.mutation({ query: () => ({ url: "/auth/logout", method: "POST" }) }),
    forgotPassword: builder.mutation({ query: (body) => ({ url: "/auth/forgot-password", method: "POST", body }) }),
    resetPassword: builder.mutation({ query: (body) => ({ url: "/auth/reset-password", method: "POST", body }) })
  })
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useGoogleLoginMutation,
  useRefreshMutation,
  useLogoutApiMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation
} = authApi;
