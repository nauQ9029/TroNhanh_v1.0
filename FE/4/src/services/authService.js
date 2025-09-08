import api from './api'; 
import { stopAutoLogout } from './autoLogout';
export const login = (data) => api.post('/auth/login', data);
export const register = (data) => api.post('/auth/register', data);

let isRefreshing = false;
let refreshSubscribers = [];
let loggedOut = false;
const onRefreshed = (token) => {
  console.log('[Auth] ✅ Token refreshed, notifying subscribers...');
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

const addRefreshSubscriber = (callback) => {
  console.log('[Auth] ⏳ Waiting for token refresh, subscribing...');
  refreshSubscribers.push(callback);
};

export const saveAccessToken = (accessToken, expiresInMs, refreshToken) => {
  const expireTime = Date.now() + expiresInMs;
  localStorage.setItem('token', accessToken);
  localStorage.setItem('tokenExpire', expireTime.toString());
  if (refreshToken) {
    localStorage.setItem('refreshToken', refreshToken);
  }
  console.log('[Auth] 💾 Access token saved. Expires in', expiresInMs, 'ms');
};

export const getValidAccessToken = async () => {
  const token = localStorage.getItem('token');
  const expire = Number(localStorage.getItem('tokenExpire')) || 0;
  const now = Date.now();
  const threshold = 5 * 1000;

  if (token && expire - now > threshold) {
    console.log('[Auth] 🔐 Token vẫn còn hợp lệ');
    return token;
  }

  if (isRefreshing) {
    console.log('[Auth] 🔁 Token đang được làm mới. Đợi...');
    return new Promise((resolve) => {
      addRefreshSubscriber(resolve);
    });
  }

  console.log('[Auth] ⚠️ Token gần hết hạn hoặc đã hết. Làm mới...');
  isRefreshing = true;

  try {
    const newToken = await refreshAccessToken();
    onRefreshed(newToken);
    return newToken;
  } catch (err) {
    console.error('[Auth] ❌ Lỗi khi làm mới token:', err);
    return null;
  } finally {
    isRefreshing = false;
    console.log('[Auth] 🔚 Đã kết thúc quá trình refresh');
  }
};

export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) {
    console.warn('[Auth] ❌ Không tìm thấy refresh token');
    return null;
  }

  try {
    console.log('[Auth] 🔄 Gửi request refresh-token...');
    const response = await api.post('/auth/refresh-token', { refreshToken });
    const { accessToken, expiresIn } = response.data;
    saveAccessToken(accessToken, expiresIn, refreshToken);
    console.log('[Auth] ✅ Đã làm mới accessToken');
    return accessToken;
  } catch (error) {
    console.error('[Auth] ❌ Refresh token thất bại:', error);
    return null;
  }
};
  
export const resetLoggedOut = () => {
  loggedOut = false;
};