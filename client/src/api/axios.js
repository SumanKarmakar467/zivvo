import axios from "axios";
import { store } from "../store/store";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  withCredentials: true,
  timeout: 3500
});

const isJwtLike = (token) => typeof token === "string" && token.split(".").length === 3;

api.interceptors.request.use((config) => {
  const token = store.getState()?.auth?.accessToken;
  if (isJwtLike(token)) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
