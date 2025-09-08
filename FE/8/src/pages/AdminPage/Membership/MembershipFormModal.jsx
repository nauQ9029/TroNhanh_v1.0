import React from "react";
import { Modal, Form, Input, InputNumber, Select } from "antd";

const MembershipFormModal = ({ open, onCancel, onOk, form, mode, record, confirmLoading }) => (
    <Modal
        open={open}
        onCancel={onCancel}
        onOk={onOk}
        title={mode === "edit" ? "Edit Membership Package" : "Create Membership Package"}
        okText={mode === "edit" ? "Update" : "Save"}
        confirmLoading={confirmLoading}
    >
        <Form form={form} layout="vertical" initialValues={record || { isActive: true }}>
            <Form.Item name="packageName" label="Package Name" rules={[{ required: true, message: "Required" }]}>
                {mode === "create" ? (
                    <Select placeholder="Select package name" disabled={mode === "edit" && record?.inUse}>
                        <Select.Option value="Free">Free</Select.Option>
                        <Select.Option value="Bronze">Bronze</Select.Option>
                        <Select.Option value="Silver">Silver</Select.Option>
                        <Select.Option value="Gold">Gold</Select.Option>
                        <Select.Option value="Premium">Premium</Select.Option>
                    </Select>
                ) : (
                    <Input 
                        placeholder="Enter package name" 
                        disabled={mode === "edit" && record?.inUse}
                    />
                )}
            </Form.Item>
            <Form.Item name="price" label="Price (VNĐ)" rules={[
                { required: true, type: "number", min: 1, max: 999999, message: "Price must be between 1 and 999,999 VNĐ" }
            ]}>
                <InputNumber min={1} max={999999} style={{ width: "100%" }} placeholder="Enter price" />
            </Form.Item>
            <Form.Item name="duration" label="Duration (days)" rules={[
                { required: true, type: "number", min: 1, message: "Duration must be at least 1 day" }
            ]}>
                <InputNumber min={1} style={{ width: "100%" }} placeholder="Enter duration in days" />
            </Form.Item>
            <Form.Item name="postsAllowed" label="Posts Allowed" rules={[
                { required: true, type: "number", min: 1, message: "Posts allowed must be at least 1" }
            ]}>
                <InputNumber min={1} style={{ width: "100%" }} placeholder="Enter number of posts allowed" />
            </Form.Item>
            <Form.Item name="description" label="Description" rules={[{ required: true, message: "Description is required" }]}>
                <Input.TextArea rows={3} placeholder="Enter package description" />
            </Form.Item>
            <Form.Item name="features" label="Features (Optional)">
                <Input.TextArea rows={2} placeholder="Enter additional features (comma separated)" />
            </Form.Item>
            <Form.Item name="isActive" label="Status">
                <Select>
                    <Select.Option value={true}>Active</Select.Option>
                    <Select.Option value={false}>Inactive</Select.Option>
                </Select>
            </Form.Item>
        </Form>
    </Modal>
);

export default MembershipFormModal;