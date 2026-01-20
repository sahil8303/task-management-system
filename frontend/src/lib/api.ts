import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/store/auth.store';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// create instance
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
    withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// add token to requests
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().accessToken;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error) // just reject
);

// response interceptor - handle 401s
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // check if its a 401 and we havent retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // attempt refresh
        const response = await axios.post(
          `${API_URL}/auth/refresh`, {}, { withCredentials: true }
        );

        const { accessToken } = response.data.data;
        const { user } = useAuthStore.getState();
        
        if (user) {
            useAuthStore.getState().setAuth(user, accessToken);
        }

        // retry the original call with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);

      } catch (refreshError) {
        // if refresh fails, force logout
        useAuthStore.getState().clearAuth();
          window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// auth endpoints
export const authApi = {
  register: (data: { email: string; password: string; name: string }) => api.post('/auth/register', data),
  login: (data: { email: string; password: string }) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  refresh: () => api.post('/auth/refresh'),
  getCurrentUser: () => api.get('/auth/me'),
};

// task stuff
export const taskApi = {
  // this is getting long...
  getTasks: (params?: { limit?: number; offset?: number; status?: string; search?: string; sortBy?: string; sortOrder?: string; priority?: string; }) => 
    api.get('/tasks', { params }),

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