import React from "react";
import { Modal, Tag } from "antd";

const statusColors = {
  Pending: "orange",
  Resolved: "green",
  Rejected: "red",
  Forwarded: "blue",
};

const ReportsDetailModal = ({ open, onCancel, record }) => (
  <Modal open={open} onCancel={onCancel} footer={null} title="Complaint Details">
    {record && (
      <div>
        <p><b>User:</b> {record.user} ({record.userId})</p>
        <p><b>Date:</b> {record.date}</p>
        <p><b>Type:</b> {record.type}</p>
        <p><b>Status:</b> <Tag color={statusColors[record.status]}>{record.status}</Tag></p>
        <p><b>Content:</b> {record.content}</p>
        <p><b>Evidence:</b> {record.evidence}</p>
      </div>
    )}
  </Modal>
);

export default ReportsDetailModal;