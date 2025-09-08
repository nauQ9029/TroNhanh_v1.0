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

  return (
    <div className="owner-sidebar">
      <div className="owner-info">
        <Avatar size={64} icon={<UserOutlined />} />
        <Title level={5} style={{ marginTop: 10 }}>Tên Owner</Title>
        <Text>Ownergmail.com</Text>
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
        <Menu.Item key="communication" icon={<MessageOutlined />}>
          <Link to="/owner/communication">Communication</Link>
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
