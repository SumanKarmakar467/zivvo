import { configureStore } from "@reduxjs/toolkit";
import auth from "../features/authSlice";
import cart from "../features/cartSlice";
import product from "../features/productSlice";
import order from "../features/orderSlice";
import { authApi } from "../services/authApi";
import { productApi } from "../services/productApi";
import { orderApi } from "../services/orderApi";
import { cartApi } from "../services/cartApi";
import { paymentApi } from "../services/paymentApi";

export const store = configureStore({
  reducer: { auth, cart, product, order, [authApi.reducerPath]: authApi.reducer, [productApi.reducerPath]: productApi.reducer, [orderApi.reducerPath]: orderApi.reducer, [cartApi.reducerPath]: cartApi.reducer, [paymentApi.reducerPath]: paymentApi.reducer },
  middleware: (gDM) => gDM().concat(authApi.middleware, productApi.middleware, orderApi.middleware, cartApi.middleware, paymentApi.middleware)
});
