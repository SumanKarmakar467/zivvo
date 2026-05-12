import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.accessToken;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  }
});

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery,
  tagTypes: ["Product", "Review"],
  endpoints: (b) => ({
    getProducts: b.query({
      query: (params = "") => `/products${params ? `?${params}` : ""}`,
      providesTags: ["Product"]
    }),
    getProductBySlug: b.query({
      query: (slug) => `/products/${slug}`,
      providesTags: (result) =>
        result?.product?._id
          ? [{ type: "Product", id: result.product._id }]
          : ["Product"]
    }),
    getReviews: b.query({
      query: ({ product, page = 1, limit = 10, sort = "most_recent" }) =>
        `/reviews/product/${product}?page=${page}&limit=${limit}&sort=${sort}`,
      providesTags: (result, error, args) => [{ type: "Review", id: args.product }]
    }),
    getReviewEligibility: b.query({
      query: (productId) => `/reviews/eligibility/${productId}`,
      providesTags: (result, error, productId) => [{ type: "Review", id: productId }]
    }),
    createReview: b.mutation({
      query: (body) => ({ url: "/reviews", method: "POST", body }),
      invalidatesTags: (result, error, args) => [
        { type: "Review", id: args.product },
        { type: "Product", id: args.product }
      ]
    }),
    updateReview: b.mutation({
      query: ({ id, body }) => ({ url: `/reviews/${id}`, method: "PATCH", body }),
      invalidatesTags: (result) => [
        { type: "Review", id: result?.product },
        { type: "Product", id: result?.product }
      ]
    }),
    deleteReview: b.mutation({
      query: ({ id }) => ({ url: `/reviews/${id}`, method: "DELETE" }),
      invalidatesTags: ["Review", "Product"]
    }),
    markReviewHelpful: b.mutation({
      query: (id) => ({ url: `/reviews/${id}/helpful`, method: "POST" }),
      invalidatesTags: (result) => [{ type: "Review", id: result?.product }]
    }),
    respondToReview: b.mutation({
      query: ({ id, text }) => ({ url: `/reviews/${id}/respond`, method: "POST", body: { text } }),
      invalidatesTags: (result) => [{ type: "Review", id: result?.product }]
    }),
    getFeaturedProducts: b.query({ query: () => "/products/featured", providesTags: ["Product"] }),
    getDeals: b.query({ query: () => "/products/deals", providesTags: ["Product"] }),
    createProduct: b.mutation({ query: (body) => ({ url: "/products", method: "POST", body }), invalidatesTags: ["Product"] }),
    updateProduct: b.mutation({ query: ({ id, ...body }) => ({ url: `/products/${id}`, method: "PUT", body }), invalidatesTags: ["Product"] }),
    deleteProduct: b.mutation({ query: (id) => ({ url: `/products/${id}`, method: "DELETE" }), invalidatesTags: ["Product"] })
  })
});

export const {
  useGetProductsQuery,
  useGetProductBySlugQuery,
  useGetReviewsQuery,
  useGetReviewEligibilityQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
  useMarkReviewHelpfulMutation,
  useRespondToReviewMutation,
  useGetFeaturedProductsQuery,
  useGetDealsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation
} = productApi;
