import React, { useState } from 'react';
import { Form, Input, Button, Typography, message as antMessage, Card } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { verifyOTP, resendOTP } from '../../../services/authService';

const { Title, Text } = Typography;

const VerifyOtpPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = antMessage.useMessage();

  const userId = location.state?.userId;
  const email = location.state?.email;

  const onFinish = async (values) => {
    console.log('Form submitted!', values);
    console.log("userId:", userId);
    try {
      setLoading(true);
      await verifyOTP({
        userId,
        otp: values.otp
      });
      await messageApi.success('Email verified successfully. You can now log in!');
      navigate('/login');
    } catch (err) {
      console.error(err);
      messageApi.error(
        err.response?.data?.message || 'Failed to verify OTP'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      setResendLoading(true);
      await resendOTP({
        userId,
        email
      });
      messageApi.success('OTP resent successfully. Check your email!');
    } catch (err) {
      console.error(err);
      messageApi.error(
        err.response?.data?.message || 'Failed to resend OTP'
      );
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: '#f5f5f5',
      marginTop:'-80px'
    }}>
      {contextHolder}
      <Card
        style={{
          width: 400,
          padding: '24px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        }}
      >
        <Title level={3} style={{ textAlign: 'center', marginBottom: 16 }}>
          Verify your email
        </Title>
        <Text type="secondary" style={{ display: 'block', textAlign: 'center', marginBottom: 24 }}>
          We sent a code to <b>{email}</b>
        </Text>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="otp"
            rules={[{ required: true, message: 'Please enter OTP!' }]}
          >
            <Input placeholder="Enter OTP" size="large" />
          </Form.Item>
          <Form.Item>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                style={{ width: '48%' }}
              >
                Verify
              </Button>
              <Button
                type="default"
                onClick={handleResendOTP}
                loading={resendLoading}
                style={{ width: '48%' }}
              >
                Resend OTP
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default VerifyOtpPage;