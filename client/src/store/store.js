import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import auth from "./slices/authSlice";
import cart from "./slices/cartSlice";
import uiReducer from "./uiSlice";
import wishlistReducer from "./wishlistSlice";
import product from "../features/productSlice";
import order from "../features/orderSlice";
import search from "../features/search/searchSlice";
import orders from "../features/orders/ordersSlice";
import analytics from "../features/analytics/analyticsSlice";
import notifications from "../features/notifications/notificationsSlice";
import address from "../features/address/addressSlice";
import { authApi } from "../services/authApi";
import { productApi } from "../services/productApi";
import { orderApi } from "../services/orderApi";
import { cartApi } from "./api/cartApi";
import { paymentApi } from "../services/paymentApi";
import { productsApi } from "./api/productsApi";
import { sellerApi } from "./api/sellerApi";
import { adminApi } from "./api/adminApi";

const cartPersistConfig = {
  key: "cart",
  storage,
  whitelist: ["items", "totalAmount", "totalItems", "total", "itemCount", "subtotal", "shipping", "couponDiscount"]
};

const rootReducer = combineReducers({
  auth,
  cart: persistReducer(cartPersistConfig, cart),
  ui: uiReducer,
  product,
  order,
  wishlist: wishlistReducer,
  search,
  orders,
  analytics,
  notifications,
  address,
  [authApi.reducerPath]: authApi.reducer,
  [productApi.reducerPath]: productApi.reducer,
  [orderApi.reducerPath]: orderApi.reducer,
  [cartApi.reducerPath]: cartApi.reducer,
  [paymentApi.reducerPath]: paymentApi.reducer,
  [productsApi.reducerPath]: productsApi.reducer,
  [sellerApi.reducerPath]: sellerApi.reducer,
  [adminApi.reducerPath]: adminApi.reducer
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (gDM) =>
    gDM({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    }).concat(
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

export const persistor = persistStore(store);
