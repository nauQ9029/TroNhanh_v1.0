import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Button,
  DatePicker,
  Select,
  Row,
  Col,
  Divider,
  Typography,
  Card,
  Avatar,
  Space,
  Spin,
  message,
} from 'antd';
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  CalendarOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import moment from 'moment';

const { Text } = Typography;
const { Option } = Select;

const ROLE_OPTIONS = [
  { id: 1, name: 'Admin' },
  { id: 2, name: 'Owner' },
  { id: 3, name: 'Customer' },
];


const UserEditModal = ({ user, onClose, onSave }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Khởi tạo form với dữ liệu user tĩnh
  useEffect(() => {
    if (user) {
      // Get the first role name or default to empty string
      const userRole = user.roles && user.roles.length > 0 ? user.roles[0].name : '';
      
      form.setFieldsValue({
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        dob: user.dob ? moment(user.dob, "YYYY-MM-DD") : null,
        gender: user.gender || null,
        role: userRole, // Single role instead of array
      });
    }
  }, [user, form]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      
      console.log('📝 Form values:', values);
      console.log('📝 Original user:', user);
      
      // Transform the data for the API
      const updatedUser = {
        ...user,
        name: values.name,
        email: values.email,
        phoneNumber: values.phoneNumber,
        gender: values.gender,
        dob: values.dob ? values.dob.format('YYYY-MM-DD') : null,
        // Convert single role back to array format for frontend consistency
        roles: values.role ? [{ id: null, name: values.role }] : [],
      };
      
      console.log('💾 Submitting user edit:', updatedUser);
      console.log('💾 Updated user roles:', updatedUser.roles);
      
      if (onSave) {
        await onSave(updatedUser);
      }
    } catch (error) {
      console.error('💾 Error in handleSubmit:', error);
      if (error.errorFields) {
        message.error('Please check your input!');
      } else {
        message.error('Failed to update user. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Spin spinning={loading} tip="Updating user information...">
      <Row gutter={[24, 24]}>
        {/* Avatar section */}
        <Col xs={24} md={8}>
          <Card
            bordered={false}
            style={{
              textAlign: 'center',
              background: '#f9f9f9',
              borderRadius: '8px',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Space direction="vertical" size="large" align="center">
              <Avatar
                src={user.avatarUrl}
                icon={<UserOutlined />}
                size={120}
                style={{
                  border: '4px solid #fff',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                }}
              />
              <Text type="secondary">
                Avatar (static, cannot change)
              </Text>
            </Space>
          </Card>
        </Col>
        {/* Form fields section */}
        <Col xs={24} md={16}>
          <Form
            form={form}
            layout="vertical"
            requiredMark="optional"
          >
            <Form.Item
              name="name"
              label="Full Name"
              rules={[{ required: true, message: 'Please enter the full name' }]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Enter full name"
                size="large"
              />
            </Form.Item>

            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="email"
                  label="Email Address"
                  rules={[
                    { required: true, message: 'Please enter the email' },
                    { type: 'email', message: 'Please enter a valid email' }
                  ]}
                >
                  <Input
                    prefix={<MailOutlined className="site-form-item-icon" />}
                    placeholder="email@example.com"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="phoneNumber"
                  label="Phone Number"
                >
                  <Input
                    prefix={<PhoneOutlined className="site-form-item-icon" />}
                    placeholder="0123456789"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="gender"
                  label="Gender"
                >
                  <Select placeholder="Select gender">
                    <Option value="male">Male</Option>
                    <Option value="female">Female</Option>
                    <Option value="other">Other</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="role"
              label="Role"
              rules={[{ required: true, message: 'Please select a role' }]}
            >
              <Select
                placeholder="Select role"
                allowClear
              >
                {ROLE_OPTIONS.map(role => (
                  <Option key={role.name} value={role.name}>
                    {role.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Divider style={{ margin: '24px 0' }} />

            <Form.Item style={{ marginBottom: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <Button onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  type="primary"
                  icon={<SaveOutlined />}
                  onClick={handleSubmit}
                >
                  Save Changes
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </Spin>
  );
};

export default UserEditModal;