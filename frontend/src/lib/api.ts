import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/store/auth.store';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().accessToken;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh token
        const response = await axios.post(
          `${API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const { accessToken } = response.data.data;
        const { user } = useAuthStore.getState();
        if (user) {
          useAuthStore.getState().setAuth(user, accessToken);
        }

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, redirect to login
        useAuthStore.getState().clearAuth();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  register: (data: { email: string; password: string; name: string }) =>
    api.post('/auth/register', data),
  
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  
  logout: () => api.post('/auth/logout'),
  
  refresh: () => api.post('/auth/refresh'),
  
  getCurrentUser: () => api.get('/auth/me'),
};

// Task API
export const taskApi = {
  getTasks: (params?: {
    limit?: number;
    offset?: number;
    status?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
    priority?: string;
  }) => api.get('/tasks', { params }),
  
  getTaskById: (id: string) => api.get(`/tasks/${id}`),
  
  createTask: (data: {
    title: string;
    description?: string;
    priority?: 'LOW' | 'MEDIUM' | 'HIGH';
    dueDate?: string;
  }) => api.post('/tasks', data),
  
  updateTask: (id: string, data: {
    title?: string;
    description?: string | null;
    status?: 'PENDING' | 'COMPLETED';
    priority?: 'LOW' | 'MEDIUM' | 'HIGH';
    dueDate?: string | null;
  }) => api.patch(`/tasks/${id}`, data),
  
  deleteTask: (id: string) => api.delete(`/tasks/${id}`),
  
  toggleTask: (id: string) => api.patch(`/tasks/${id}/toggle`),
};

export default api;
