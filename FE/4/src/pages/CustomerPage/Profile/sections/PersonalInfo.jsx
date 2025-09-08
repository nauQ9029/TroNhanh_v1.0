import React, { useEffect, useState } from 'react';
import {
  Typography,
  Card,
  Button,
  Input,
  message,
  Avatar,
  Upload,
  Modal,
  Divider,
} from 'antd';
import {
  EditOutlined,
  SaveOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import {
  getUserInfo,
  updateUserInfo,
} from '../../../../services/profileServices';
import useUser from '../../../../contexts/UserContext';
import './PersonalInfo.css';

const { Title, Text } = Typography;

const PersonalInfo = () => {
const { user, setUser, fetchUser } = useUser();
  const [editingField, setEditingField] = useState('');
  const [fieldValues, setFieldValues] = useState({});
  const [avatarPreview, setAvatarPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    
    if (user) {
      setFieldValues({
        name: user.name,
        phone: user.phone,
      });
        console.log('User avatar after update:', user?.avatar);
      setAvatarPreview(user.avatar);
    }
  }, [user]);

  const handleEdit = (field) => setEditingField(field);

  const handleChange = (field, value) => {
    setFieldValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (field) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append(field, fieldValues[field]);
      await updateUserInfo(formData);
      await fetchUser(); 
      message.success("Cập nhật thành công");
      setEditingField('');
    } catch {
      message.error("Cập nhật thất bại");
    }
    setLoading(false);
  };

   const handleAvatarChange = async ({ file }) => {
    const formData = new FormData();
    formData.append("avatar", file);
    try {
      await updateUserInfo(formData);
      await fetchUser(); 
      message.success("Cập nhật ảnh đại diện thành công");
    } catch {
      message.error("Không thể cập nhật ảnh đại diện");
    }
  };

  const handleAvatarClick = () => setIsModalVisible(true);
  const handleModalClose = () => setIsModalVisible(false);

  if (error) return <p style={{ color: 'red', textAlign: 'center', marginTop: 40 }}>{error}</p>;
  if (!user) return <p style={{ textAlign: 'center', marginTop: 40 }}>Loading...</p>;

  return (
    <div className="personal-info-container">
      <Card className="personal-info-card" bodyStyle={{ padding: 0 }}>
        {/* Avatar */}
        <div className="avatar-container">
          <Avatar
            src={avatarPreview}
            size={120}
            className="avatar-style"
            onClick={handleAvatarClick}
          />
          <Upload
            showUploadList={false}
            accept="image/*"
            maxCount={1}
            customRequest={({ file, onSuccess }) => {
              handleAvatarChange({ file });
              setTimeout(() => onSuccess('ok'), 0);
            }}
          >
            <Button size="small" icon={<UploadOutlined />}>Đổi ảnh</Button>
          </Upload>
        </div>

        <Title level={3} style={{ textAlign: 'center', marginBottom: 16 }}>{user.name}</Title>
        <Divider style={{ margin: '16px 0' }} />

        {/* Email */}
        <div className="flex-row">
          <Text className="label-style">Email:</Text>
          <div className="flex-content">
            <Text>{user.email}</Text>
          </div>
        </div>
        <Divider style={{ margin: '12px 0' }} />

        {/* Phone */}
        <div className="flex-row">
          <Text className="label-style">Số điện thoại:</Text>
          <div className="flex-content-inline">
            {editingField === 'phone' ? (
              <>
                <Input
                  value={fieldValues.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  style={{ width: 200, marginRight: 8 }}
                  size="small"
                />
                <Button
                  type="primary"
                  icon={<SaveOutlined />}
                  onClick={() => handleSave('phone')}
                  loading={loading}
                  size="small"
                >
                  Lưu
                </Button>
              </>
            ) : (
              <>
                <Text>{user.phone}</Text>
                <Button
                  type="link"
                  icon={<EditOutlined />}
                  onClick={() => handleEdit('phone')}
                  size="small"
                  style={{ marginLeft: 8, padding: 0 }}
                >
                  Chỉnh sửa
                </Button>
              </>
            )}
          </div>
        </div>
        <Divider style={{ margin: '12px 0' }} />

        {/* Name */}
        <div className="flex-row">
          <Text className="label-style">Họ và tên:</Text>
          <div className="flex-content-inline">
            {editingField === 'name' ? (
              <>
                <Input
                  value={fieldValues.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  style={{ width: 200, marginRight: 8 }}
                  size="small"
                />
                <Button
                  type="primary"
                  icon={<SaveOutlined />}
                  onClick={() => handleSave('name')}
                  loading={loading}
                  size="small"
                >
                  Lưu
                </Button>
              </>
            ) : (
              <>
                <Text>{user.name}</Text>
                <Button
                  type="link"
                  icon={<EditOutlined />}
                  onClick={() => handleEdit('name')}
                  size="small"
                  style={{ marginLeft: 8, padding: 0 }}
                >
                  Chỉnh sửa
                </Button>
              </>
            )}
          </div>
        </div>
        <Divider style={{ margin: '12px 0' }} />

        {/* Gender */}
        <div className="flex-row">
          <Text className="label-style">Gender:</Text>
          <div className="flex-content">
            <Text>{user.gender}</Text>
          </div>
        </div>
        <Divider style={{ margin: '12px 0' }} />

        {/* Role */}
        <div className="flex-row">
          <Text className="label-style">Quyền:</Text>
          <div className="flex-content">
            <Text>{user.role}</Text>
          </div>
        </div>
      </Card>

      {/* Modal avatar */}
      <Modal
        open={isModalVisible}
        footer={null}
        onCancel={handleModalClose}
        centered
      >
        <img
          src={avatarPreview}
          alt="Avatar Preview"
          style={{ width: '100%', maxHeight: '80vh', objectFit: 'contain' }}
        />
      </Modal>
    </div>
  );
};

export default PersonalInfo;
