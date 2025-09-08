import React, { useState } from 'react';
import { Form, Input, Button, Typography, message as antMessage } from 'antd';
import { forgotPassword } from '../../../services/authService';

const { Title } = Typography;

const ForgotPasswordPage = () => {
  const [loading, setLoading] = useState(false);
const [messageApi, contextHolder] = antMessage.useMessage();
  const onFinish = async (values) => {
    try {
      setLoading(true);
      const res = await forgotPassword({ email: values.email });
      messageApi.success(res.data.message);
    } catch (err) {
      console.error(err);
      messageApi.error(err.response?.data?.message || "Failed to send email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "50px auto" }}>
      {contextHolder}
      <Title level={3}>Forgot Password</Title>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please enter your email!" },
            { type: "email", message: "Invalid email!" },
          ]}
        >
          <Input placeholder="Enter your email" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Send Reset Link
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ForgotPasswordPage;