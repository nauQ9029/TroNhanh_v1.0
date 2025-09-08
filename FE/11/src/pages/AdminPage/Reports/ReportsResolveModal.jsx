import React from "react";
import { Modal, Form, Input, Card, Avatar, Typography, Tag, Radio } from "antd";
import { UserOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { Title, Text } = Typography;

const ReportsResolveModal = ({ open, onCancel, onOk, form, record, confirmLoading }) => {
  // Helper function to safely render values
  const safeRender = (value, fallback = 'N/A') => {
    if (value === null || value === undefined) return fallback;
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return value.toString();
    if (typeof value === 'object') return JSON.stringify(value);
    return fallback;
  };

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      onOk={onOk}
      title="Resolve Report"
      okText="Resolve"
      cancelText="Cancel"
      confirmLoading={confirmLoading}
      width={700}
    >
      {record && (
        <div style={{ marginBottom: 24 }}>
          <Card size="small" title="Report Information">
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
              <Avatar 
                src={record.reporter?.avatar} 
                icon={<UserOutlined />}
                style={{ backgroundColor: '#1890ff' }}
              >
                {record.reporter?.name?.charAt(0)}
              </Avatar>
              <div>
                <Title level={5} style={{ margin: 0 }}>
                  {record.reporter?.name || 'No name'}
                </Title>
                <Text type="secondary">{record.reporter?.email}</Text>
              </div>
            </div>
            
            <div style={{ marginBottom: 12 }}>
              <Text strong>Content: </Text>
              <Text>{safeRender(record.content, 'No content')}</Text>
            </div>
            
            <div style={{ marginBottom: 12 }}>
              <Text strong>Type: </Text>
              <Tag color="blue">{record.type}</Tag>
            </div>
            
            <div style={{ marginBottom: 12 }}>
              <Text strong>Created Date: </Text>
              <Text>{dayjs(record.createAt).format('DD/MM/YYYY HH:mm')}</Text>
            </div>

            {record.reportedUser && (
              <div>
                <Text strong>Reported User: </Text>
                <Text>{record.reportedUser.name} ({record.reportedUser.email})</Text>
              </div>
            )}
          </Card>
        </div>
      )}
      
      <Form form={form} layout="vertical">
        <Form.Item
          name="action"
          label="Resolution Action"
          rules={[{ required: true, message: "Please select an action." }]}
          initialValue="approve"
        >
          <Radio.Group>
            <Radio value="approve">Approve Report</Radio>
            <Radio value="reject">Reject Report</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          name="adminFeedback"
          label="Admin Feedback"
          rules={[{ required: true, message: "Please provide feedback." }]}
        >
          <Input.TextArea 
            rows={4} 
            placeholder="Enter your feedback and explanation for this resolution..." 
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ReportsResolveModal;