// Folder: OwnerPage/Components/layout.jsx
import { useState, useEffect } from "react";
import { Layout, Row, Col, Drawer, Button } from "antd";
import { Outlet } from "react-router-dom";
import { MenuOutlined } from "@ant-design/icons";
import Sidebar from "../sidebar/sidebar"; 
import "./layout.css";

const { Content } = Layout;

const OwnerLayout = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Cập nhật khi resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Layout>

      <Content>
        <div className="profile-wrapper-owner">
          <Row>
            {isMobile && (
              <Col xs={24}>
                <Button
                  icon={<MenuOutlined />}
                  onClick={() => setDrawerVisible(true)}
                  style={{ marginBottom: 16, border: "none" }}
                >
                  Menu
                </Button>
              </Col>
            )}
          </Row>

          {/* Drawer cho mobile */}
          <Drawer
            title="Menu"
            placement="left"
            width={280}
            onClose={() => setDrawerVisible(false)}
            open={drawerVisible}
          >
            <Sidebar />
          </Drawer>

          <div className="profile-layout-owner">
            {/* 👇 Chỉ render Sidebar nếu không phải mobile */}
            {!isMobile && (
              <aside className="profile-sidebar-owner">
                <Sidebar />
              </aside>
            )}

            <main className="profile-content-owner">
              <div className="owner-container-owner">
                <Outlet />
              </div>
            </main>
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default OwnerLayout;