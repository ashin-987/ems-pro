import axios from 'axios';
import toast from 'react-hot-toast';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Attach JWT token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Try to refresh token
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (refreshToken) {
        try {
          const response = await axios.post('/api/auth/refresh', {
            refreshToken: refreshToken,
          });

          const { token, refreshToken: newRefreshToken } = response.data.data;

          // Update tokens
          localStorage.setItem('token', token);
          localStorage.setItem('refreshToken', newRefreshToken);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          // Refresh failed - clear auth and redirect to login
          localStorage.clear();
          window.location.href = '/login';
          toast.error('Session expired. Please login again.');
          return Promise.reject(refreshError);
        }
      } else {
        // No refresh token - clear auth and redirect
        localStorage.clear();
        window.location.href = '/login';
        toast.error('Session expired. Please login again.');
      }
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      toast.error('You do not have permission to perform this action.');
    }

    // Handle 404 Not Found
    if (error.response?.status === 404) {
      toast.error('Resource not found.');
    }

    // Handle 500 Internal Server Error
    if (error.response?.status === 500) {
      toast.error('Server error. Please try again later.');
    }

    // Handle network errors (backend down)
    if (error.message === 'Network Error') {
      toast.error('Cannot connect to server. Please check if the backend is running.');
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
