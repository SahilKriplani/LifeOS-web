import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

// ─── Axios instance ───────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1",
  withCredentials: true, // sends httpOnly cookies automatically
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds — fail fast, don't hang
});

// ─── Request interceptor ──────────────────────────────────────────────────────
// Runs before every request goes out
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // You can attach tokens here later if needed
    // For now we rely on httpOnly cookies (withCredentials: true)
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Sanitize logs — never log passwords
    if (process.env.NODE_ENV === "development") {
      const sanitized = { ...config.data };
      if (sanitized?.password) sanitized.password = "***";
      if (sanitized?.confirmPassword) sanitized.confirmPassword = "***";
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);
// ─── Response interceptor ─────────────────────────────────────────────────────
// Runs on every response before it reaches your component
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Unwrap the data directly so components get clean data
    return response;
  },
  (error: AxiosError) => {
    const status = error.response?.status;

    if (status === 401) {
      // User is not authenticated — redirect to login
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }

    if (status === 403) {
      // User is authenticated but not authorized
      console.error("Access denied");
    }

    if (status === 500) {
      // Server error — log it
      console.error("Server error — please try again later");
    }

    return Promise.reject(error);
  },
);

export default api;
