import { configureStore } from "@reduxjs/toolkit";
import auth from "./slices/authSlice";
import cart from "./slices/cartSlice";
import product from "../features/productSlice";
import order from "../features/orderSlice";
import wishlist from "../features/wishlist/wishlistSlice";
import search from "../features/search/searchSlice";
import orders from "../features/orders/ordersSlice";
import analytics from "../features/analytics/analyticsSlice";
import notifications from "../features/notifications/notificationsSlice";
import { authApi } from "../services/authApi";
import { productApi } from "../services/productApi";
import { orderApi } from "../services/orderApi";
import { cartApi } from "./api/cartApi";
import { paymentApi } from "../services/paymentApi";
import { productsApi } from "./api/productsApi";
import { sellerApi } from "./api/sellerApi";
import { adminApi } from "./api/adminApi";

export const store = configureStore({
  reducer: {
    auth,
    cart,
    product,
    order,
    wishlist,
    search,
    orders,
    analytics,
    notifications,
    [authApi.reducerPath]: authApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    [cartApi.reducerPath]: cartApi.reducer,
    [paymentApi.reducerPath]: paymentApi.reducer,
    [productsApi.reducerPath]: productsApi.reducer,
    [sellerApi.reducerPath]: sellerApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer
  },
  middleware: (gDM) =>
    gDM().concat(
      authApi.middleware,
      productApi.middleware,
      orderApi.middleware,
      cartApi.middleware,
      paymentApi.middleware,
      productsApi.middleware,
      sellerApi.middleware,
      adminApi.middleware
    )
});
