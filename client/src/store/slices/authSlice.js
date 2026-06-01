// Selectors: see store/selectors.js
/** @typedef {import('../types/authTypes').AuthState} AuthState */
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  accessToken: null,
  loading: true,
  isAuthenticated: false,
  isDemoSession: false
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user || null;
      state.accessToken = action.payload.accessToken || null;
      state.isDemoSession = Boolean(action.payload.isDemoSession);
      state.isAuthenticated = Boolean(state.user && (state.accessToken || state.isDemoSession));
      state.loading = false;
      if (action.payload.accessToken) localStorage.setItem("zivvo-token", action.payload.accessToken);
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.loading = false;
      state.isAuthenticated = false;
      state.isDemoSession = false;
      localStorage.removeItem("zivvo-token");
      localStorage.removeItem("zivvo-demo-user");
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    }
  }
});

export const { setCredentials, logout, setLoading } = authSlice.actions;
export default authSlice.reducer;
