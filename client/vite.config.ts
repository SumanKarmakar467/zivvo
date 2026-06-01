import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: "dist/bundle-stats.html",
      open: false,
      gzipSize: true,
      brotliSize: true
    })
  ],
  assetsInclude: ["**/*.avif", "**/*.webp", "**/*.png", "**/*.jpg", "**/*.jpeg", "**/*.svg"],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  },
  server: {
    port: 5173,
    open: true,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false
      },
      "/socket.io": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
        ws: true
      }
    }
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    css: true
  },
  build: {
    assetsInlineLimit: 4096,
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          "vendor-redux": ["@reduxjs/toolkit", "react-redux", "redux-persist"],
          "vendor-firebase": ["firebase/app", "firebase/auth"],
          "vendor-framer": ["framer-motion"],
          "vendor-swiper": ["swiper"]
        }
      }
    }
  }
});
