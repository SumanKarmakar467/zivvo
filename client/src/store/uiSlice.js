import { createSlice } from "@reduxjs/toolkit";

const saved = localStorage.getItem("zivvo-theme");

const uiSlice = createSlice({
  name: "ui",
  initialState: { darkMode: saved === "dark" },
  reducers: {
    toggleDarkMode(state) {
      state.darkMode = !state.darkMode;
      localStorage.setItem("zivvo-theme", state.darkMode ? "dark" : "light");
    }
  }
});

export const { toggleDarkMode } = uiSlice.actions;
export default uiSlice.reducer;
