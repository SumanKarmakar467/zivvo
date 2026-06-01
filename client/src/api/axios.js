import axios from "axios";
import { getAuth } from "firebase/auth";
import { store } from "../store/store";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || "/api",
  withCredentials: true,
  timeout: 3500
});

const isJwtLike = (token) => typeof token === "string" && token.split(".").length === 3;

api.interceptors.request.use(async (config) => {
  const firebaseUser = getAuth().currentUser;
  if (firebaseUser) {
    const token = await firebaseUser.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  }

  const token = store.getState()?.auth?.accessToken;
  if (isJwtLike(token)) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.error("Auth error:", error.response.data?.error || error.response.data?.message);
    }
    return Promise.reject(error);
  }
);

export default api;
