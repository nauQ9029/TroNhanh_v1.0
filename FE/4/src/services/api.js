// api.js
import axios from 'axios';
import { getValidAccessToken } from './authService';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: false,
});

// Hàm gắn interceptor
export const setupInterceptors = (contextLogout) => {
  api.interceptors.request.use(
    async (config) => {
      if (
        config.url.includes('/auth/login') ||
        config.url.includes('/auth/register') ||
        config.url.includes('/auth/refresh')
      ) {
        return config;
      }

      const token = await getValidAccessToken();
      if (!token) {
        contextLogout('token expired');
        return Promise.reject(new Error('Token expired'));
      }
        
      config.headers.Authorization = `Bearer ${token}`;
      return config;
    },
    (error) => Promise.reject(error)
  );
};

export default api;
