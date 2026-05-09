import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_URL, credentials: "include", prepareHeaders: (headers, { getState }) => { const t = getState().auth.accessToken; if (t) headers.set("authorization", `Bearer ${t}`); return headers; } });

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery,
  tagTypes: ["Auth"],
  endpoints: (b) => ({
    login: b.mutation({ query: (d) => ({ url: "/auth/login", method: "POST", body: d }) }),
    register: b.mutation({ query: (d) => ({ url: "/auth/register", method: "POST", body: d }) }),
    me: b.query({ query: () => "/auth/me", providesTags: ["Auth"] })
  })
});
export const { useLoginMutation, useRegisterMutation, useMeQuery } = authApi;
