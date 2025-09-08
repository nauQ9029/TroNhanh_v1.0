import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Get User Dashboard Statistics
export const getUserDashboard = async () => {
    try {
        const token = localStorage.getItem("token");
        
        const response = await axios.get(`${API_BASE_URL}/admin/users/stats`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        return response.data;
    } catch (error) {
        // Enhanced error handling
        if (error.response?.status === 401) {
            throw new Error('Admin authorization required');
        } else if (error.response?.status === 403) {
            throw new Error('Access denied. Admin privileges required.');
        } else if (error.response?.status === 404) {
            throw new Error('Dashboard endpoint not found. Please check the API documentation.');
        } else if (error.response?.status === 500) {
            throw new Error('Server error occurred while fetching dashboard data');
        } else {
            throw new Error(error.response?.data?.message || error.message || 'Failed to fetch dashboard data');
        }
    }
};

// Get Accommodation Dashboard Statistics
export const getAccommodationDashboard = async (period = '30') => {
    try {
        console.log('🏠 Fetching accommodation dashboard data...');
        
        const token = localStorage.getItem("token");
        
        const response = await axios.get(`${API_BASE_URL}/admin/dashboard/accommodations`, {
            params: { period },
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log('🏠 Accommodation dashboard response:', response.data);
        return response.data;
    } catch (error) {
        console.error('🏠 Error fetching accommodation dashboard data:', error);
        
        // Enhanced error handling
        if (error.response?.status === 401) {
            throw new Error('Admin authorization required');
        } else if (error.response?.status === 403) {
            throw new Error('Access denied. Admin privileges required.');
        } else if (error.response?.status === 404) {
            throw new Error('Accommodation dashboard endpoint not found. Please check the API documentation.');
        } else if (error.response?.status === 500) {
            throw new Error('Server error occurred while fetching accommodation dashboard data');
        } else {
            throw new Error(error.response?.data?.message || error.message || 'Failed to fetch accommodation dashboard data');
        }
    }
};

// Get Report Dashboard Statistics
export const getReportDashboard = async (period = '30') => {
    try {
        console.log('📋 Fetching report dashboard data...');
        
        const token = localStorage.getItem("token");
        
        const response = await axios.get(`${API_BASE_URL}/admin/dashboard/reports`, {
            params: { period },
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log('📋 Report dashboard response:', response.data);
        return response.data;
    } catch (error) {
        console.error('📋 Error fetching report dashboard data:', error);
        
        // Enhanced error handling
        if (error.response?.status === 401) {
            throw new Error('Admin authorization required');
        } else if (error.response?.status === 403) {
            throw new Error('Access denied. Admin privileges required.');
        } else if (error.response?.status === 404) {
            throw new Error('Report dashboard endpoint not found. Please check the API documentation.');
        } else if (error.response?.status === 500) {
            throw new Error('Server error occurred while fetching report dashboard data');
        } else {
            throw new Error(error.response?.data?.message || error.message || 'Failed to fetch report dashboard data');
        }
    }
};

// Get Membership Dashboard Statistics  
export const getMembershipDashboard = async (period = '30') => {
    try {
        console.log('💳 Fetching membership dashboard data...');
        
        const token = localStorage.getItem("token");
        
        const response = await axios.get(`${API_BASE_URL}/admin/dashboard/memberships`, {
            params: { period },
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log('💳 Membership dashboard response:', response.data);
        return response.data;
    } catch (error) {
        console.error('💳 Error fetching membership dashboard data:', error);
        
        if (error.response?.status === 401) {
            throw new Error('Admin authorization required');
        } else if (error.response?.status === 403) {
            throw new Error('Access denied. Admin privileges required.');
        } else if (error.response?.status === 404) {
            throw new Error('Membership dashboard endpoint not found. Please check the API documentation.');
        } else if (error.response?.status === 500) {
            throw new Error('Server error occurred while fetching membership dashboard data');
        } else {
            throw new Error(error.response?.data?.message || error.message || 'Failed to fetch membership dashboard data');
        }
    }
};

// Get Financial Dashboard Statistics
export const getFinancialDashboard = async (period = '30') => {
    try {
        console.log('💰 Fetching financial dashboard data...');
        
        const token = localStorage.getItem("token");
        
        const response = await axios.get(`${API_BASE_URL}/admin/dashboard/financial`, {
            params: { period },
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log('💰 Financial dashboard response:', response.data);
        return response.data;
    } catch (error) {
        console.error('💰 Error fetching financial dashboard data:', error);
        
        if (error.response?.status === 401) {
            throw new Error('Admin authorization required');
        } else if (error.response?.status === 403) {
            throw new Error('Access denied. Admin privileges required.');
        } else if (error.response?.status === 404) {
            throw new Error('Financial dashboard endpoint not found. Please check the API documentation.');
        } else if (error.response?.status === 500) {
            throw new Error('Server error occurred while fetching financial dashboard data');
        } else {
            throw new Error(error.response?.data?.message || error.message || 'Failed to fetch financial dashboard data');
        }
    }
};

const dashboardService = {
    getUserDashboard,
    getAccommodationDashboard,
    getReportDashboard,
    getMembershipDashboard,
    getFinancialDashboard,
};

export default dashboardService;
