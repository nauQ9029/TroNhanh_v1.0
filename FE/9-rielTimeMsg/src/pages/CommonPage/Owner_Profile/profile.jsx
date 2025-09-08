import React, { useState } from "react";
import { Card, Descriptions, message } from "antd";
import "./profile.css";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "Your Full Name",
    password: "Your Password",
    gender: "Male/Female",
    address: "Your Address",
    phone: "Phone Number .. ",
  });

  const [backupData, setBackupData] = useState({ ...formData });

  // Avatar state
  const defaultAvatar = require("../../../assets/images/avatar.png");
  const [avatar, setAvatar] = useState(null); // lưu file
  const [avatarPreview, setAvatarPreview] = useState(defaultAvatar); // hiển thị

  const handleChange = (e, field) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleEditClick = () => {
    setBackupData({ ...formData });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData({ ...backupData });
    setAvatar(null);
    setAvatarPreview(defaultAvatar);
    setIsEditing(false);
  };

  const handleSave = () => {
    // Gửi dữ liệu và ảnh avatar nếu có (giả lập ở đây)
    setIsEditing(false);
    message.success("Profile updated successfully!");
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="profile-container">
      <Card className="profile-card">
        <div className="profile-header">
          <div className="avatar-container">
            <img
              src={avatarPreview}
              alt="Profile"
              className="profile-pic"
            />
            {isEditing && (
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="avatar-upload"
              />
            )}
          </div>

          <div className="profile-header-content">
            <div className="profile-info">
              <h2>{formData.fullName}</h2>
              <p>Owner@gmail.com</p>
            </div>

            {isEditing ? (
              <div className="edit-button-group">
                <button className="edit-btn" onClick={handleSave}>Save</button>
                <button className="edit-btn cancel-btn" onClick={handleCancel}>Cancel</button>
              </div>
            ) : (
              <button className="edit-btn" onClick={handleEditClick}>Edit</button>
            )}
          </div>
        </div>

        <Descriptions column={2} layout="vertical">
          <Descriptions.Item label="Full Name">
            <input
              type="text"
              className="profile-input"
              value={formData.fullName}
              disabled={!isEditing}
              onChange={(e) => handleChange(e, "fullName")}
            />
          </Descriptions.Item>
          <Descriptions.Item label="Password">
            <input
              type="password"
              className="profile-input"
              value={formData.password}
              disabled={!isEditing}
              onChange={(e) => handleChange(e, "password")}
            />
          </Descriptions.Item>
          <Descriptions.Item label="Gender">
            <input
              type="text"
              className="profile-input"
              value={formData.gender}
              disabled={!isEditing}
              onChange={(e) => handleChange(e, "gender")}
            />
          </Descriptions.Item>
          <Descriptions.Item label="Address">
            <input
              type="text"
              className="profile-input"
              value={formData.address}
              disabled={!isEditing}
              onChange={(e) => handleChange(e, "address")}
            />
          </Descriptions.Item>
          <Descriptions.Item label="Phone Number">
            <input
              type="text"
              className="profile-input phone-input"
              value={formData.phone}
              disabled={!isEditing}
              onChange={(e) => handleChange(e, "phone")}
            />
          </Descriptions.Item>
        </Descriptions>

        <div className="email-section">
          <img
            src={avatarPreview}
            alt="Email Avatar"
            className="email-avatar"
          />
          <div className="email-info">
            <span className="email-label">My email address</span>
            <p className="email-name">{formData.fullName}</p>
            <p className="email-address">owner@gmail.com</p>
            <span className="update-time">1 month ago</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Profile;
