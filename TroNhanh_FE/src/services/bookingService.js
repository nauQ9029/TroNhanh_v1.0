import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Get user's booking for specific accommodation
export const getUserBookingForAccommodation = async (userId, accommodationId) => {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/bookings/user/${userId}/accommodation/${accommodationId}`
        );
        return response.data;
    } catch (error) {
        if (error.response?.status === 404) {
            return null; // No booking found
        }
        throw error;
    }
};

// Get user's booking history
export const getUserBookingHistory = async (userId) => {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/bookings/user/${userId}`
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching booking history:', error);
        throw error;
    }
};

export default {
    getUserBookingForAccommodation,
    getUserBookingHistory,
};
