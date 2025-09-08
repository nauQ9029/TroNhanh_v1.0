import axiosInstance from './axiosInstance'

const API_BASE_URL = 'http://localhost:5000/api/accommodation';
const API_FAV_URL = 'http://localhost:5000/api/favorites';


//  Tạo mới accommodation
export const createAccommodation = async (data) => {
    console.log("📦 Payload gửi BE:", JSON.stringify(data, null, 2));

    const response = await axiosInstance.post(`${API_BASE_URL}/`, data);
    return response.data;
};

//  Lấy tất cả accommodations
export const getAllAccommodations = async () => {
    const response = await axiosInstance.get(`${API_BASE_URL}/`);
    return response.data;
};

//  Lấy tất cả accommodations của owner (bao gồm unavailable)
export const getOwnerAccommodations = async (ownerId) => {
    const response = await axiosInstance.get(`${API_BASE_URL}/`, {
        params: { ownerId }
    });
    return response.data;
};

//  Tìm kiếm accommodation theo location (district, street, addressDetail)
export const searchAccommodations = async (filters) => {
    console.log("Search filters:", {
        district: filters.district,
        street: filters.street,
        addressDetail: filters.addressDetail,
    });
    const response = await axiosInstance.get(`${API_BASE_URL}/searchAccomodation`, {
        params: filters, // ví dụ: ?district=...&street=...
    });
    return response.data;
};

//  Lấy accommodation theo ID
export const getAccommodationById = async (id) => {
    const response = await axiosInstance.get(`${API_BASE_URL}/${id}`);
    return response.data;
};

//  Cập nhật accommodation
export const updateAccommodation = async (id, updatedData) => {
    const response = await axiosInstance.put(`${API_BASE_URL}/${id}`, updatedData);
    return response.data;
};

//  Xóa accommodation
export const deleteAccommodation = async (id) => {
    const response = await axiosInstance.delete(`${API_BASE_URL}/${id}`);
    return response.data;
};

//  Thêm vào Favorite
export const addToFavorite = async (data) => {
    const response = await axiosInstance.post(`${API_FAV_URL}/`, data);
    return response.data;
}
export const getUserFavorites = async () => {
    const res = await axiosInstance.get("/favorites");
    return res.data.favorites; // đảm bảo backend trả về { favorites: [...] }
};

export const removeFromFavorite = async (accommodationId) => {
    const res = await axiosInstance.delete(`/favorites/${accommodationId}`);
    return res.data;
};

// Owner rating APIs
export const getOwnerRatings = async () => {
    const response = await axiosInstance.get(`${API_BASE_URL}/owner/ratings`);
    return response.data;
};

export const getAccommodationRatings = async (accommodationId) => {
    const response = await axiosInstance.get(`${API_BASE_URL}/owner/${accommodationId}/ratings`);
    return response.data;
};

// Owner Statistics APIs
export const getOwnerStatistics = async () => {
    const response = await axiosInstance.get(`${API_BASE_URL}/owner/statistics`);
    return response.data;
};

export const getOwnerMonthlyRevenue = async (months = 6) => {
    const response = await axiosInstance.get(`${API_BASE_URL}/owner/monthly-revenue?months=${months}`);
    return response.data;
};

export const getOwnerRecentBookings = async (limit = 10) => {
    const response = await axiosInstance.get(`${API_BASE_URL}/owner/recent-bookings?limit=${limit}`);
    return response.data;
};

export const getOwnerTopAccommodations = async (limit = 5) => {
    const response = await axiosInstance.get(`${API_BASE_URL}/owner/top-accommodations?limit=${limit}`);
    return response.data;
};

export const getOwnerCurrentMembership = async () => {
    const response = await axiosInstance.get(`${API_BASE_URL}/owner/current-membership`);
    return response.data;
};

export const getOwnerMembershipInfo = async () => {
    const response = await axiosInstance.get(`${API_BASE_URL}/owner/membership-info`);
    return response.data;
};