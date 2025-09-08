import axios from 'axios';
import { getValidAccessToken } from './authService';
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with base configuration
const userAPI = axios.create({
    baseURL: `${API_BASE_URL}/admin`,
    headers: {
        'Content-Type': 'application/json',
    },
});
// axios instance
const chatAPI = axios.create({
  baseURL: "http://localhost:5000/api/chats"
});

// Add token to requests
userAPI.interceptors.request.use(
    async (config) => {
        const token = await getValidAccessToken(); // ✅ Đúng: dùng await

        console.log('🔍 Token debug:');
        console.log('- Token key used: "token"');
        console.log('- Token exists:', !!token);
        console.log('- Token length:', token?.length);
        console.log('- Token preview:', token?.substring(0, 100)); // ✅ giờ token là string

        // Also check for user info
        const userInfo = localStorage.getItem('user');
        console.log('- User info exists:', !!userInfo);
        if (userInfo) {
            try {
                const parsedUser = JSON.parse(userInfo);
                console.log('- User data:', parsedUser);
            } catch (e) {
                console.log('- Error parsing user data:', e);
            }
        }

        if (token) {
            console.log('Adding token to request headers:', token.substring(0, 50) + '...');
            config.headers.Authorization = `Bearer ${token}`;
        } else {
            console.log('No token found in localStorage with key "token"');
        }

        return config;
    },
    (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor to handle authentication errors
userAPI.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            // Token is invalid or expired
            console.log('401 error detected, clearing auth data');
            console.log('Error response:', error.response);
            console.log('Request URL:', error.config?.url);
            console.log('Request headers:', error.config?.headers);

            // Clear all possible token keys to ensure logout
            localStorage.removeItem('token');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            localStorage.removeItem('userInfo');

            // Commented out redirect for debugging
            // Only redirect if we're not already on the login page
            // if (!window.location.pathname.includes('/login')) {
            //   console.log('Redirecting to login page');
            //   window.location.href = '/login';
            // }

            return Promise.reject(new Error('Authentication failed. Please login again.'));
        }

        // Handle other errors
        const errorMessage = error.response?.data?.message || error.message || 'An unexpected error occurred';
        console.log('API Error:', error.response?.status, errorMessage);
        return Promise.reject(new Error(errorMessage));
    }
);

// UC-Admin-01: View User List
export const getAllUsers = async (params = {}) => {
    try {
        console.log('getAllUsers called with params:', params);
        console.log('Making request to:', '/users');
        console.log('Full URL will be:', `${API_BASE_URL}/admin/users`);

        const response = await userAPI.get('/users', { params });
        console.log('getAllUsers response:', response);
        console.log('Response data:', response.data);

        return response.data;
    } catch (error) {
        console.error('Error in getAllUsers:', error);
        console.error('Error response:', error.response);
        console.error('Error config:', error.config);
        throw error;
    }
};

// Get user statistics
export const getUserStats = async () => {
    try {
        const response = await userAPI.get('/users/stats');
        return response.data;
    } catch (error) {
        console.error('Error fetching user stats:', error);
        throw error;
    }
};

// UC-Admin-02: Lock/Unlock User
export const lockUnlockUser = async (userId, lockData) => {
    try {
        console.log('🔒 lockUnlockUser called with:', { userId, lockData });

        // Transform frontend data to match backend expected format
        const requestData = {
            action: lockData.isLocked ? 'lock' : 'unlock'
        };

        console.log('🔒 Transformed request data:', requestData);
        console.log('🔒 Making request to:', `/users/${userId}/lock-unlock`);
        console.log('🔒 Full URL:', `${API_BASE_URL}/admin/users/${userId}/lock-unlock`);

        const response = await userAPI.put(`/users/${userId}/lock-unlock`, requestData);

        console.log('🔒 Lock/unlock response:', response);
        console.log('🔒 Response data:', response.data);

        return response.data;
    } catch (error) {
        console.error('🔒 Error in lockUnlockUser:', error);
        console.error('🔒 Error response:', error.response);
        console.error('🔒 Error config:', error.config);

        // Enhanced error handling
        if (error.response?.status === 400) {
            throw new Error(error.response.data.message || 'Invalid request data');
        } else if (error.response?.status === 401) {
            throw new Error('Admin authorization required');
        } else if (error.response?.status === 404) {
            throw new Error('User not found');
        } else {
            throw new Error(error.response?.data?.message || error.message || 'Failed to update user status');
        }
    }
};

