import api from './api';

export const getUserInfo = () => api.get('/customer/personal-info');
export const getUserFavorites = () => api.get('/customer/favourites');
export const getUserMessages = () => api.get('/customer/messages');
export const updateUserInfo = (formData) =>
  api.put("/customer/personal-info", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
