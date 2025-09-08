import React, { useMemo } from "react";
import { Card, Statistic, Row, Col, Progress } from "antd";
import { UserOutlined, TeamOutlined, LockOutlined } from "@ant-design/icons";

const UserStatsDashboard = ({ users }) => {
  // Tính toán thống kê dựa trên dữ liệu tĩnh truyền vào
  const stats = useMemo(() => {
    const total = users.length;
    const activeUsers = users.filter((user) => !user.isLocked).length;
    const lockedAccounts = users.filter((user) => user.isLocked).length;
    return {
      total,
      activeUsers,
      lockedAccounts,
    };
  }, [users]);

  return (
    <Card style={{ marginBottom: 8 }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ border: "none" }}>
            <Statistic
              title="Total Users"
              value={stats.total}
              prefix={<TeamOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ border: "none" }}>
            <Statistic
              title="Active Users"
              value={stats.activeUsers}
              suffix={`/ ${stats.total}`}
              prefix={<UserOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
            <Progress
              percent={stats.total ? Math.round((stats.activeUsers / stats.total) * 100) : 0}
              showInfo={false}
              strokeColor="#52c41a"
              trailColor="#f5f5f5"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ border: "none" }}>
            <Statistic
              title="Locked Accounts"
              value={stats.lockedAccounts}
              suffix={`/ ${stats.total}`}
              prefix={<LockOutlined />}
              valueStyle={{ color: "#ff4d4f" }}
            />
            <Progress
              percent={stats.total ? Math.round((stats.lockedAccounts / stats.total) * 100) : 0}
              showInfo={false}
              strokeColor="#ff4d4f"
              trailColor="#f5f5f5"
            />
          </Card>
        </Col>
      </Row>
    </Card>
  );
};

export default UserStatsDashboard;