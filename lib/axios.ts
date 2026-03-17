import axios from "axios";
import type { AxiosError } from "axios";
import { toast } from "sonner";

import useAuthStore from "@/store/authStore";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
let isHandlingUnauthorized = false;

const axiosInstance = axios.create({
  baseURL: baseURL ?? "",
   headers: {
    'Content-Type': 'application/json',
  },
});


axiosInstance.interceptors.request.use(
  (config) => {
    const authState = useAuthStore.getState();
    const token = authState ? authState.accessToken : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status;
    const requestUrl = (error.config?.url ?? "").toLowerCase();
    const isAuthRequest =
      requestUrl.includes("/api/auth/login") ||
      requestUrl.includes("/api/auth/data-collector/login") ||
      requestUrl.includes("/api/users/register");

    if (status === 401 && !isAuthRequest && !isHandlingUnauthorized) {
      isHandlingUnauthorized = true;

      const { logOut } = useAuthStore.getState();
      logOut();

      if (typeof window !== "undefined") {
        toast.error("Session expired. Please sign in again.");

        if (!window.location.pathname.startsWith("/auth")) {
          window.location.assign("/auth");
        }
      }

      setTimeout(() => {
        isHandlingUnauthorized = false;
      }, 1000);
    }

    return Promise.reject(error);
  }
);

export {
  axiosInstance
}
