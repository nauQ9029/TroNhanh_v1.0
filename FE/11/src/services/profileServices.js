import api from './api';

export const getUserInfo = () => api.get('/customer/personal-info');
export const getUserFavorites = () => api.get('/customer/favorites');
export const getUserMessages = () => api.get('/customer/messages');
export const removeFavorite = (data) => {
  return api.delete("/favorites", {
    data,
  });
};

export const updateUserInfo = (formData) =>
  api.put("/customer/personal-info", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });