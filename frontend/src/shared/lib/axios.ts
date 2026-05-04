import axios from 'axios';
import { getSecureData, saveSecureData, removeSecureData } from './storage';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add the access token
axiosInstance.interceptors.request.use(async (config) => {
  const token = await getSecureData('auth_accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await getSecureData('auth_refreshToken');
        const user = await getSecureData('auth_user');
        
        if (!refreshToken || !user?.id) {
          throw new Error('No refresh token available');
        }

        // Use standard axios to avoid infinite loops
        const response = await axios.post(`${API_URL}/auth/refresh`, {
          userId: user.id,
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data.data;

        // Save new tokens securely
        await saveSecureData('auth_accessToken', accessToken);
        await saveSecureData('auth_refreshToken', newRefreshToken);

        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Clear everything on refresh failure
        await removeSecureData('auth_accessToken');
        await removeSecureData('auth_refreshToken');
        await removeSecureData('auth_user');
        
        // Only redirect if we're not already on the login page to avoid loops
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
