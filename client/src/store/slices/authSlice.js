import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  accessToken: null,
  loading: true,
  isAuthenticated: false
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user || null;
      state.accessToken = action.payload.accessToken || null;
      state.isAuthenticated = Boolean(action.payload.accessToken);
      state.loading = false;
      if (action.payload.accessToken) localStorage.setItem("zivvo-token", action.payload.accessToken);
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.loading = false;
      state.isAuthenticated = false;
      localStorage.removeItem("zivvo-token");
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    }
  }
});

export const { setCredentials, logout, setLoading } = authSlice.actions;
export default authSlice.reducer;
