import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_URL }),
  endpoints: (builder) => ({
    getProducts: builder.query({ query: (params) => ({ url: "/products", params }) }),
    getProductBySlug: builder.query({ query: (slug) => `/products/${slug}` }),
    getFeaturedProducts: builder.query({ query: () => "/products/featured" }),
    getRecommendations: builder.query({
      query: ({ productId, category, sellerId, limit = 8 }) => ({
        url: "/products/recommendations",
        params: { productId, category, sellerId, limit }
      })
    }),
    getRecentlyViewedProducts: builder.query({
      query: (ids) => ({
        url: "/products/recently-viewed",
        params: { ids: Array.isArray(ids) ? ids.join(",") : ids }
      })
    }),
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
  useGetRecommendationsQuery,
  useGetRecentlyViewedProductsQuery,
  useGetCategoriesQuery,
  useGetProductsByCategoryQuery
} = productsApi;
