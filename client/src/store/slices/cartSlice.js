import { createSlice } from "@reduxjs/toolkit";

const STORAGE_KEY = "zivvo_guest_cart";

const initialState = {
  items: [],
  subtotal: 0,
  shipping: 0,
  couponDiscount: 0,
  total: 0,
  couponCode: "",
  itemCount: 0,
  loading: false
};

const withComputed = (payload = {}) => {
  const items = payload.items || [];
  const itemCount = items.reduce((sum, item) => sum + Number(item.quantity || 0), 0);

  return {
    ...initialState,
    ...payload,
    items,
    itemCount
  };
};

const saveGuestCart = (cart) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
};

const loadGuestCart = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (!parsed) return withComputed();
    return withComputed(parsed);
  } catch {
    return withComputed();
  }
};

const authHeaders = (getState) => {
  const token = getState().auth.accessToken;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const apiCall = async (path, method, body, getState) => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}${path}`, {
    method,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(getState)
    },
    body: body ? JSON.stringify(body) : undefined
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message || "Cart request failed");
  }
  return data;
};

const guestTotals = (items, couponCode = "") => {
  const subtotal = items.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0);
  const shipping = subtotal > 499 ? 0 : subtotal > 0 ? 40 : 0;
  const couponDiscount = 0;
  const total = Math.max(0, subtotal - couponDiscount + shipping);
  return withComputed({ items, subtotal, shipping, couponDiscount, total, couponCode });
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart: (state, action) => withComputed(action.payload),
    clearCart: () => {
      localStorage.removeItem(STORAGE_KEY);
      return withComputed();
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    }
  }
});

export const { setCart, clearCart, setLoading } = cartSlice.actions;

export const fetchCart = () => async (dispatch, getState) => {
  dispatch(setLoading(true));
  try {
    const isAuthenticated = getState().auth.isAuthenticated;
    if (!isAuthenticated) {
      const guest = loadGuestCart();
      dispatch(setCart(guest));
      return;
    }

    const data = await apiCall("/cart", "GET", null, getState);
    dispatch(setCart(data));
  } finally {
    dispatch(setLoading(false));
  }
};

export const addToCart = ({ productId, quantity = 1, productData }) => async (dispatch, getState) => {
  dispatch(setLoading(true));
  try {
    const isAuthenticated = getState().auth.isAuthenticated;
    if (!isAuthenticated) {
      const guest = loadGuestCart();
      const items = [...guest.items];
      const found = items.find((item) => String(item.product?._id || item.product) === String(productId));
      if (found) {
        found.quantity += quantity;
      } else {
        items.push({
          _id: `guest-${Date.now()}`,
          product: productData,
          quantity,
          price: Number(productData?.price || 0)
        });
      }
      const next = guestTotals(items);
      saveGuestCart(next);
      dispatch(setCart(next));
      return;
    }

    const data = await apiCall("/cart/add", "POST", { productId, quantity }, getState);
    dispatch(setCart(data));
  } finally {
    dispatch(setLoading(false));
  }
};

export const updateCartItem = ({ itemId, quantity }) => async (dispatch, getState) => {
  dispatch(setLoading(true));
  try {
    const isAuthenticated = getState().auth.isAuthenticated;
    if (!isAuthenticated) {
      const guest = loadGuestCart();
      const items = guest.items
        .map((item) => (String(item._id) === String(itemId) ? { ...item, quantity } : item))
        .filter((item) => Number(item.quantity) > 0);
      const next = guestTotals(items, guest.couponCode);
      saveGuestCart(next);
      dispatch(setCart(next));
      return;
    }

    const data = await apiCall(`/cart/${itemId}`, "PUT", { quantity }, getState);
    dispatch(setCart(data));
  } finally {
    dispatch(setLoading(false));
  }
};

export const removeFromCart = (itemId) => async (dispatch, getState) => {
  dispatch(setLoading(true));
  try {
    const isAuthenticated = getState().auth.isAuthenticated;
    if (!isAuthenticated) {
      const guest = loadGuestCart();
      const items = guest.items.filter((item) => String(item._id) !== String(itemId));
      const next = guestTotals(items, guest.couponCode);
      saveGuestCart(next);
      dispatch(setCart(next));
      return;
    }

    const data = await apiCall(`/cart/${itemId}`, "DELETE", null, getState);
    dispatch(setCart(data));
  } finally {
    dispatch(setLoading(false));
  }
};

export const applyCoupon = (code) => async (dispatch, getState) => {
  dispatch(setLoading(true));
  try {
    if (!getState().auth.isAuthenticated) {
      throw new Error("Login required to apply coupon");
    }
    const data = await apiCall("/cart/coupon", "POST", { code }, getState);
    dispatch(setCart(data));
  } finally {
    dispatch(setLoading(false));
  }
};

export const removeCoupon = () => async (dispatch, getState) => {
  dispatch(setLoading(true));
  try {
    const isAuthenticated = getState().auth.isAuthenticated;
    if (!isAuthenticated) {
      const guest = loadGuestCart();
      const next = guestTotals(guest.items, "");
      saveGuestCart(next);
      dispatch(setCart(next));
      return;
    }

    const data = await apiCall("/cart/coupon", "DELETE", null, getState);
    dispatch(setCart(data));
  } finally {
    dispatch(setLoading(false));
  }
};

export const selectCartItemCount = (state) => state.cart.itemCount;

export default cartSlice.reducer;
