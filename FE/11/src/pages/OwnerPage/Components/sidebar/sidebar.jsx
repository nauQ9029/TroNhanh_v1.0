import React from "react";
import { Menu, Avatar, Typography, message } from "antd";
import {
  FileTextOutlined,
  UserOutlined,
  HomeOutlined,
  MessageOutlined,
  StarOutlined,
  CreditCardOutlined,
  LogoutOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./sidebar.css";
import useUser from "../../../../contexts/UserContext";

const { Title, Text } = Typography;

const Sidebar = () => {
  const { user, logout } = useUser();
  const location = useLocation();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const selectedKey = location.pathname.split("/")[2];

  const name = user?.name || "Tên Owner";
  const email = user?.email || "Owner@gmail.com";

  const handleLogout = async () => {
    await messageApi.success("Logout successfully", 2);
    logout();
    navigate("/homepage");
  };

  return (
    <div className="owner-sidebar">
      {contextHolder}
      <div className="owner-info">
        <Avatar
          size={64}
          src={user?.avatar || null}
          style={{
            fontSize: 28,
            color: "white",
            background: user?.avatar
              ? "transparent"
              : "linear-gradient(to right, #064749, #c4f7d8)",
            border: "2px solid white",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
          }}
        >
          {!user?.avatar && name?.charAt(0)}
        </Avatar>

        <Title level={5} style={{ marginTop: 10 }}>{name}</Title>
        <Text>{email}</Text>
      </div>

      <Menu mode="inline" selectedKeys={[selectedKey]} className="owner-menu">
        <Menu.Item key="statistics" icon={<BarChartOutlined />}>
          <Link to="/owner/statistics">Statistics</Link>
        </Menu.Item>
        <Menu.Item key="report" icon={<FileTextOutlined />}>
          <Link to="/owner/report">Report</Link>
        </Menu.Item>
        <Menu.Item icon={<UserOutlined />}>
          <Link to="/customer/profile/personal-info">Profile</Link>
        </Menu.Item>
        <Menu.Item key="accommodation" icon={<HomeOutlined />}>
          <Link to="/owner/accommodation">Manage Accommodation</Link>
        </Menu.Item>
        <Menu.Item key="rating" icon={<StarOutlined />}>
          <Link to="/owner/rating">Rating</Link>
        </Menu.Item>
        <Menu.Item key="membership" icon={<CreditCardOutlined />}>
          <Link to="/owner/membership">Membership</Link>
        </Menu.Item>
        <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
          Log Out
        </Menu.Item>
      </Menu>
    </div>
  );
};

export default Sidebar;