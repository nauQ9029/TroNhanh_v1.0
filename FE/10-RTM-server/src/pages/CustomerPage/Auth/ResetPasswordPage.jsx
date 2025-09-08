import React, { useState } from 'react';
import { Form, Input, Button, Typography, message as antMessage } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { resetPassword } from '../../../services/authService';


const { Title } = Typography;

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
const [messageApi, contextHolder] = antMessage.useMessage();
const onFinish = async (values) => {
  try {
    setLoading(true);
    const res = await resetPassword(token, { password: values.password });
    await messageApi.success(res.data.message);
    navigate('/login');
  } catch (err) {
    console.error(err);
    const errors = err.response?.data?.errors;

    if (errors && Array.isArray(errors)) {
      errors.forEach(error => {
        messageApi.error(error.msg);
      });
    } else {
      messageApi.error(err.response?.data?.message || "Failed to reset password");
    }
  } finally {
    setLoading(false);
  }
};


  return (
    <div style={{ maxWidth: 400, margin: "50px auto" }}>
        {contextHolder}
      <Title level={3}>Reset Password</Title>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="New Password"
          name="password"
          rules={[{ required: true, message: "Please enter your new password!" }]}
        >
          <Input.Password placeholder="Enter new password" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Reset Password
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ResetPasswordPage;