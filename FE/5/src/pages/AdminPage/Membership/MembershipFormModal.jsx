import React from "react";
import { Modal, Form, Input, InputNumber, Select } from "antd";

const MembershipFormModal = ({ open, onCancel, onOk, form, mode, record }) => (
    <Modal
        open={open}
        onCancel={onCancel}
        onOk={onOk}
        title={mode === "edit" ? "Edit Membership Package" : "Create Membership Package"}
        okText={mode === "edit" ? "Update" : "Save"}
    >
        <Form form={form} layout="vertical" initialValues={record || { status: "active" }}>
            <Form.Item name="name" label="Package Name" rules={[{ required: true, message: "Required" }]}>
                <Select disabled={mode === "edit" && record?.inUse}>
                    <Select.Option value="Free">Free</Select.Option>
                    <Select.Option value="Bronze">Bronze</Select.Option>
                    <Select.Option value="Silver">Silver</Select.Option>
                    <Select.Option value="Gold">Gold</Select.Option>
                    <Select.Option value="Premium">Premium</Select.Option>
                </Select>
            </Form.Item>
            <Form.Item name="price" label="Price (VNĐ)" rules={[{ required: true, type: "number", min: 1, message: "Price must be > 0" }]}>
                <InputNumber min={1} style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item name="duration" label="Duration (days)" rules={[{ required: true, type: "number", min: 1, message: "Duration must be > 0" }]}>
                <InputNumber min={1} style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item name="postLimit" label="Number of Posts" rules={[{ required: true, type: "number", min: 1, message: "Must be > 0" }]}>
                <InputNumber min={1} style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item name="description" label="Description">
                <Input.TextArea rows={2} />
            </Form.Item>
            <Form.Item name="status" label="Status">
                <Select>
                    <Select.Option value="active">Active</Select.Option>
                    <Select.Option value="inactive">Inactive</Select.Option>
                </Select>
            </Form.Item>
        </Form>
    </Modal>
);

export default MembershipFormModal;