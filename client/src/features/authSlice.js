// Selectors: see store/selectors.js
/** @typedef {import('../store/types/authTypes').AuthState} AuthState */
import { createSlice } from "@reduxjs/toolkit";

const initialState = { user: null, accessToken: null, isAuthenticated: false, loading: false };
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
    },
    logout: () => initialState,
    setLoading: (state, action) => { state.loading = action.payload; }
  }
});

export const { setCredentials, logout, setLoading } = authSlice.actions;
export default authSlice.reducer;
