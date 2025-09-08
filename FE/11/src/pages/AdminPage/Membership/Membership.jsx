import React, { useState, useEffect, useCallback } from "react";
import { Button, Form, message, Tabs, Spin } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import MembershipFilterBar from "./MembershipFilterBar";
import MembershipCardList from "./MembershipCardList";
import MembershipFormModal from "./MembershipFormModal";
import MembershipViewModal from "./MembershipViewModal";
import TransactionHistoryTab from "./TransactionHistoryTab";
import { getAllMembershipPackages, createMembershipPackage, updateMembershipPackage, deleteMembershipPackage } from "../../../services/membershipService";

const Membership = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ search: "", status: undefined });
  const [modal, setModal] = useState({ open: false, mode: "create", record: null });
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  // Load packages from API
  const loadPackages = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getAllMembershipPackages();
      console.log('Loaded packages:', response);
      
      // Handle different response formats
      let packagesData = [];
      if (response.packages && Array.isArray(response.packages)) {
        // Paginated response format: {total, page, pageSize, packages}
        packagesData = response.packages;
      } else if (response.success && response.data) {
        packagesData = response.data;
      } else if (Array.isArray(response)) {
        // Direct array response
        packagesData = response;
      } else if (response.data && Array.isArray(response.data)) {
        // Response with data array
        packagesData = response.data;
      } else {
        console.error('Invalid response format:', response);
        messageApi.error('Định dạng dữ liệu không hợp lệ!');
        return;
      }
      
      setPackages(packagesData);
      if (packagesData.length === 0) {
        messageApi.info('Chưa có gói thành viên nào!');
      } else {
        console.log(`Loaded ${packagesData.length} packages successfully`);
        console.log('Sample package structure:', packagesData[0]); // Debug: Check package structure
        // Show total info if available
        const totalInfo = response.total ? ` (${packagesData.length}/${response.total})` : '';
      }
    } catch (error) {
      console.error('Error loading packages:', error);
      
      // Handle authentication errors specifically
      if (error.response?.data?.message === 'Access token required' || 
          error.message === 'Authentication required') {
        messageApi.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!');
        // You might want to redirect to login page here
      } else {
        const errorMessage = error.response?.data?.message || 
                            error.message || 
                            'Có lỗi khi tải danh sách gói!';
        messageApi.error(errorMessage);
      }
      
      // If API fails, don't show empty state, keep existing packages
      if (packages.length === 0) {
        setPackages([]);
      }
    } finally {
      setLoading(false);
    }
  }, [messageApi, packages.length]);

  // Load packages on component mount
  useEffect(() => {
    loadPackages();
  }, [loadPackages]);

  const filtered = packages.filter(pkg => {
    // Handle both backend field names (packageName) and frontend field names (name)
    const packageName = pkg.packageName || pkg.name || '';
    const searchMatch = !filters.search || packageName.toLowerCase().includes(filters.search.toLowerCase());
    
    // Handle both isActive (boolean) and status (string) fields for filtering
    let statusMatch = true;
    if (filters.status) {
      if (filters.status === 'active') {
        statusMatch = pkg.isActive === true || pkg.status === 'active';
      } else if (filters.status === 'inactive') {
        statusMatch = pkg.isActive === false || pkg.status === 'inactive';
      }
    }
    
    return searchMatch && statusMatch;
  });

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      if (modal.mode === "create") {
        // Check for duplicate name locally first
        if (packages.some(pkg => (pkg.packageName || pkg.name) === values.packageName)) {
          messageApi.error("Tên gói đã tồn tại!");
          setLoading(false);
          return;
        }

        try {
          // Prepare data for backend API
          const apiData = {
            packageName: values.packageName,
            price: values.price,
            duration: values.duration,
            description: values.description,
            postsAllowed: values.postsAllowed,
            features: values.features ? values.features.split(',').map(f => f.trim()).filter(f => f) : [],
            isActive: values.isActive !== undefined ? values.isActive : true
          };

          const response = await createMembershipPackage(apiData);
          console.log('Package created:', response);
          
          // Handle different success response formats
          if (response.success || 
              response.message?.includes('created successfully') || 
              response.data || 
              response.packageName) {
            messageApi.success("Tạo gói thành công!");
            await loadPackages(); // Reload packages from server
          } else {
            const errorMessage = response.message || 'Có lỗi khi tạo gói!';
            messageApi.error(errorMessage);
          }
        } catch (error) {
          console.error('Error creating package:', error);
          
          // Handle authentication errors specifically
          if (error.response?.data?.message === 'Access token required' || 
              error.message === 'Authentication required') {
            messageApi.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!');
          } else {
            const errorMessage = error.response?.data?.message || 
                                error.message || 
                                'Có lỗi khi tạo gói!';
            messageApi.error(errorMessage);
          }
        }
      } else {
        // Edit mode
        const originalName = modal.record.packageName || modal.record.name;
        if (modal.record.inUse && values.packageName !== originalName) {
          messageApi.error("Không thể đổi tên gói đang được sử dụng!");
          setLoading(false);
          return;
        }

        try {
          // Prepare data for backend API
          const apiData = {
            packageName: values.packageName,
            price: values.price,
            duration: values.duration,
            description: values.description,
            postsAllowed: values.postsAllowed,
            features: values.features ? values.features.split(',').map(f => f.trim()).filter(f => f) : [],
            isActive: values.isActive !== undefined ? values.isActive : true
          };

          const packageId = modal.record._id || modal.record.id;
          if (!packageId) {
            messageApi.error("Không tìm thấy ID của gói để cập nhật!");
            setLoading(false);
            return;
          }

          const response = await updateMembershipPackage(packageId, apiData);
          console.log('Package updated:', response);
          
          // Handle different success response formats
          if (response.success || 
              response.message?.includes('updated successfully') || 
              response.data || 
              response.packageName) {
            messageApi.success("Cập nhật thành công!");
            await loadPackages(); // Reload packages from server
          } else {
            const errorMessage = response.message || 'Có lỗi khi cập nhật gói!';
            messageApi.error(errorMessage);
          }
        } catch (error) {
          console.error('Error updating package:', error);
          
          // Handle authentication errors specifically
          if (error.response?.data?.message === 'Access token required' || 
              error.message === 'Authentication required') {
            messageApi.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!');
          } else {
            const errorMessage = error.response?.data?.message || 
                                error.message || 
                                'Có lỗi khi cập nhật gói!';
            messageApi.error(errorMessage);
          }
        }
      }

      setModal({ open: false, mode: "create", record: null });
      form.resetFields();
    } catch (validationError) {
      console.error('Form validation failed:', validationError);
      messageApi.error('Vui lòng kiểm tra lại thông tin!');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (record) => {
    if (record.inUse) {
      messageApi.error("Không thể xóa gói đang được sử dụng!");
      return;
    }

    const packageId = record._id || record.id;
    if (!packageId) {
      messageApi.error("Không tìm thấy ID của gói để xóa!");
      return;
    }

    setLoading(true);
    try {
      const response = await deleteMembershipPackage(packageId);
      console.log('Package deleted:', response);
      
      // Handle different success response formats
      if (response.success || 
          response.message?.includes('deleted successfully') || 
          response.message?.includes('removed successfully') ||
          (!response.error && !response.message?.includes('error'))) {
        messageApi.success("Đã xóa gói!");
        await loadPackages(); // Reload packages from server
      } else {
        const errorMessage = response.message || 'Có lỗi khi xóa gói!';
        messageApi.error(errorMessage);
      }
    } catch (error) {
      console.error('Error deleting package:', error);
      
      // Handle authentication errors specifically
      if (error.response?.data?.message === 'Access token required' || 
          error.message === 'Authentication required') {
        messageApi.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!');
      } else {
        const errorMessage = error.response?.data?.message || 
                            error.message || 
                            'Có lỗi khi xóa gói!';
        messageApi.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

return (
    <div className="page-container">
      {contextHolder}
      <h1>Membership Management</h1>
      <Spin spinning={loading}>
        <Tabs
          defaultActiveKey="packages"
          items={[
            {
              key: "packages",
              label: "Membership Packages",
              children: (
                <>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    style={{ marginBottom: 16, border: 'none', display: 'inline-block', marginRight: 10 }}
                    onClick={() => { setModal({ open: true, mode: "create", record: null }); form.resetFields(); }}
                    disabled={loading}
                  >
                    Create New Package
                  </Button>
                  <MembershipFilterBar filters={filters} setFilters={setFilters} />
                  <MembershipCardList
                    data={filtered}
                    onView={record => setModal({ open: true, mode: "view", record })}
                    onEdit={record => { 
                      setModal({ open: true, mode: "edit", record }); 
                      // Map backend fields to frontend form fields
                      const formData = {
                        packageName: record.packageName || record.name,
                        price: record.price,
                        duration: record.duration,
                        description: record.description,
                        postsAllowed: record.postsAllowed || record.postLimit,
                        features: Array.isArray(record.features) ? record.features.join(', ') : record.features || '',
                        isActive: record.isActive !== undefined ? record.isActive : (record.status === 'active')
                      };
                      form.setFieldsValue(formData);
                    }}
                    onDelete={handleDelete}
                    loading={loading}
                  />
                  <MembershipFormModal
                    open={modal.open && modal.mode !== "view"}
                    onCancel={() => { setModal({ open: false, mode: "create", record: null }); form.resetFields(); }}
                    onOk={handleSave}
                    form={form}
                    mode={modal.mode}
                    record={modal.record}
                    confirmLoading={loading}
                  />
                  <MembershipViewModal
                    open={modal.open && modal.mode === "view"}
                    onCancel={() => setModal({ open: false, mode: "create", record: null })}
                    record={modal.record}
                  />
                </>
              ),
            },
            {
              key: "transactions",
              label: "Transaction History",
              children: <TransactionHistoryTab />,
            },
          ]}
        />
      </Spin>
    </div>
  );
};

export default Membership;