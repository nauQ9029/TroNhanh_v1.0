import { Layout } from "antd";

const { Content } = Layout;

const LayoutCus = ({ children }) => {
  return (
    <Layout>
      <Content style={{padding: "70px", minHeight: "80vh" }}>
        <div
          style={{
            maxWidth: "1500px",
            margin: "0 auto",
            padding: "0 16px",
          }}
        >
          {children}
        </div>
      </Content>
    </Layout>
  );
};

export default LayoutCus;
