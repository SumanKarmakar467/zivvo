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

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery,
  tagTypes: ["AdminStats", "AdminUsers", "AdminProducts", "AdminOrders", "AdminCategories", "AdminCoupons"],
  endpoints: (builder) => ({
    getDashboardStats: builder.query({ query: () => "/admin/stats", providesTags: ["AdminStats"] }),
    getAllUsers: builder.query({ query: (params) => ({ url: "/admin/users", params }), providesTags: ["AdminUsers"] }),
    updateUser: builder.mutation({ query: ({ id, body }) => ({ url: `/admin/users/${id}`, method: "PUT", body }), invalidatesTags: ["AdminUsers", "AdminStats"] }),
    getAllProducts: builder.query({ query: (params) => ({ url: "/admin/products", params }), providesTags: ["AdminProducts"] }),
    toggleProductActive: builder.mutation({ query: (id) => ({ url: `/admin/products/${id}/toggle`, method: "PUT" }), invalidatesTags: ["AdminProducts", "AdminStats"] }),
    getAllOrders: builder.query({ query: (params) => ({ url: "/admin/orders", params }), providesTags: ["AdminOrders"] }),
    updateOrderStatus: builder.mutation({ query: ({ id, status }) => ({ url: `/admin/orders/${id}/status`, method: "PUT", body: { status } }), invalidatesTags: ["AdminOrders", "AdminStats"] }),
    getCategoriesAdmin: builder.query({ query: () => "/admin/categories", providesTags: ["AdminCategories"] }),
    createCategory: builder.mutation({ query: (body) => ({ url: "/admin/categories", method: "POST", body }), invalidatesTags: ["AdminCategories", "AdminProducts", "AdminStats"] }),
    updateCategory: builder.mutation({ query: ({ id, body }) => ({ url: `/admin/categories/${id}`, method: "PUT", body }), invalidatesTags: ["AdminCategories", "AdminProducts"] }),
    deleteCategory: builder.mutation({ query: (id) => ({ url: `/admin/categories/${id}`, method: "DELETE" }), invalidatesTags: ["AdminCategories", "AdminProducts", "AdminStats"] }),
    getCoupons: builder.query({ query: () => "/admin/coupons", providesTags: ["AdminCoupons"] }),
    createCoupon: builder.mutation({ query: (body) => ({ url: "/admin/coupons", method: "POST", body }), invalidatesTags: ["AdminCoupons"] }),
    updateCoupon: builder.mutation({ query: ({ id, body }) => ({ url: `/admin/coupons/${id}`, method: "PUT", body }), invalidatesTags: ["AdminCoupons"] }),
    deleteCoupon: builder.mutation({ query: (id) => ({ url: `/admin/coupons/${id}`, method: "DELETE" }), invalidatesTags: ["AdminCoupons"] })
  })
});

export const {
  useGetDashboardStatsQuery,
  useGetAllUsersQuery,
  useUpdateUserMutation,
  useGetAllProductsQuery,
  useToggleProductActiveMutation,
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
  useGetCategoriesAdminQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useGetCouponsQuery,
  useCreateCouponMutation,
  useUpdateCouponMutation,
  useDeleteCouponMutation
} = adminApi;
