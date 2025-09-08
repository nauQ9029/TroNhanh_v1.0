import React from "react";
import { Modal, Form, Input, Select } from "antd";

const ReportsResolveModal = ({ open, onCancel, onOk, form }) => (
  <Modal
    open={open}
    onCancel={onCancel}
    onOk={onOk}
    title="Resolve Complaint"
    okText="Resolve"
  >
    <Form form={form} layout="vertical">
      <Form.Item
        name="resolution"
        label="Resolution Justification"
        rules={[{ required: true, message: "Please provide a justification." }]}
      >
        <Input.TextArea rows={3} placeholder="Enter your resolution and justification..." />
      </Form.Item>
      <Form.Item
        name="status"
        label="Update Status"
        rules={[{ required: true, message: "Please select a status." }]}
        initialValue="Resolved"
      >
        <Select>
          <Select.Option value="Resolved">Resolved</Select.Option>
          <Select.Option value="Rejected">Rejected</Select.Option>
          <Select.Option value="Forwarded">Forwarded</Select.Option>
        </Select>
      </Form.Item>
    </Form>
  </Modal>
);

export default ReportsResolveModal;