import React, { useState, useEffect, useCallback } from "react";
import { message, Tabs, Spin, Form } from "antd";
import ReportsFilterBar from "./ReportsFilterBar";
import ReportsTable from "./ReportsTable";
import ReportDetailModal from "./ReportDetailModal";
import ReportsResolveModal from "./ReportsResolveModal";
import { getAllReports, getReportsByCategory, getReportById, resolveReport } from "../../../services/reportServiceAdmin";

const Reports = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  });
  const [statistics, setStatistics] = useState({});
  
  const [filters, setFilters] = useState({
    search: "",
    status: undefined,
    dateRange: [],
  });
  
  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  
  // Resolve modal state
  const [resolveModalVisible, setResolveModalVisible] = useState(false);
  const [resolveLoading, setResolveLoading] = useState(false);
  const [resolveForm] = Form.useForm();
  
  const [messageApi, contextHolder] = message.useMessage();

  // Load reports from API
  const loadReports = useCallback(async (customParams = {}) => {
    setLoading(true);
    try {
      let apiParams = {
        page: customParams.page || 1,
        limit: customParams.limit || 10,
        ...customParams
      };

      // Apply filters
      if (filters.search) {
        apiParams.search = filters.search;
      }
      if (filters.status) {
        apiParams.status = filters.status;
      }
      if (filters.dateRange && filters.dateRange.length === 2) {
        apiParams.fromDate = filters.dateRange[0].format('YYYY-MM-DD');
        apiParams.toDate = filters.dateRange[1].format('YYYY-MM-DD');
      }


      let response;
      if (activeTab === 'all') {
        response = await getAllReports(apiParams);
      } else {
        const reportType = activeTab === 'customer_reports' ? 'customer_report_owner' : 'owner_report_customer';
        response = await getReportsByCategory(reportType, apiParams);
      }

      console.log('Loaded reports:', response);
      
      if (response.success && response.data) {
        setReports(response.data.reports || []);
        setPagination(prev => ({ ...prev, ...response.data.pagination }));
        setStatistics(response.data.statistics || {});
        
        if (response.data.reports?.length === 0) {
          messageApi.info('No reports found!');
        } else {
          console.log(`Loaded ${response.data.reports?.length} reports successfully`);
        }
      } else {
        messageApi.error('Invalid data format!');
      }
    } catch (error) {
      console.error('Error loading reports:', error);
      
      // Handle authentication errors specifically
      if (error.response?.data?.message === 'Access token required' || 
          error.message === 'Authentication required') {
        messageApi.error('Session expired. Please login again!');
      } else {
        const errorMessage = error.response?.data?.message || 
                            error.message || 
                            'Error loading reports!';
        messageApi.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  }, [activeTab, filters, messageApi]);

  // Load reports on component mount and when dependencies change
  useEffect(() => {
    loadReports();
  }, [loadReports]);

  // Handle pagination change
  const handleTableChange = (newPagination) => {
    const newPage = newPagination.current;
    const newLimit = newPagination.pageSize;
    setPagination(prev => ({ ...prev, page: newPage, limit: newLimit }));
    loadReports({ page: newPage, limit: newLimit });
  };

  // Handle view report details
  const handleViewReport = async (report) => {
    try {
      setModalLoading(true);
      setModalVisible(true);
      setSelectedReport(null);
      
      const response = await getReportById(report._id);
      
      if (response.success && response.data) {
        setSelectedReport(response.data);
        messageApi.success('Report details loaded successfully');
      } else {
        messageApi.error('Failed to load report details');
        setModalVisible(false);
      }
    } catch (error) {
      console.error('Error loading report details:', error);
      messageApi.error('Error loading report details: ' + (error.response?.data?.message || error.message));
      setModalVisible(false);
    } finally {
      setModalLoading(false);
    }
  };

  // Handle close modal
  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedReport(null);
  };

  // Handle resolve report
  const handleResolveReport = (report) => {
    setSelectedReport(report);
    setResolveModalVisible(true);
    resolveForm.resetFields();
  };

  // Handle resolve modal submit
  const handleResolveSubmit = async () => {
    try {
      const values = await resolveForm.validateFields();
      setResolveLoading(true);

      const response = await resolveReport(selectedReport._id, values);

      if (response.success) {
        messageApi.success(`Report ${values.action}d successfully!`);
        setResolveModalVisible(false);
        resolveForm.resetFields();
        setSelectedReport(null);
        // Reload reports to reflect changes
        loadReports();
      } else {
        messageApi.error(response.message || 'Failed to resolve report');
      }
    } catch (error) {
      console.error('Error resolving report:', error);
      messageApi.error('Error resolving report: ' + (error.response?.data?.message || error.message));
    } finally {
      setResolveLoading(false);
    }
  };

  // Handle resolve modal cancel
  const handleResolveCancel = () => {
    setResolveModalVisible(false);
    resolveForm.resetFields();
    setSelectedReport(null);
  };

  const tabItems = [
    {
      key: "all",
      label: `All Reports (${statistics.total || reports.length})`,
      children: (
        <>
          <ReportsFilterBar filters={filters} setFilters={setFilters} />
          <ReportsTable
            data={reports}
            loading={loading}
            pagination={{
              current: pagination.page,
              pageSize: pagination.limit,
              total: pagination.total,
              showQuickJumper: true,
              showTotal: (total, range) => 
                `${range[0]}-${range[1]} of ${total} reports`,
            }}
            onChange={handleTableChange}
            onView={handleViewReport}
            onResolve={handleResolveReport}
          />
        </>
      ),
    },
  ];

  return (
    <div className="page-container" style={{ maxWidth: 1100, margin: "0 auto" }}>
      {contextHolder}
      <h1>Reports Management</h1>
      <Spin spinning={loading}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
        />
      </Spin>
      
      {/* Report Detail Modal */}
      <ReportDetailModal
        visible={modalVisible}
        onClose={handleCloseModal}
        reportData={selectedReport}
        loading={modalLoading}
        onResolve={handleResolveReport}
      />
      
      {/* Report Resolve Modal */}
      <ReportsResolveModal
        open={resolveModalVisible}
        onCancel={handleResolveCancel}
        onOk={handleResolveSubmit}
        form={resolveForm}
        record={selectedReport}
        confirmLoading={resolveLoading}
      />
    </div>
  );
};

export default Reports;
