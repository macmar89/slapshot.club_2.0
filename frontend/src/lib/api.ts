import axios from 'axios';
import { API_ROUTES } from './api-routes';

interface FailedRequest {
  resolve: (token: string | null) => void;
  reject: (error: any) => void;
}

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
const API_VERSION = '/api/v1';

export const api = axios.create({
  baseURL: `${API_URL}${API_VERSION}`,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const authRoutes = [API_ROUTES.AUTH.LOGIN];

    const isAuthRoute = authRoutes.some((route) => originalRequest.url.includes(route));

    if (isAuthRoute) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (originalRequest.url.includes(API_ROUTES.AUTH.REFRESH)) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await api.post(API_ROUTES.AUTH.REFRESH);
        processQueue(null);
        return api(originalRequest);
      } catch (refreshError: any) {
        processQueue(refreshError, null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);
