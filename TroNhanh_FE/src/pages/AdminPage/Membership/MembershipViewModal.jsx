import React from "react";
import { Modal, Tag, Divider, Typography } from "antd";

const { Text, Title } = Typography;

const MembershipViewModal = ({ open, onCancel, record }) => (
  <Modal 
    open={open} 
    onCancel={onCancel} 
    footer={null} 
    title="Membership Package Details" 
    width={600}
  >
    {record && (
      <div style={{ padding: "8px 0" }}>
        <Title level={4} style={{ marginBottom: 16, color: "#1890ff" }}>
          {record.packageName || record.name}
        </Title>
        
        <div style={{ marginBottom: 16 }}>
          <Text strong>Package ID: </Text>
          <Text code>{record._id || record.id}</Text>
        </div>

        <Divider style={{ margin: "16px 0" }} />

        <div style={{ marginBottom: 12 }}>
          <Text strong>Price: </Text>
          <Text style={{ fontSize: 16, color: "#fa8c16" }}>
            {record.price > 0 ? record.price?.toLocaleString() + " VNĐ" : "Miễn phí"}
          </Text>
        </div>

        <div style={{ marginBottom: 12 }}>
          <Text strong>Duration: </Text>
          <Text>{record.duration} days</Text>
        </div>

        <div style={{ marginBottom: 12 }}>
          <Text strong>Posts Allowed: </Text>
          <Text style={{ color: "#1890ff" }}>
            {record.postsAllowed || record.postLimit}
          </Text>
        </div>

        <div style={{ marginBottom: 12 }}>
          <Text strong>Description: </Text>
          <Text>{record.description || <span style={{ color: "#aaa" }}>No description</span>}</Text>
        </div>

        {(record.features && record.features.length > 0) && (
          <div style={{ marginBottom: 12 }}>
            <Text strong>Features: </Text>
            <Text>
              {Array.isArray(record.features) 
                ? record.features.join(", ") 
                : record.features}
            </Text>
          </div>
        )}

        <Divider style={{ margin: "16px 0" }} />

        <div style={{ marginBottom: 12 }}>
          <Text strong>Status: </Text>
          <Tag color={(record.isActive !== undefined ? record.isActive : record.status === "active") ? "green" : "default"}>
            {(record.isActive !== undefined ? record.isActive : record.status === "active") ? "Active" : "Inactive"}
          </Tag>
        </div>

        {record.inUse && (
          <div style={{ marginBottom: 12 }}>
            <Text strong>Usage Status: </Text>
            <Tag color="blue">Currently in use</Tag>
          </div>
        )}

        {record.createdAt && (
          <div style={{ marginBottom: 12 }}>
            <Text strong>Created: </Text>
            <Text type="secondary">
              {new Date(record.createdAt).toLocaleDateString("vi-VN", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit"
              })}
            </Text>
          </div>
        )}

        {record.updatedAt && record.updatedAt !== record.createdAt && (
          <div style={{ marginBottom: 12 }}>
            <Text strong>Last Updated: </Text>
            <Text type="secondary">
              {new Date(record.updatedAt).toLocaleDateString("vi-VN", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit"
              })}
            </Text>
          </div>
        )}
      </div>
    )}
  </Modal>
);

export default MembershipViewModal;