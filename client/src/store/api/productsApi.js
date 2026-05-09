import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_URL }),
  endpoints: (builder) => ({
    getProducts: builder.query({ query: (params) => ({ url: "/products", params }) }),
    getProductBySlug: builder.query({ query: (slug) => `/products/${slug}` }),
    getFeaturedProducts: builder.query({ query: () => "/products/featured" }),
    getCategories: builder.query({ query: () => "/categories" }),
    getProductsByCategory: builder.query({
      query: ({ slug, ...params }) => ({ url: `/products/category/${slug}`, params })
    })
  })
});

export const {
  useGetProductsQuery,
  useGetProductBySlugQuery,
  useGetFeaturedProductsQuery,
  useGetCategoriesQuery,
  useGetProductsByCategoryQuery
} = productsApi;
