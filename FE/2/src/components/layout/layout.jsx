import { useState, useEffect } from "react";
import { Layout, Row, Col, Drawer, Button } from "antd";
import { Outlet } from "react-router-dom";
import { MenuOutlined } from "@ant-design/icons";
import AdminSidebar from "../sidebar/sidebar";
import Dashboard from "../../pages/AdminPage/Dashboard/dashboard";
import "./layout.css";

const { Content } = Layout;

const AdminPage = () => {
    const [drawerVisible, setDrawerVisible] = useState(false);

    return (
        <Content>
            <div className="profile-wrapper">
                <Row>
                    <Col xs={24} md={0}>
                        <Button
                            icon={<MenuOutlined />}
                            onClick={() => setDrawerVisible(true)}
                            style={{ marginBottom: 16, border: "none" }}
                        >
                            Menu
                        </Button>
                    </Col>
                </Row>

                {/* Mobile Drawer */}
                <Drawer title="Menu" placement="left" width={280} onClose={() => setDrawerVisible(false)} open={drawerVisible}>
                    <AdminSidebar />
                </Drawer>

                {/* Main Content */}
                <div className="profile-layout">
                    <aside className="profile-sidebar">
                        <Col xs={0} sm={24}>
                            <AdminSidebar />
                        </Col>
                    </aside>

                    <main className="profile-content">
                        <div className="admin-container">
                            <Outlet />
                        </div>
                    </main>
                </div>
            </div>
            
        </Content>
    );
};

export default AdminPage;
