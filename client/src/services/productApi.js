import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const baseQuery = fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_URL, credentials: "include" });
export const productApi = createApi({ reducerPath: "productApi", baseQuery, tagTypes: ["Product"], endpoints: (b) => ({
  getProducts: b.query({ query: (params = "") => `/products${params ? `?${params}` : ""}`, providesTags: ["Product"] }),
  getProductById: b.query({ query: (id) => `/products/${id}`, providesTags: ["Product"] }),
  getFeaturedProducts: b.query({ query: () => "/products/featured", providesTags: ["Product"] }),
  getDeals: b.query({ query: () => "/products/deals", providesTags: ["Product"] }),
  createProduct: b.mutation({ query: (body) => ({ url: "/products", method: "POST", body }), invalidatesTags: ["Product"] }),
  updateProduct: b.mutation({ query: ({ id, ...body }) => ({ url: `/products/${id}`, method: "PUT", body }), invalidatesTags: ["Product"] }),
  deleteProduct: b.mutation({ query: (id) => ({ url: `/products/${id}`, method: "DELETE" }), invalidatesTags: ["Product"] })
})});
export const { useGetProductsQuery, useGetProductByIdQuery, useGetFeaturedProductsQuery, useGetDealsQuery, useCreateProductMutation, useUpdateProductMutation, useDeleteProductMutation } = productApi;
