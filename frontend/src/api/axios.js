import axios from "axios";
import useAuthStore from "../app/authStore";

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});


api.interceptors.request.use(
  (config) => {
    const { token } = useAuthStore.getState();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || "";

    const isAuthRoute =
      url.includes("/user/login") || url.includes("/companies/register");

    if (status === 401 && !isAuthRoute) {
      const { logout } = useAuthStore.getState();
      logout();

      // SPA-safe redirect
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
