import React, { useState } from 'react';
import { Form, Input, Button, Typography, Select, message as antMessage } from 'antd';
import { useNavigate } from 'react-router-dom';
import { register } from '../../../services/authService';
import styles from './RegisterPage.module.css';

const { Title } = Typography;
const { Option } = Select;

const RegisterPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [messageApi, contextHolder] = antMessage.useMessage(); 

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await register(values);
      messageApi.success('Registration successful! You can now log in.');
      navigate('/login');
    } catch (err) {
      const errors = err.response?.data?.errors;
      if (Array.isArray(errors)) {
        form.setFields(
          errors.map((error) => ({
            name: error.param,
            errors: [error.msg],
          }))
        );
      } else {
        messageApi.error(err.response?.data?.message || 'Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="registerPageWrapper">
      {contextHolder} {/* Bắt buộc để hiển thị message */}
      <div className={styles.container}>
        <Title level={2} className={styles.title}>Register</Title>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please enter your name!' }]}
            className={styles.formItem}
          >
            <Input placeholder="Enter your name" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please enter your email!' },
              { type: 'email', message: 'Invalid email format!' }
            ]}
            className={styles.formItem}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please enter your password!' }]}
            className={styles.formItem}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>

          <Form.Item
            label="Phone"
            name="phone"
            rules={[
              { required: true, message: 'Please enter your phone number' },
              { pattern: /^\d{10}$/, message: 'Phone number must be 10 digits' }
            ]}
          >
            <Input placeholder="Enter your phone number" maxLength={10} />
          </Form.Item>

          <Form.Item
            label="Gender"
            name="gender"
            rules={[{ required: true, message: 'Please select your gender!' }]}
            className={styles.formItem}
          >
            <Select placeholder="Select gender">
              <Option value="male">Male</Option>
              <Option value="female">Female</Option>
              <Option value="other">Other</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Role"
            name="role"
            rules={[{ required: true, message: 'Please select your role!' }]}
            className={styles.formItem}
          >
            <Select placeholder="Select role">
              <Option value="owner">Owner</Option>
              <Option value="customer">Customer</Option>
            </Select>
          </Form.Item>

          <Form.Item className={styles.formItem}>
            <div className={styles.wrapper}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className={styles.submitButton}
              >
                Create Account
              </Button>
            </div>
          </Form.Item>

          <Form.Item>
            <p className={styles.login}>Already have an account? <a href="/login">Login</a></p>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default RegisterPage;
