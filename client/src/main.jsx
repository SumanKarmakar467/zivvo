import { StrictMode, createContext, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { configureStore, createSlice } from "@reduxjs/toolkit";
import { BrowserRouter } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import "swiper/css";
import "./index.css";
import App from "./App";

export const ThemeContext = createContext(null);

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    theme: "dark"
  },
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
    }
  }
});

const store = configureStore({
  reducer: {
    ui: uiSlice.reducer
  }
});

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("dark");

  const value = useMemo(() => ({ theme, setTheme }), [theme]);

  return (
    <ThemeContext.Provider value={value}>
      <div data-theme={theme} className={theme === "dark" ? "bg-zivvo-dark-bg text-zivvo-text-base" : "bg-zivvo-light-bg text-zivvo-dark-bg"}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <BrowserRouter>
          <AnimatePresence mode="wait" initial={false}>
            <App />
          </AnimatePresence>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  </StrictMode>
);
