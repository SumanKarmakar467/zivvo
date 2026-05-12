import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import "swiper/css";
import "./index.css";
import App from "./App";
import { store } from "./store/store";
import { ToastViewport } from "./components/common/Toast";
import { ThemeProvider } from "./context/ThemeContext";
import { SocketProvider } from "./context/SocketContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <SocketProvider>
          <BrowserRouter>
            <AnimatePresence mode="wait" initial={false}>
              <App />
            </AnimatePresence>
            <ToastViewport />
          </BrowserRouter>
        </SocketProvider>
      </ThemeProvider>
    </Provider>
  </StrictMode>
);
