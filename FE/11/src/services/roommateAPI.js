// services/roommateAPI.js
import axiosInstance from './axiosInstance';

export const createRoommatePost = async (data) => {
  const res = await axiosInstance.post('/roommates', data);
  return res.data;
};

export const getRoommatePosts = async (accommodationId) => {
  const res = await axiosInstance.get(`/roommates/${accommodationId}`);
  return res.data.posts;
};
