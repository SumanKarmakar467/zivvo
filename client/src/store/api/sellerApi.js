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

export const sellerApi = createApi({
  reducerPath: "sellerApi",
  baseQuery,
  tagTypes: ["SellerStats", "SellerProducts", "SellerOrders"],
  endpoints: (builder) => ({
    getSellerStats: builder.query({
      query: () => "/seller/stats",
      providesTags: ["SellerStats"]
    }),
    getSellerProducts: builder.query({
      query: (params) => ({ url: "/seller/products", params }),
      providesTags: ["SellerProducts"]
    }),
    addSellerProduct: builder.mutation({
      query: (formData) => ({ url: "/seller/products", method: "POST", body: formData }),
      invalidatesTags: ["SellerProducts", "SellerStats"]
    }),
    updateSellerProduct: builder.mutation({
      query: ({ id, formData }) => ({ url: `/seller/products/${id}`, method: "PUT", body: formData }),
      invalidatesTags: ["SellerProducts", "SellerStats"]
    }),
    deleteSellerProduct: builder.mutation({
      query: (id) => ({ url: `/seller/products/${id}`, method: "DELETE" }),
      invalidatesTags: ["SellerProducts", "SellerStats"]
    }),
    getSellerOrders: builder.query({
      query: (params) => ({ url: "/seller/orders", params }),
      providesTags: ["SellerOrders"]
    })
  })
});

export const {
  useGetSellerStatsQuery,
  useGetSellerProductsQuery,
  useAddSellerProductMutation,
  useUpdateSellerProductMutation,
  useDeleteSellerProductMutation,
  useGetSellerOrdersQuery
} = sellerApi;
