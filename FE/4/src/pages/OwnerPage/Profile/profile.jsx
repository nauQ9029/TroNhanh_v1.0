// src/pages/owner/profile/OwnerProfile.jsx
import React, { useEffect, useState } from "react";
import {
  Card,
  Descriptions,
  Button,
  Input,
  Avatar,
  Modal,
  message,
  Upload,
} from "antd";
import {
  SaveOutlined,
  EditOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { updateUserInfo } from "../../../services/profileServices";
import useUser from "../../../contexts/UserContext";
import "./profile.css"; 

const OwnerProfile = () => {
  const { user, fetchUser } = useUser();
  const [formData, setFormData] = useState({});
  const [editingField, setEditingField] = useState("");
  const [loading, setLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
const [messageApi, contextHolder] = message.useMessage();
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        phone: user.phone,
        gender: user.gender,
        address: user.address || "Chưa có địa chỉ",
        email: user.email,
        role: user.role,
      });
      setAvatarPreview(user.avatar);
    }
  }, [user]);

  const handleEdit = (field) => setEditingField(field);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (field) => {
    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append(field, formData[field]);
      await updateUserInfo(formDataToSend);
      await fetchUser();
      messageApi.success("Cập nhật thành công");
      setEditingField("");
    } catch (error) {
      messageApi.error("Cập nhật thất bại");
    }
    setLoading(false);
  };

  const handleAvatarChange = async ({ file }) => {
    const formDataToSend = new FormData();
    formDataToSend.append("avatar", file);
    try {
      await updateUserInfo(formDataToSend);
      await fetchUser();
      message.success("Cập nhật ảnh đại diện thành công");
    } catch {
      message.error("Không thể cập nhật ảnh đại diện");
    }
  };

  if (!user) return <p style={{ textAlign: "center", marginTop: 40 }}>Đang tải...</p>;

  return (
    <>
      {contextHolder}
    <div className="profile-container">
      <Card className="profile-card">
        <div className="profile-header">
          <div className="avatar-container">
            <Avatar
              src={avatarPreview}
              size={120}
              className="profile-pic"
              onClick={() => setIsModalVisible(true)}
            />
            <Upload
              showUploadList={false}
              accept="image/*"
              maxCount={1}
              customRequest={({ file, onSuccess }) => {
                handleAvatarChange({ file });
                setTimeout(() => onSuccess("ok"), 0);
              }}
            >
               <Button
    icon={<UploadOutlined />}
    size="small"
    style={{ marginTop: 12 ,marginRight:14}} 
  >
    Đổi ảnh
  </Button>
            </Upload>
          </div>

          <div className="profile-info">
            <h2>{formData.name}</h2>
            <p>{formData.email}</p>
          </div>
        </div>

        <Descriptions column={2} layout="horizontal"
         labelStyle={{ fontWeight: "bold", width: 120 }}
  contentStyle={{ whiteSpace: "nowrap" }}>
          {/* Name */}
          <Descriptions.Item label="Họ và tên">
            {editingField === "name" ? (
              <>
                <Input
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  size="small"
                />
                <Button
                  icon={<SaveOutlined />}
                  onClick={() => handleSave("name")}
                  loading={loading}
                  size="small"
                  type="primary"
                  style={{ marginTop: 8 }}
                >
                  Lưu
                </Button>
              </>
            ) : (
              <>
                <span>{formData.name}</span>
                <Button
                  icon={<EditOutlined />}
                  type="link"
                  size="small"
                  onClick={() => handleEdit("name")}
                  style={{ paddingLeft: 8 }}
                >
                  Chỉnh sửa
                </Button>
              </>
            )}
          </Descriptions.Item>

          {/* Phone */}
          <Descriptions.Item label="Số điện thoại">
            {editingField === "phone" ? (
              <>
                <Input
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  size="small"
                />
                <Button
                  icon={<SaveOutlined />}
                  onClick={() => handleSave("phone")}
                  loading={loading}
                  size="small"
                  type="primary"
                  style={{ marginTop: 8 }}
                >
                  Lưu
                </Button>
              </>
            ) : (
              <>
                <span>{formData.phone}</span>
                <Button
                  icon={<EditOutlined />}
                  type="link"
                  size="small"
                  onClick={() => handleEdit("phone")}
                  style={{ paddingLeft: 8 }}
                >
                  Chỉnh sửa
                </Button>
              </>
            )}
          </Descriptions.Item>

          {/* Gender */}
          <Descriptions.Item label="Giới tính">
            <span>{formData.gender}</span>
          </Descriptions.Item>

          {/* Địa chỉ */}
          <Descriptions.Item label="Địa chỉ">
            <span>{formData.address}</span>
          </Descriptions.Item>

          {/* Email */}
          <Descriptions.Item label="Email">
            <span>{formData.email}</span>
          </Descriptions.Item>

          {/* Role */}
          <Descriptions.Item label="Quyền">
            <span>{formData.role}</span>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Avatar Preview Modal */}
      <Modal
        open={isModalVisible}
        footer={null}
        onCancel={() => setIsModalVisible(false)}
        centered
      >
        <img
          src={avatarPreview}
          alt="Avatar Preview"
          style={{ width: "100%", maxHeight: "80vh", objectFit: "contain" }}
        />
      </Modal>
    </div>
    </>
  );
};

export default OwnerProfile;
