import { createSlice } from "@reduxjs/toolkit";

const STORAGE_KEY = "zivvo-theme";

const getInitialDarkMode = () => {
  if (typeof window === "undefined") return true;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) return stored === "dark";
  return window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ?? true;
};

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    darkMode: getInitialDarkMode()
  },
  reducers: {
    setDarkMode: (state, action) => {
      state.darkMode = Boolean(action.payload);
    },
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    }
  }
});

export const { setDarkMode, toggleDarkMode } = uiSlice.actions;
export default uiSlice.reducer;
