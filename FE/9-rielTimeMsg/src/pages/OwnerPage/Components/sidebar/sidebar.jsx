// Folder: OwnerPage/Components/sidebar.jsx
import React from "react";
import { Menu, Avatar, Typography } from "antd";
import {
  FileTextOutlined,
  UserOutlined,
  HomeOutlined,
  MessageOutlined,
  StarOutlined,
  CreditCardOutlined,
  LogoutOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import "./sidebar.css";

const { Title, Text } = Typography;

const Sidebar = () => {
  const location = useLocation();
  const selectedKey = location.pathname.split("/")[2]; // e.g. 'profile'
  // ✅ Lấy thông tin user từ localStorage
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const name = user.name || "Tên Owner";
  const email = user.email || "Owner@gmail.com";
  return (
    <div className="owner-sidebar">
      <div className="owner-info">
        <Avatar
          size={64}
          src={user.avatar || null}
          style={{
            fontSize: 28,
            color: 'white',
            background: user.avatar
              ? 'transparent'
              : 'linear-gradient(to right, #064749, #c4f7d8)',
            border: '2px solid white',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
          }}
        >
          {!user.avatar && name?.charAt(0)}
        </Avatar>

        <Title level={5} style={{ marginTop: 10 }}>{name}</Title>
        <Text>{email}</Text>
      </div>

      <Menu
        mode="inline"
        selectedKeys={[selectedKey]}
        className="owner-menu"
      >
        <Menu.Item key="report" icon={<FileTextOutlined />}>
          <Link to="/owner/report">Report</Link>
        </Menu.Item>
        <Menu.Item key="profile" icon={<UserOutlined />}>
          <Link to="/owner/profile">Profile</Link>
        </Menu.Item>
        <Menu.Item key="accommodation" icon={<HomeOutlined />}>
          <Link to="/owner/accommodation">Manage Accommodation</Link>
        </Menu.Item>
        <Menu.Item key="cancellation" icon={<WarningOutlined />}>
          <Link to="/owner/cancellation">Cancellation</Link>
        </Menu.Item>

        <Menu.Item key="rating" icon={<StarOutlined />}>
          <Link to="/owner/rating">Rating</Link>
        </Menu.Item>
        <Menu.Item key="membership" icon={<CreditCardOutlined />}>
          <Link to="/owner/membership">Membership</Link>
        </Menu.Item>
        <Menu.Item key="logout" icon={<LogoutOutlined />}>
          <Link to="/logout">Log Out</Link>
        </Menu.Item>
      </Menu>
    </div>
  );
};

export default Sidebar;
