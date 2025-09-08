// file TroNhanh_FE/src/pages/AdminPage/Membership/services/membershipService.js
import axios from "axios";
import { getValidAccessToken } from "./authService";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export const getAllMembershipPackages = async (params = {}) => {
  const token = await getValidAccessToken();
  if (!token) {
    throw new Error("Authentication required");
  }
  const response = await axios.get(`${API_BASE_URL}/admin/membership-packages`, {
    params,
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const getMembershipPackageDetail = async (id) => {
  const token = await getValidAccessToken();
  if (!token) {
    throw new Error("Authentication required");
  }
  const response = await axios.get(`${API_BASE_URL}/admin/membership-packages/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const createMembershipPackage = async (packageData) => {
  const token = await getValidAccessToken();
  if (!token) {
    throw new Error("Authentication required");
  }
  const response = await axios.post(`${API_BASE_URL}/admin/membership-packages`, packageData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const updateMembershipPackage = async (id, packageData) => {
  const token = await getValidAccessToken();
  if (!token) {
    throw new Error("Authentication required");
  }
  const response = await axios.put(`${API_BASE_URL}/admin/membership-packages/${id}`, packageData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const deleteMembershipPackage = async (id) => {
  const token = await getValidAccessToken();
  if (!token) {
    throw new Error("Authentication required");
  }
  const response = await axios.delete(`${API_BASE_URL}/admin/membership-packages/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const toggleMembershipPackageStatus = async (id, status) => {
  const token = await getValidAccessToken();
  if (!token) {
    throw new Error("Authentication required");
  }
  const response = await axios.patch(`${API_BASE_URL}/admin/membership-packages/${id}/status`, {
    status
  }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

const membershipService = {
  getAllMembershipPackages,
  getMembershipPackageDetail,
  createMembershipPackage,
  updateMembershipPackage,
  deleteMembershipPackage,
  toggleMembershipPackageStatus
};

export default membershipService;