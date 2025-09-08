import axiosInstance from './axiosInstance';

// Admin Report Management Functions
export const getAllReports = async (params = {}) => {
  try {
      const token = localStorage.getItem("token");
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await axiosInstance.get('/admin/reports', {
      params: {
        page: 1,
        limit: 20,
        sortBy: 'createAt',
        sortOrder: 'desc',
        ...params
      },
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching reports:', error);
    throw error;
  }
};

// Get reports by category (customer vs owner)
export const getReportsByCategory = async (category, params = {}) => {
  try {
    return await getAllReports({
      reportType: category,
      ...params
    });
  } catch (error) {
    console.error(`Error fetching ${category} reports:`, error);
    throw error;
  }
};

// Get report details by ID
export const getReportById = async (reportId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await axiosInstance.get(`/admin/reports/${reportId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching report details:', error);
    throw error;
  }
};

// Resolve report by ID
export const resolveReport = async (reportId, resolveData) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await axiosInstance.put(`/admin/reports/${reportId}/resolve`, resolveData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error resolving report:', error);
    throw error;
  }
};
