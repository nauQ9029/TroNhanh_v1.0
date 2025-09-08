import React, { useState } from 'react';
import { Table, Tag, Avatar, Space, Button, Modal } from 'antd';
import { UserOutlined, EyeOutlined, EditOutlined, LockOutlined, UnlockOutlined, WalletOutlined } from '@ant-design/icons';
import UserStatsDashboard from './UserStatsDashboard';
import UserDetailsModal from './UserDetailsModal';
import UserEditModal from './UserEditModal';
import UserSearch from "./UserSearch";

const DemoUsers = [
  {
    id: 1,
    avatarUrl: '',
    fullName: 'Nguyen Van A',
    email: 'NVA@gmail.com',
    dob: '1990-01-01',
    phoneNumber: '0123456789',
    gender: 'male',
    roles: [{ id: 1, name: 'Owner' }],
    isLocked: false,
    membership: 'active',
  },
  {
    id: 2,
    avatarUrl: '',
    fullName: 'Nguyen Van B',
    email: 'NVB@gmail.com',
    dob: '1990-01-01',
    phoneNumber: '0987654321',
    gender: 'female',
    roles: [{ id: 1, name: 'User' }],
    isLocked: false,
    membership: 'none',
  },
  {
    id: 3,
    avatarUrl: '',
    fullName: 'Nguyen Van C',
    email: 'NVC@gmail.com',
    dob: '1990-01-01',
    phoneNumber: '0123456789',
    gender: 'other',
    roles: [{ id: 1, name: 'Owner' }],
    isLocked: true,
    membership: 'none',
  },
  {
    id: 4,
    avatarUrl: '',
    fullName: 'Nguyen Van D',
    email: 'NVD@gmail.com',
    dob: '1990-01-01',
    phoneNumber: '0987654321',
    gender: 'male',
    roles: [{ id: 1, name: 'User' }],
    isLocked: false,
    membership: 'none',
  },
];

const Users = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalType, setModalType] = useState(null); // 'view' | 'edit' | null
  const [users, setUsers] = useState(DemoUsers);

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setModalType('view');
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setModalType('edit');
  };

  const handleSaveUser = (updatedUser) => {
    setUsers(prev =>
      prev.map(u => (u.id === updatedUser.id ? updatedUser : u))
    );
    setModalType(null);
  };

  const handleCloseModal = () => {
    setModalType(null);
    setSelectedUser(null);
  };

  const columns = [
    {
      title: 'Avatar',
      dataIndex: 'avatarUrl',
      key: 'avatarUrl',
      render: (avatarUrl) => (
        <Avatar src={avatarUrl} icon={<UserOutlined />} />
      ),
    },
    {
      title: 'Full Name',
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
      render: (gender) => {
        let color = 'default';
        if (gender === 'male') color = 'blue';
        else if (gender === 'female') color = 'magenta';
        else if (gender === 'other') color = 'purple';
        return <Tag color={color}>{gender?.charAt(0).toUpperCase() + gender?.slice(1) || 'N/A'}</Tag>;
      },
    },
    {
      title: 'Roles',
      dataIndex: 'roles',
      key: 'roles',
      render: (roles) => (
        <Space>
          {roles?.map(role => (
            <Tag key={role.id} color={role.name === 'Owner' ? 'purple' : 'blue'}>
              {role.name}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <Tag color={record.isLocked ? 'red' : 'green'}>
            Account: {record.isLocked ? 'Locked' : 'Active'}
          </Tag>
          {record.roles.some(role => role.name === 'Owner') && (
            <Tag color={record.membership === 'active' ? 'green' : 'default'}>
              Membership: {record.membership === 'active' ? 'Active' : 'None'}
            </Tag>
          )}
        </Space>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            style={{ border: 'none', display: 'inline-block' }}
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record)}
            title="View Details"
          />
          <Button
            style={{ border: 'none', display: 'inline-block' }}
            icon={<EditOutlined />}
            onClick={() => handleEditUser(record)}
            title="Edit User"
          />
          <Button
            style={{ border: 'none', display: 'inline-block' }}
            icon={!record.isLocked ? <LockOutlined /> : <UnlockOutlined style={{ color: "blue" }} />}
            title={!record.isLocked ? "Lock Account" : "Unlock Account"}
            danger={!record.isLocked}
          />
        </Space>
      ),
    }
  ];


  const [filters, setFilters] = useState({
    fullName: "",
    email: "",
    gender: undefined,
    role: undefined,
  });
  const roleOptions = ["Owner", "User", "Admin"];

  const filteredUsers = users.filter(u =>
    (!filters.fullName || u.fullName.toLowerCase().includes(filters.fullName.toLowerCase())) &&
    (!filters.email || u.email.toLowerCase().includes(filters.email.toLowerCase())) &&
    (!filters.gender || u.gender === filters.gender) &&
    (!filters.role || u.roles.some(r => r.name === filters.role))
  );


  return (
    <>
      <h1>User Management</h1>
      <UserStatsDashboard users={users} />
      <UserSearch filters={filters} setFilters={setFilters} roleOptions={roleOptions} />
      <Table
        dataSource={filteredUsers}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        scroll={{ x: 'max-content' }}
      />
      <Modal
        open={modalType === 'view'}
        onCancel={handleCloseModal}
        footer={null}
        title="User Profile Details"
        width={600}
      >
        <UserDetailsModal user={selectedUser} />
      </Modal>
      <Modal
        open={modalType === 'edit'}
        onCancel={handleCloseModal}
        footer={null}
        title="Edit User"
        width={600}
      >
        <UserEditModal
          user={selectedUser}
          onClose={handleCloseModal}
          onSave={handleSaveUser}
        />
      </Modal>
    </>
  );
};

export default Users;