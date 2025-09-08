import React from "react";
import { Card, Row, Col, Tag, Button, Space, Popconfirm, Typography, Tooltip, Divider } from "antd";
import { EyeOutlined, EditOutlined, DeleteOutlined, CrownFilled } from "@ant-design/icons";

const { Title, Text } = Typography;

const colorMap = {
  Gold: "#FFD700",
  Silver: "#C0C0C0",
  Bronze: "#CD7F32",
  Premium: "#722ed1",
  Free: "#aaa",
};

const MembershipCardList = ({ data, onView, onEdit, onDelete }) => (
  <Row gutter={[32, 32]} style={{ marginTop: 8 }}>
    {data.map(pkg => (
      <Col xs={24} sm={12} md={8} lg={6} key={pkg.id}>
        <Card
          bordered
          style={{
            minHeight: 340,
            borderRadius: 16,
            boxShadow: "0 4px 24px 0 rgba(0,0,0,0.07)",
            background: "#fff",
            position: "relative",
            overflow: "hidden",
          }}
          bodyStyle={{ padding: 24 }}
          title={
            <Space align="center">
              {["Gold", "Silver", "Bronze", "Premium"].includes(pkg.name) && (
                <CrownFilled style={{ color: colorMap[pkg.name], fontSize: 22, marginRight: 4 }} />
              )}
              <Title level={4} style={{ margin: 0, color: colorMap[pkg.name] || "#333" }}>
                {pkg.name}
              </Title>
              <Tag color={pkg.status === "active" ? "green" : "default"} style={{ marginLeft: 8 }}>
                {pkg.status === "active" ? "Active" : "Inactive"}
              </Tag>
            </Space>
          }

        >
            <Space>
              <Tooltip title="View details">
                <Button
                  icon={<EyeOutlined />}
                  style={{ border: 'none', display: 'inline-block' }}
                  onClick={() => onView(pkg)}
                />
              </Tooltip>
              <Tooltip title="Edit package">
                <Button
                  icon={<EditOutlined />}
                  style={{ border: 'none', display: 'inline-block' }}
                  onClick={() => onEdit(pkg)}
                />
              </Tooltip>
              <Popconfirm
                title="Bạn chắc chắn muốn xóa?"
                onConfirm={() => onDelete(pkg)}
                okText="Xóa"
                cancelText="Hủy"
                disabled={pkg.inUse}
              >
                <Tooltip title={pkg.inUse ? "Không thể xóa gói đang sử dụng" : "Delete package"}>
                  <Button
                    icon={<DeleteOutlined />}
                    style={{ border: 'none', display: 'inline-block' }}
                    danger
                    disabled={pkg.inUse}
                  />
                </Tooltip>
              </Popconfirm>
            </Space>

          <Divider style={{ margin: "8px 0 16px 0" }} />
          <div style={{ marginBottom: 12 }}>
            <Text strong style={{ fontSize: 20, color: "#fa8c16" }}>
              {pkg.price > 0 ? pkg.price.toLocaleString() + " VNĐ" : "Miễn phí"}
            </Text>
            <Text type="secondary" style={{ marginLeft: 8 }}>
              / {pkg.duration} ngày
            </Text>
          </div>
          <div style={{ marginBottom: 8 }}>
            <Text>
              <b>Số bài đăng:</b> <span style={{ color: "#1890ff" }}>{pkg.postLimit}</span>
            </Text>
          </div>
          <div style={{ marginBottom: 8 }}>
            <Text>
              <b>Mô tả:</b> {pkg.description || <span style={{ color: "#aaa" }}>Không có</span>}
            </Text>
          </div>
          {pkg.inUse && (
            <Tag color="blue" style={{ marginTop: 8 }}>
              Đang được sử dụng
            </Tag>
          )}
        </Card>
      </Col>
    ))}
  </Row>
);

export default MembershipCardList;