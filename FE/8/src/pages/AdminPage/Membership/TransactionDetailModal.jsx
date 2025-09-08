import React from "react";
import { Modal, Tag, Divider, Typography, Row, Col, Card } from "antd";

const { Text, Title } = Typography;

const TransactionDetailModal = ({ open, onCancel, record }) => (
  <Modal 
    open={open} 
    onCancel={onCancel} 
    footer={null} 
    title="Transaction Details" 
    width={700}
  >
    {record && (
      <div style={{ padding: "8px 0" }}>
        <Title level={4} style={{ marginBottom: 16, color: "#1890ff" }}>
          Transaction #{record.transactionId}
        </Title>
        
        <Row gutter={16}>
          <Col span={12}>
            <Card size="small" title="Transaction Info" style={{ marginBottom: 16 }}>
              <div style={{ marginBottom: 8 }}>
                <Text strong>Date: </Text>
                <Text>{new Date(record.date || record.createdAt).toLocaleDateString("vi-VN", {
                  year: "numeric",
                  month: "long", 
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit"
                })}</Text>
              </div>
              
              <div style={{ marginBottom: 8 }}>
                <Text strong>Type: </Text>
                <Text>{record.transactionType || record.type}</Text>
              </div>
              
              <div style={{ marginBottom: 8 }}>
                <Text strong>Amount: </Text>
                <Text style={{ fontSize: 16, color: "#fa8c16", fontWeight: 600 }}>
                  {record.amount?.toLocaleString()} VNĐ
                </Text>
              </div>
              
              <div style={{ marginBottom: 8 }}>
                <Text strong>Status: </Text>
                <Tag color={
                  record.status === "success" || record.status === "Paid" ? "green" : 
                  record.status === "failed" || record.status === "Failed" ? "red" : 
                  record.status === "pending" || record.status === "Pending" ? "orange" : "default"
                }>
                  {record.status?.toUpperCase()}
                </Tag>
              </div>
            </Card>
          </Col>
          
          <Col span={12}>
            <Card size="small" title="Parties Involved" style={{ marginBottom: 16 }}>
              <div style={{ marginBottom: 12 }}>
                <Text strong>Sender:</Text>
                <div style={{ marginLeft: 16, marginTop: 4 }}>
                  <div><Text>{record.sender?.name || record.sender}</Text></div>
                  {record.sender?.email && (
                    <div><Text type="secondary">{record.sender.email}</Text></div>
                  )}
                  {record.sender?.phone && (
                    <div><Text type="secondary">{record.sender.phone}</Text></div>
                  )}
                  {record.sender?.role && (
                    <div><Tag size="small">{record.sender.role}</Tag></div>
                  )}
                </div>
              </div>
              
              <div>
                <Text strong>Receiver:</Text>
                <div style={{ marginLeft: 16, marginTop: 4 }}>
                  <Text>{record.receiver}</Text>
                </div>
              </div>
            </Card>
          </Col>
        </Row>

        {record.membershipPackage && (
          <Card size="small" title="Membership Package Details" style={{ marginBottom: 16 }}>
            <Row gutter={16}>
              <Col span={8}>
                <Text strong>Package: </Text>
                <Text style={{ color: "#1890ff" }}>{record.membershipPackage.packageName}</Text>
              </Col>
              <Col span={8}>
                <Text strong>Price: </Text>
                <Text>{record.membershipPackage.price?.toLocaleString()} VNĐ</Text>
              </Col>
              <Col span={8}>
                <Text strong>Duration: </Text>
                <Text>{record.membershipPackage.duration} days</Text>
              </Col>
            </Row>
          </Card>
        )}

        {(record.title || record.description) && (
          <Card size="small" title="Additional Information" style={{ marginBottom: 16 }}>
            {record.title && (
              <div style={{ marginBottom: 8 }}>
                <Text strong>Title: </Text>
                <Text>{record.title}</Text>
              </div>
            )}
            {record.description && (
              <div>
                <Text strong>Description: </Text>
                <Text>{record.description}</Text>
              </div>
            )}
          </Card>
        )}

        <Divider style={{ margin: "16px 0" }} />
        
        <div style={{ textAlign: "center" }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Transaction ID: {record.transactionId || record.vnpayTransactionId || record._id}
          </Text>
        </div>
      </div>
    )}
  </Modal>
);

export default TransactionDetailModal;