// UC-Admin-03: Edit User Information
export const editUserInfo = async (userId, userData) => {
    try {
        console.log('✏️ editUserInfo called with:', { userId, userData });

        // Transform frontend data to match backend expected format
        const requestData = {
            name: userData.fullName || userData.name,
            email: userData.email,
            phone: userData.phoneNumber || userData.phone,
            gender: userData.gender,
        };

        // Handle role conversion - backend expects lowercase strings
        if (userData.roles && userData.roles.length > 0) {
            const frontendRole = userData.roles[0].name;
            // Convert frontend role names to backend format
            const roleMapping = {
                'Admin': 'admin',
                'Owner': 'owner',
                'Customer': 'customer',
            };
            requestData.role = roleMapping[frontendRole] || frontendRole.toLowerCase();
        }

        // Remove undefined values
        Object.keys(requestData).forEach(key => {
            if (requestData[key] === undefined) {
                delete requestData[key];
            }
        });

        console.log('✏️ Transformed request data:', requestData);
        console.log('✏️ Making request to:', `/users/${userId}/edit`);
        console.log('✏️ Full URL:', `${API_BASE_URL}/admin/users/${userId}/edit`);

        const response = await userAPI.put(`/users/${userId}/edit`, requestData);

        console.log('✏️ Edit user response:', response);
        console.log('✏️ Response data:', response.data);

        return response.data;
    } catch (error) {
        console.error('✏️ Error in editUserInfo:', error);
        console.error('✏️ Error response:', error.response?.data);
        console.error('✏️ Error status:', error.response?.status);
        console.error('✏️ Error config:', error.config);
        console.error('✏️ Original userData was:', userData);

        // Enhanced error handling
        if (error.response?.status === 400) {
            throw new Error(error.response.data.message || 'Invalid request data');
        } else if (error.response?.status === 401) {
            throw new Error('Admin authorization required');
        } else if (error.response?.status === 404) {
            throw new Error('User not found');
        } else if (error.response?.status === 500) {
            throw new Error(error.response?.data?.message || 'Server error occurred. Please check the backend logs.');
        } else {
            throw new Error(error.response?.data?.message || error.message || 'Failed to update user information');
        }
    }
};

// UC-Admin-04: Delete User Account
export const deleteUser = async (userId) => {
    try {
        console.log('🗑️ Deleting user:', userId);

        // Backend requires confirmation in request body
        const requestData = {
            confirm: 'DELETE'
        };

        const response = await userAPI.delete(`/users/${userId}`, { data: requestData });

        console.log('✅ Delete user response:', response.data);
        return response.data;
    } catch (error) {
        console.error('❌ Delete user error:', error);
        console.error('Error details:', {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data,
        });

        // Handle specific error cases
        if (error.response?.status === 400) {
            throw new Error(error.response.data?.message || 'Invalid request to delete user');
        } else if (error.response?.status === 401) {
            throw new Error('Authentication failed. Please login again.');
        } else if (error.response?.status === 403) {
            throw new Error('You do not have permission to delete this user');
        } else if (error.response?.status === 404) {
            throw new Error('User not found');
        } else if (error.response?.status === 500) {
            throw new Error('Server error occurred while deleting user');
        } else {
            throw new Error(error.response?.data?.message || error.message || 'Failed to delete user');
        }
    }
};

// Get User By ID
export const getUserById = async (userId) => {
    try {
        const response = await userAPI.get(`/users/${userId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};


// Get User Chat By ID
export const getUserChatById = async (userId) => {
  try {
    const response = await chatAPI.get(`/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user chat:", error);
    throw error;
  }
};

// Get Audit Logs
export const getAuditLogs = async (params = {}) => {
    try {
        const response = await userAPI.get('/audit-logs', { params });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Utility function to check if user is authenticated
export const isAuthenticated = () => {
    const token = getValidAccessToken() // Use same key as authService.js
    return !!token;
};

// Utility function to get current user info
export const getCurrentUser = () => {
    try {
        const userInfo = localStorage.getItem('userInfo');
        return userInfo ? JSON.parse(userInfo) : null;
    } catch (error) {
        console.error('Error parsing user info:', error);
        return null;
    }
};

// Utility function to manually logout
export const logout = () => {
    // Clear all possible token keys to ensure complete logout
    localStorage.removeItem('token');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('userInfo');
    window.location.href = '/login';
};

// Function to validate token with backend
export const validateToken = async () => {
    try {
        const response = await userAPI.get('/auth/validate');
        return response.data;
    } catch (error) {
        console.error('Token validation failed:', error);
        return false;
    }
};

const userService = {
    getAllUsers,
    getUserStats,
    lockUnlockUser,
    editUserInfo,
    deleteUser,
    getUserById,
    getUserChatById,
    getAuditLogs,
    isAuthenticated,
    getCurrentUser,
    logout,
    validateToken,
};

export default userService;