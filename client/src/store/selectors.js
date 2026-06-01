import { createSelector } from "reselect";

const selectProductsState = (state) => state.products || state.product || {};
export const selectAllProducts = createSelector(selectProductsState, (products) => products.items || products.products || []);
export const selectProductsLoading = createSelector(selectProductsState, (products) => products.loading || products.status === "loading");
export const selectProductById = (id) =>
  createSelector(selectAllProducts, (items) => items.find((product) => String(product._id) === String(id)));

const selectCartState = (state) => state.cart || {};
export const selectCartItems = createSelector(selectCartState, (cart) => cart.items || []);
export const selectCartTotal = createSelector(selectCartState, (cart) => cart.totalAmount ?? cart.total ?? 0);
export const selectCartCount = createSelector(selectCartState, (cart) => cart.totalItems ?? cart.itemCount ?? 0);

const selectAuthState = (state) => state.auth || {};
export const selectCurrentUser = createSelector(selectAuthState, (auth) => auth.user || null);
export const selectIsAuthenticated = createSelector(selectAuthState, (auth) => Boolean(auth.isAuthenticated ?? auth.user));

const selectOrdersState = (state) => state.orders || {};
export const selectAllOrders = createSelector(selectOrdersState, (orders) => orders.items || []);

const selectAddressState = (state) => state.address || {};
export const selectDefaultAddress = createSelector(selectAddressState, (address) => address.defaultAddress || null);

const selectNotificationsState = (state) => state.notifications || {};
export const selectUnreadCount = createSelector(selectNotificationsState, (notifications) => notifications.unreadCount || 0);

const selectSearchState = (state) => state.search || {};
export const selectSearchResults = createSelector(selectSearchState, (search) => search);

const selectWishlistState = (state) => state.wishlist || {};
export const selectWishlistItems = createSelector(selectWishlistState, (wishlist) => wishlist.items || []);
export const selectWishlistCount = createSelector(selectWishlistItems, (items) => items.length);
export const selectIsWishlisted = (id) =>
  createSelector(selectWishlistItems, (items) => items.some((item) => String(item._id || item) === String(id)));
