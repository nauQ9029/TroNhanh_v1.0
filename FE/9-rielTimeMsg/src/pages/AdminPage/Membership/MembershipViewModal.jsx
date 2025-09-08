import React from "react";
import { Modal, Tag } from "antd";

const MembershipViewModal = ({ open, onCancel, record }) => (
  <Modal open={open} onCancel={onCancel} footer={null} title="Membership Package Details">
    {record && (
      <div>
        <p><b>Name:</b> {record.name}</p>
        <p><b>Price:</b> {record.price?.toLocaleString()} VNĐ</p>
        <p><b>Duration:</b> {record.duration} days</p>
        <p><b>Number of Posts:</b> {record.postLimit}</p>
        <p><b>Description:</b> {record.description}</p>
        <p><b>Status:</b> <Tag color={record.status === "active" ? "green" : "default"}>{record.status}</Tag></p>
      </div>
    )}
  </Modal>
);

export default MembershipViewModal;