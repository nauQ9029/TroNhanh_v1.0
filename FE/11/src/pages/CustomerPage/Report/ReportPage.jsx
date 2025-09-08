import React, { useEffect, useState } from "react";
import {
  Typography,
  Form,
  Input,
  Button,
  Select,
  message as antMessage,
  Spin,
  Card,
  Alert,
} from "antd";
import { createReport } from "../../../services/reportService";
import useUser from "../../../contexts/UserContext";
import { ExclamationCircleOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { getOwner } from "../../../services/reportService"; 

const { Title, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const ReportPage = () => {
  const [form] = Form.useForm();
  const { user, loading: userLoading } = useUser();
  const [messageApi, contextHolder] = antMessage.useMessage();
  const [submitting, setSubmitting] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getOwner(); 
        setUsers(res.data.filter((u) => u._id !== user?._id));
      } catch (error) {
        console.error("❌ Failed to fetch users", error);
      }
    };
    if (user) fetchUsers();
  }, [user]);

  const onFinish = async (values) => {
    try {
      setSubmitting(true);
      const payload = {
        ...values,
        reporterId: user?._id,
      };

      console.log("✔️ Payload sent:", payload);
      await createReport(payload);
      messageApi.open({
        type: "success",
        content: "Report submitted successfully!",
        icon: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
      });
      form.resetFields();
    } catch (error) {
      console.error("❌ Report submission failed:", error);
      messageApi.error(error?.response?.data?.message || "Failed to submit report.");
    } finally {
      setSubmitting(false);
    }
  };

  if (userLoading) {
    return (
      <div style={{ textAlign: "center", marginTop: 50 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ textAlign: "center", marginTop: 50 }}>
        <Title level={4}>Please log in to submit a report.</Title>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 650, margin: "0 auto", padding: 24, background: "#f9f9f9", minHeight: "100vh" }}>
      {contextHolder}
      <Card bordered={false} style={{ background: "#fff", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", borderRadius: 8 }}>
        <Title level={2} style={{ textAlign: "center", marginBottom: 0 }}>
          Submit a Report to Administrator
        </Title>

        <Paragraph style={{ textAlign: "center", color: "#888", marginBottom: 24 }}>
          If you encounter issues such as fraud, fake listings, or abusive landlords, please submit a report.
        </Paragraph>

        <Alert
          type="info"
          showIcon
          message={
            <span>
              <ExclamationCircleOutlined style={{ marginRight: 8 }} />
              Your report is <b>confidential</b> and only visible to administrators.
            </span>
          }
          style={{ marginBottom: 24 }}
        />

        <Form form={form} layout="vertical" onFinish={onFinish}>
          {/* NGƯỜI BỊ BÁO CÁO */}
          <Form.Item
  label="Reported User"
  name="reportedUserId"
  rules={[{ required: true, message: "Please select a user to report." }]}
>
  <Select
    showSearch
    placeholder="Select user to report"
    filterOption={(input, option) =>
      option.children.toLowerCase().includes(input.toLowerCase())
    }
  >
    {users.map((u) => (
      <Option key={u._id} value={u._id}>
        {u.name || u.email}
      </Option>
    ))}
  </Select>
</Form.Item>

          {/* LOẠI BÁO CÁO */}
          <Form.Item
            label="Report Category"
            name="type"
            rules={[{ required: true, message: "Please select a report category." }]}
          >
            <Select placeholder="Select report category">
              <Option value="Landlord Complaint">Landlord Complaint</Option>
              <Option value="Fake Listing">Fake Listing</Option>
              <Option value="Scam Behavior">Scam Behavior</Option>
              <Option value="Other">Other</Option>
            </Select>
          </Form.Item>

          {/* NỘI DUNG */}
          <Form.Item
            label="Report Details"
            name="content"
            rules={[{ required: true, message: "Please enter your report details." }]}
          >
            <TextArea rows={4} placeholder="Describe the issue you encountered..." />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={submitting}>
              {submitting ? "Submitting..." : "Submit Report"}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ReportPage;