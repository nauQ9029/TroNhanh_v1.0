import React, { useState } from 'react';
import { Form, Input, Button, Typography, message as antMessage } from 'antd';
import { useNavigate } from 'react-router-dom';
import { login, saveAccessToken } from '../../../services/authService';
import { initAutoLogout } from '../../../services/autoLogout';
import useUser from '../../../contexts/UserContext';
import styles from './LoginPage.module.css';

const { Title } = Typography;

const LoginPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { fetchUser } = useUser();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = antMessage.useMessage(); 

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const res = await login(values);

      saveAccessToken(res.data.accessToken, 30 * 60 * 1000, res.data.refreshToken);
      await fetchUser();
      initAutoLogout();

      const role = res.data.user.role?.toLowerCase();

      if (role === 'admin') {
        navigate('/admin/dashboard');
      } else if (role === 'owner') {
        navigate('/homepage');
      } else if (role === 'customer') {
        navigate('/homepage');
      } else {
        messageApi.error('Role không hợp lệ hoặc chưa được phân quyền!');
        return;
      }

      messageApi.success('Login successful!');
    } catch (err) {
      const errors = err.response?.data?.errors;
      if (Array.isArray(errors)) {
        form.setFields(errors.map(error => ({
          name: error.param,
          errors: [error.msg],
        })));
      } else {
        console.log('Login error:', err);
        messageApi.error(err.response?.data?.message || 'Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {contextHolder} {}
      <Title level={2} style={{ textAlign: 'center' }}>Login</Title>
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Form.Item 
          label="Email" 
          name="email" 
          rules={[{ required: true, message: 'Please enter your email!' }]}
        >
          <Input type="email" placeholder="Enter your email" />
        </Form.Item>

        <Form.Item 
          label="Password" 
          name="password" 
          rules={[{ required: true, message: 'Please enter your password!' }]}
        >
          <Input.Password placeholder="Enter your password" />
        </Form.Item>

        <Form.Item> 
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading} 
            block 
            className={styles.submitButton}
          >
            Login
          </Button>
        </Form.Item>

        <Form.Item>
          <p className={styles.login}>
            Don't have an account? <a href='/register'>Register</a>
          </p>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginPage;
