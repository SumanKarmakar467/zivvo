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
      query: ({ product, page = 1, limit = 10, sort = "recent" }) =>
        `/reviews?product=${product}&page=${page}&limit=${limit}&sort=${sort}`,
      providesTags: (result, error, args) => [{ type: "Review", id: args.product }]
    }),
    createReview: b.mutation({
      query: (body) => ({ url: "/reviews", method: "POST", body }),
      invalidatesTags: (result, error, args) => [
        { type: "Review", id: args.product },
        { type: "Product", id: args.product }
      ]
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
  useCreateReviewMutation,
  useGetFeaturedProductsQuery,
  useGetDealsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation
} = productApi;
