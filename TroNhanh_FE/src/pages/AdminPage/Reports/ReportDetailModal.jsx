import React from "react";
import { Modal, Descriptions, Tag, Avatar, Typography, Divider, Image, Button, Space } from "antd";
import { UserOutlined, HomeOutlined, CalendarOutlined, CheckOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { Text } = Typography;

const statusColors = {
  pending: "orange",
  resolved: "green",
  rejected: "red",
  forwarded: "blue",
  in_progress: "blue",
};

const statusLabels = {
  pending: "Pending",
  resolved: "Resolved",
  rejected: "Rejected",
  forwarded: "Forwarded",
  in_progress: "In Progress",
};

const ReportDetailModal = ({ visible, onClose, reportData, loading, onResolve }) => {
  if (!reportData) return null;

  // Helper function to format address object to string
  const formatAddress = (address) => {
    if (!address) return 'N/A';
    
    if (typeof address === 'string') return address;
    
    if (typeof address === 'object') {
      const parts = [];
      if (address.addressDetail) parts.push(address.addressDetail);
      if (address.street) parts.push(address.street);
      if (address.district) parts.push(address.district);
      return parts.length > 0 ? parts.join(', ') : 'N/A';
    }
    
    return 'N/A';
  };

  // Helper function to safely render any value as string
  const safeRender = (value, fallback = 'N/A') => {
    if (value === null || value === undefined) return fallback;
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return value.toString();
    if (typeof value === 'object') {
      return JSON.stringify(value);
    }
    return fallback;
  };

  const categoryLabels = {
    customer_report_owner: "Customer Report Owner",
    owner_report_customer: "Owner Report Customer",
    general: "General Report",
    other: "Other"
  };

  const categoryColors = {
    customer_report_owner: "orange",
    owner_report_customer: "purple",
    general: "cyan",
    other: "default"
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <UserOutlined />
          <span>Report Details</span>
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button onClick={onClose}>Close</Button>
          <Space>
            {reportData?.status?.toLowerCase() === 'pending' && (
              <Button 
                icon={<CheckOutlined />}
                onClick={() => {
                  if (onResolve) {
                    onClose(); // Close detail modal first
                    onResolve(reportData); // Then open resolve modal
                  }
                }}
              >
                Resolve Report
              </Button>
            )}
          </Space>
        </div>
      }
      width={800}
      loading={loading}
    >
      {reportData && (
        <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          {/* Basic Report Information */}
          <Descriptions bordered column={2} size="small">
            <Descriptions.Item label="Report ID" span={2}>
              <Text copyable={{ text: reportData._id }}>
                {reportData._id}
              </Text>
            </Descriptions.Item>
            
            <Descriptions.Item label="Type">
              <Tag color="blue">{reportData.type || 'Other'}</Tag>
            </Descriptions.Item>
            
            <Descriptions.Item label="Category">
              <Tag color={categoryColors[reportData.category] || 'default'}>
                {categoryLabels[reportData.category] || reportData.category || 'Unknown'}
              </Tag>
            </Descriptions.Item>
            
            <Descriptions.Item label="Status" span={1}>
              <Tag color={statusColors[reportData.status?.toLowerCase()] || 'default'}>
                {statusLabels[reportData.status?.toLowerCase()] || reportData.status || 'Unknown'}
              </Tag>
            </Descriptions.Item>
            
            <Descriptions.Item label="Created Date">
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <CalendarOutlined />
                {dayjs(reportData.createAt).format('DD/MM/YYYY HH:mm')}
              </div>
            </Descriptions.Item>
          </Descriptions>

          <Divider>Report Content</Divider>
          
          {/* Report Content */}
          <div style={{ 
            padding: 16, 
            backgroundColor: '#f9f9f9', 
            borderRadius: 6,
            marginBottom: 16
          }}>
            <Text>{safeRender(reportData.content, 'No content provided')}</Text>
          </div>

          {/* Reporter Information */}
          <Divider>Reporter Information</Divider>
          {reportData.reporter ? (
            <Descriptions bordered column={2} size="small">
              <Descriptions.Item label="Name" span={1}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Avatar 
                    size="small" 
                    src={reportData.reporter.avatar}
                    icon={<UserOutlined />}
                  />
                  {reportData.reporter.name}
                </div>
              </Descriptions.Item>
              
              <Descriptions.Item label="Email">
                {reportData.reporter.email}
              </Descriptions.Item>
              
              <Descriptions.Item label="Role">
                <Tag color={reportData.reporter.role === 'customer' ? 'green' : 'blue'}>
                  {reportData.reporter.role?.toUpperCase()}
                </Tag>
              </Descriptions.Item>
              
              <Descriptions.Item label="Phone">
                {reportData.reporter.phone || 'N/A'}
              </Descriptions.Item>
              
              <Descriptions.Item label="Address" span={2}>
                {formatAddress(reportData.reporter.address)}
              </Descriptions.Item>
              
              <Descriptions.Item label="Join Date">
                {dayjs(reportData.reporter.createdAt).format('DD/MM/YYYY')}
              </Descriptions.Item>
            </Descriptions>
          ) : (
            <Text type="secondary">No reporter information available</Text>
          )}

          {/* Reported User Information */}
          {reportData.reportedUser && (
            <>
              <Divider>Reported User Information</Divider>
              <Descriptions bordered column={2} size="small">
                <Descriptions.Item label="Name" span={1}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Avatar 
                      size="small" 
                      src={reportData.reportedUser.avatar}
                      icon={<UserOutlined />}
                    />
                    {reportData.reportedUser.name}
                  </div>
                </Descriptions.Item>
                
                <Descriptions.Item label="Email">
                  {reportData.reportedUser.email}
                </Descriptions.Item>
                
                <Descriptions.Item label="Role">
                  <Tag color={reportData.reportedUser.role === 'customer' ? 'green' : 'blue'}>
                    {reportData.reportedUser.role?.toUpperCase()}
                  </Tag>
                </Descriptions.Item>
                
                <Descriptions.Item label="Phone">
                  {reportData.reportedUser.phone || 'N/A'}
                </Descriptions.Item>
                
                <Descriptions.Item label="Status">
                  <Tag color={reportData.reportedUser.status === 'active' ? 'green' : 'red'}>
                    {reportData.reportedUser.status?.toUpperCase()}
                  </Tag>
                </Descriptions.Item>
                
                <Descriptions.Item label="Address" span={1}>
                  {formatAddress(reportData.reportedUser.address)}
                </Descriptions.Item>
                
                <Descriptions.Item label="Join Date" span={2}>
                  {dayjs(reportData.reportedUser.createdAt).format('DD/MM/YYYY')}
                </Descriptions.Item>
              </Descriptions>
            </>
          )}

          {/* Accommodation Information */}
          {reportData.accommodation && (
            <>
              <Divider>Related Accommodation</Divider>
              <Descriptions bordered column={2} size="small">
                <Descriptions.Item label="Title" span={2}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <HomeOutlined />
                    <Text strong>{reportData.accommodation.title}</Text>
                  </div>
                </Descriptions.Item>
                
                <Descriptions.Item label="Description" span={2}>
                  {safeRender(reportData.accommodation.description, 'No description')}
                </Descriptions.Item>
                
                <Descriptions.Item label="Location">
                  {formatAddress(reportData.accommodation.location)}
                </Descriptions.Item>
                
                <Descriptions.Item label="Price">
                  <Text strong style={{ color: '#1890ff' }}>
                    {new Intl.NumberFormat('vi-VN').format(reportData.accommodation.price)} VND
                  </Text>
                </Descriptions.Item>
                
                <Descriptions.Item label="Status">
                  <Tag color={reportData.accommodation.status === 'available' ? 'green' : 'red'}>
                    {reportData.accommodation.status?.toUpperCase()}
                  </Tag>
                </Descriptions.Item>
                
                <Descriptions.Item label="Approved Status">
                  <Tag color={reportData.accommodation.approvedStatus === 'approved' ? 'green' : 'orange'}>
                    {reportData.accommodation.approvedStatus?.toUpperCase()}
                  </Tag>
                </Descriptions.Item>
                
                {reportData.accommodation.ownerId && (
                  <>
                    <Descriptions.Item label="Owner" span={2}>
                      <div>
                        <div><strong>Name:</strong> {reportData.accommodation.ownerId.name}</div>
                        <div><strong>Email:</strong> {reportData.accommodation.ownerId.email}</div>
                        <div><strong>Phone:</strong> {reportData.accommodation.ownerId.phone}</div>
                      </div>
                    </Descriptions.Item>
                  </>
                )}
                
                <Descriptions.Item label="Created Date">
                  {dayjs(reportData.accommodation.createdAt).format('DD/MM/YYYY')}
                </Descriptions.Item>
                
                {reportData.accommodation.photos && reportData.accommodation.photos.length > 0 && (
                  <Descriptions.Item label="Photos" span={2}>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {reportData.accommodation.photos.slice(0, 3).map((photo, index) => (
                        <Image
                          key={index}
                          width={100}
                          height={80}
                          src={`http://localhost:5000${photo}`}
                          style={{ objectFit: 'cover', borderRadius: 4 }}
                          placeholder={
                            <div style={{
                              width: 100,
                              height: 80,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              background: "#f0f0f0"
                            }}>
                              Loading...
                            </div>
                          }
                          fallback="/image/default-image.jpg"
                        />
                      ))}
                      {reportData.accommodation.photos.length > 3 && (
                        <div style={{ 
                          width: 100, 
                          height: 80, 
                          backgroundColor: '#f0f0f0', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          borderRadius: 4,
                          fontSize: '12px',
                          color: '#666'
                        }}>
                          +{reportData.accommodation.photos.length - 3} more
                        </div>
                      )}
                    </div>
                  </Descriptions.Item>
                )}
              </Descriptions>
            </>
          )}

          {/* Admin Feedback */}
          {reportData.adminFeedback && (
            <>
              <Divider>Admin Feedback</Divider>
              <div style={{ 
                padding: 16, 
                backgroundColor: '#e6f7ff', 
                borderRadius: 6,
                border: '1px solid #91d5ff'
              }}>
                <Text>{safeRender(reportData.adminFeedback, 'No feedback provided')}</Text>
              </div>
            </>
          )}
        </div>
      )}
    </Modal>
  );
};

export default ReportDetailModal;
