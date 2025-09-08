import React, { useState } from "react";
import {
  Table,
  Input,
  Select,
  Button,
  Card,
  Avatar,
  Tag,
  Space,
  Row,
  Col,
} from "antd";
import {
  UserOutlined,
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  LockOutlined,
  UnlockOutlined,
  UserAddOutlined,
  ExportOutlined,
  WalletOutlined
} from "@ant-design/icons";

import UserStatsDashboard from "./UserStatsDashboard";

const staticUsers = [
  {
    id: 1,
    avatarUrl: "",
    fullName: "Nguyen Van A",
    email: "a@gmail.com",
    gender: { name: "Male" },
    roles: [{ id: 1, name: "Owner" }],
    isLocked: false,
    membership: "active",
  },
  {
    id: 2,
    avatarUrl: "",
    fullName: "Tran Thi B",
    email: "b@gmail.com",
    gender: { name: "Female" },
    roles: [{ id: 2, name: "User" }],
    isLocked: true,
    membership: "none",
  },
  {
    id: 3,
    avatarUrl: "",
    fullName: "Le Van C",
    email: "c@gmail.com",
    gender: { name: "Other" },
    roles: [{ id: 3, name: "Owner" }],
    isLocked: false,
    membership: "none",
  },
];

const Users = () => {
  const [filters, setFilters] = useState({
    email: "",
    fullName: "",
    genderId: null,
    role: null,
  });
  const [users, setUsers] = useState(staticUsers);

  const handleFilter = () => {
    const filtered = staticUsers.filter((user) => {
      const matchEmail = filters.email
        ? user.email.toLowerCase().includes(filters.email.toLowerCase())
        : true;
      const matchFullName = filters.fullName
        ? user.fullName.toLowerCase().includes(filters.fullName.toLowerCase())
        : true;
      const matchGender = filters.genderId
        ? user.gender?.name?.toUpperCase() === filters.genderId
        : true;
      const matchRole = filters.role
        ? user.roles.some((role) => role.name.toUpperCase() === filters.role)
        : true;
      return matchEmail && matchFullName && matchGender && matchRole;
    });
    setUsers(filtered);
  };

  const columns = [
    {
      title: "Avatar",
      dataIndex: "avatarUrl",
      render: (url) => <Avatar src={url} icon={<UserOutlined />} size={48} />,
    },
    {
      title: "Full Name",
      dataIndex: "fullName",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Gender",
      dataIndex: "gender",
      render: (gender) => <Tag color="cyan">{gender?.name || "N/A"}</Tag>,
    },
    {
      title: "Roles",
      dataIndex: "roles",
      render: (roles) => (
        <Space>
          {roles.map((role) => (
            <Tag key={role.id} color={role.name === "Owner" ? "purple" : "blue"}>
              {role.name}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: "Status",
      render: (_, record) => (
        <Space direction="vertical" size={4}>
          <Tag color={record.isLocked ? "red" : "green"}>
            Account: {record.isLocked ? "Locked" : "Active"}
          </Tag>
          {record.roles.some((role) => role.name === "Owner") && (
            <Tag color={record.membership === "active" ? "green" : "default"}>
              Membership: {record.membership === "active" ? "Active" : "None"}
            </Tag>
          )}

        </Space>
      ),
    },
    {
      title: "Actions",
      render: (_, record) => (
        <Space>
          <Button
            style={{ border: 'none' }}
            icon={<EyeOutlined />}
            // onClick={() => handleViewDetails(record)}
            title="View Details"
          />
          <Button
            style={{ border: 'none' }}
            icon={<EditOutlined />}
            // onClick={() => handleEditUser(record)}
            title="Edit User"
          />
          <Button
            style={{ border: 'none' }}
            icon={!record.isLocked ? <LockOutlined /> : <UnlockOutlined style={{ color: "blue" }} />}
            // onClick={() => handleAccountAction(record)}
            title={!record.isLocked ? "Lock Account" : "Unlock Account"}
            danger={!record.isLocked}
          />
          <Button
            style={{ border: 'none' }}
            icon={!record.wallet?.isLocked ? <WalletOutlined style={{ color: "red" }} /> : <WalletOutlined style={{ color: "blue" }} />}
            // onClick={() => handleWalletAction(record)}
            title={record.wallet?.isLocked ? "Unlock Wallet" : "Lock Wallet"}
            danger={!record.wallet?.isLocked}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="page-container">
      <UserStatsDashboard users={users} />

      <Card style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]} wrap>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Input
              placeholder="Email"
              value={filters.email}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, email: e.target.value }))
              }
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Input
              placeholder="Full Name"
              value={filters.fullName}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, fullName: e.target.value }))
              }
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={4}>
            <Select
              placeholder="Gender"
              allowClear
              style={{ width: "100%" }}
              onChange={(value) =>
                setFilters((prev) => ({ ...prev, genderId: value }))
              }
            >
              <Select.Option value="MALE">Male</Select.Option>
              <Select.Option value="FEMALE">Female</Select.Option>
              <Select.Option value="OTHER">Other</Select.Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8} lg={4}>
            <Select
              placeholder="Role"
              allowClear
              style={{ width: "100%" }}
              onChange={(value) =>
                setFilters((prev) => ({ ...prev, role: value }))
              }
            >
              <Select.Option value="OWNER">Owner</Select.Option>
              <Select.Option value="USER">User</Select.Option>
            </Select>
          </Col>
          <Col xs={12} sm={12} md={8} lg={2}>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={handleFilter}
              block
            >
              Filter
            </Button>
          </Col>
          <Col xs={12} sm={12} md={8} lg={2}>
            <Button icon={<ExportOutlined />} block>
              Export
            </Button>
          </Col>
          <Col xs={24} sm={24} md={8} lg={4}>
            <Button
              type="primary"
              icon={<UserAddOutlined />}
              block
              onClick={() => console.log("Add Owner")}
            >
              Add Owner
            </Button>
          </Col>
        </Row>
      </Card>

      <Table
        columns={columns}
        dataSource={users}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />

    </div>


  );
};

export default Users;
