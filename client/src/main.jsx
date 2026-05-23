import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Toaster } from "react-hot-toast";
import "swiper/css";
import "./index.css";
import App from "./App";
import { store } from "./store/store";
import { ToastViewport } from "./components/common/Toast";
import { ThemeProvider } from "./context/ThemeContext";
import { SocketProvider } from "./context/SocketContext";
import ErrorBoundary from "./components/ui/ErrorBoundary";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <SocketProvider>
          <BrowserRouter>
            <ErrorBoundary>
              <AnimatePresence mode="wait" initial={false}>
                <App />
              </AnimatePresence>
            </ErrorBoundary>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: "var(--bg2)",
                  color: "var(--cream)",
                  border: "0.5px solid var(--border)",
                  borderRadius: "12px",
                  fontSize: "13px",
                  fontFamily: "var(--font-body)",
                  padding: "12px 16px"
                },
                success: {
                  iconTheme: { primary: "#1D9E75", secondary: "#0C0F1A" }
                },
                error: {
                  iconTheme: { primary: "#F43F5E", secondary: "#0C0F1A" }
                }
              }}
            />
            <ToastViewport />
          </BrowserRouter>
        </SocketProvider>
      </ThemeProvider>
    </Provider>
  </StrictMode>
);
