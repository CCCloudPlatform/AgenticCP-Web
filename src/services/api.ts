import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { API_BASE_URL, API_TIMEOUT, STORAGE_KEYS } from '@/constants';
import { storage } from '@/utils/storage';
import { ErrorResponse } from '@/types';

/**
 * Axios instance configuration
 */
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 🔧 개발 모드에서 CORS 및 연결 설정
if (import.meta.env.DEV) {
  console.log('🔧 개발 모드: API 설정', {
    baseURL: API_BASE_URL,
    timeout: API_TIMEOUT,
  });
}

/**
 * Request interceptor
 */
api.interceptors.request.use(
  (config) => {
    const token = storage.get<string>(STORAGE_KEYS.TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor
 */
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError<ErrorResponse>) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // API 에러 처리

    // Handle 401 Unauthorized - Token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = storage.get<string>(STORAGE_KEYS.REFRESH_TOKEN);
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/api/v1/auth/refresh`, {
            refreshToken,
          });

          const { token } = response.data;
          storage.set(STORAGE_KEYS.TOKEN, token);

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }

          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh token failed, redirect to login
        storage.remove(STORAGE_KEYS.TOKEN);
        storage.remove(STORAGE_KEYS.REFRESH_TOKEN);
        storage.remove(STORAGE_KEYS.USER_INFO);
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

/**
 * API request wrapper
 */
export const apiRequest = {
  get: <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    return api.get<T>(url, config).then((response) => response.data);
  },

  post: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
    return api.post<T>(url, data, config).then((response) => response.data);
  },

  put: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
    return api.put<T>(url, data, config).then((response) => response.data);
  },

  patch: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
    return api.patch<T>(url, data, config).then((response) => response.data);
  },

  delete: <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    return api.delete<T>(url, config).then((response) => response.data);
  },
};

export default api;

