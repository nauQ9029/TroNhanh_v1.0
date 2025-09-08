import React from 'react';
import { Avatar, Tag, Space } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const UserDetailsModal = ({ user }) => {
  if (!user) return null;

  return (
    <div className="text-center">
      <Avatar
        size={150}
        src={user.avatarUrl}
        icon={<UserOutlined />}
        style={{
          display: 'block',
          margin: '0 auto 20px',
          border: '3px solid #1890ff'
        }}
      />
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '15px',
        textAlign: 'left',
        padding: '0 30px'
      }}>
        <div>
          <h4 className="mb-2">Personal Information</h4>
          <p><strong>Full Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Phone:</strong> {user.phoneNumber || 'N/A'}</p>
          <p><strong>Date of Birth:</strong> {user.dob || 'N/A'}</p>
          <p><strong>Gender:</strong> {user.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : 'N/A'}</p>
        </div>

        <div style={{ marginLeft: 20 }}>
          <h4 className="mb-2">Account Details</h4>
          <p>
            <strong>Account:</strong>
            <Tag
              color={user.status === 'banned' ? 'red' : user.status === 'inactive' ? 'volcano' : 'green'}
              style={{ marginLeft: 8 }}
            >
              {user.status === 'banned' ? 'Locked' : user.status === 'inactive' ? 'Deleted' : 'Active'}
            </Tag>
          </p>
          {/* Show membership status only for User and Owner roles */}
          {user.roles?.some(role => role.name === "Owner" || role.name === "User") && (
            <p>
              <strong>Membership:</strong>
              <Tag
                color={user.isMembership ? 'green' : 'orange'}
                style={{ marginLeft: 8 }}
              >
                {user.isMembership ? 'Active' : 'None'}
              </Tag>
            </p>
          )}
          <p>
            <strong>Roles:</strong>
            <Space>
              {user.roles?.map(role => (
                <Tag style={{ marginLeft: 14 }}
                  key={role.id} color={role.name === "Owner" ? "purple" : "blue"}
                >
                  {role.name}
                </Tag>
              ))}
            </Space>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;