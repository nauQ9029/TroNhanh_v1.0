import { Layout } from "antd";
import { Outlet } from "react-router-dom";

const { Content } = Layout;

const LayoutCus = () => {
  return (
    <Layout>
      <Content style={{ minHeight: "80vh" }}>
        <div
          style={{
            maxWidth: "1500px",
            margin: "0 auto",
            padding: "0 16px",
          }}
        >
          <Outlet />
        </div>
      </Content>
    </Layout>
  );
};

export default LayoutCus;
