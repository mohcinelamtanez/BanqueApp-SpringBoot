import axios from "axios";
import { getUser, setUser } from "../auth/authStore";

export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// Attaches the JWT issued at login to every request that needs it.
httpClient.interceptors.request.use((config) => {
  const token = getUser()?.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// An expired/invalid token clears the session — App.jsx reactively falls
// back to AuthRoutes as soon as authStore notifies of the change, no manual
// redirect needed here.
httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && getUser()) {
      setUser(null);
    }
    return Promise.reject(error);
  },
);
