import axios from "axios";
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export const getAdminAccommodations = async (params = {}) => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${API_BASE_URL}/admin/accommodations`, {
    params,
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const getAccommodationDetailAdmin = async (id) => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${API_BASE_URL}/admin/accommodations/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const approveAccommodationAdmin = async (id, approvedStatus, rejectedReason = '') => {
  const token = localStorage.getItem("token");
  const response = await axios.put(`${API_BASE_URL}/admin/accommodations/${id}/approve`, {
    approvedStatus,
    rejectedReason
  }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const deleteAccommodationAdmin = async (id, reason) => {
  const token = localStorage.getItem("token");
  const response = await axios.put(`${API_BASE_URL}/admin/accommodations/${id}/delete`, {
    reason
  }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

const accommodationAdminService = {
  getAdminAccommodations,
  getAccommodationDetailAdmin,
  approveAccommodationAdmin,
  deleteAccommodationAdmin
};

export default accommodationAdminService;