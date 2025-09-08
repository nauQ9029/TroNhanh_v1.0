import { Menu } from "antd"
import {
  DashboardOutlined,
  UserOutlined,
  FileTextOutlined,
  ShoppingOutlined,
  TeamOutlined,
  LogoutOutlined,
  CommentOutlined
} from "@ant-design/icons"
import { useNavigate, useLocation } from "react-router-dom"

import "./sidebar.css"

const AdminSidebar = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const items = [
    { label: "System Overview", key: "/admin/dashboard", icon: <DashboardOutlined /> },
    { label: "Users", key: "/admin/users", icon: <UserOutlined /> },
    { label: "Posts", key: "/admin/posts", icon: <FileTextOutlined /> },
    { label: "Membership", key: "/admin/membership", icon: <ShoppingOutlined /> },
    { label: "Reports", key: "/admin/reports", icon: <CommentOutlined /> },
    // { label: "Comunication", key: "/admin/communication", icon: <TeamOutlined /> },
    // { label: "Logout", key: "/admin/logout", icon: <LogoutOutlined />, },
  ]

  const handleMenuClick = (e) => {
    navigate(e.key)
  }

  return (
    <div className="admin-sidebar-container">
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        items={items}
        className="admin-sidebar-menu"
        onClick={handleMenuClick}
      />
    </div>
  )
}

export default AdminSidebar;
