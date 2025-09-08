import React, { useState } from "react";
import { Table, Tag, Button, Space, Tooltip, Badge, Popconfirm, Modal, Input } from "antd";
import { EyeOutlined, DeleteOutlined, CheckCircleOutlined, WarningOutlined, CloseCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const statusColors = {
    pending: "blue",
    approved: "green", 
    deleted: "volcano",
    rejected: "magenta",
};

const PostTable = ({
    data,
    loading,
    pagination,
    onChange,
    onView,
    onApprove,
    onReject,
    onDelete,
}) => {
    // State for modals
    const [rejectModal, setRejectModal] = useState({ open: false, record: null, reason: "" });
    const [deleteModal, setDeleteModal] = useState({ open: false, record: null, reason: "" });

    // Handle approve action
    const handleApprove = async (record) => {
        if (onApprove) {
            await onApprove(record.id, 'approved');
        }
    };

    // Handle reject action - show modal for reason
    const handleReject = (record) => {
        setRejectModal({ open: true, record, reason: "" });
    };

    // Confirm reject with reason
    const handleConfirmReject = async () => {
        if (rejectModal.record && onReject) {
            await onReject(rejectModal.record.id, 'rejected', rejectModal.reason);
        }
        setRejectModal({ open: false, record: null, reason: "" });
    };

    // Handle delete action
    const handleDelete = (record) => {
        setDeleteModal({ open: true, record, reason: "" });
    };

    // Confirm delete
    const handleConfirmDelete = async () => {
        if (!deleteModal.reason.trim()) {
            return; // Don't proceed if no reason is provided
        }
        if (deleteModal.record && onDelete) {
            await onDelete(deleteModal.record.id, deleteModal.reason);
        }
        setDeleteModal({ open: false, record: null, reason: "" });
    };


    const columns = [
        {
            title: "Title",
            dataIndex: "title",
            key: "title",
            render: (_, record) => (
                <Button
                    type="link"
                    onClick={() => onView(record)}
                    style={{ padding: 0, fontWeight: 500, border: 'none', display: 'inline-block' }}
                >
                    {record.title || "No title"}
                </Button>
            ),
        },
        {
            title: "Owner",
            dataIndex: "owner",
            key: "owner",
        },
        {
            title: "Status",
            dataIndex: "approvedStatus",
            key: "approvedStatus",
            render: (approvedStatus, record) => (
                <Space>
                    <Tag color={statusColors[approvedStatus]} style={{ minWidth: 90, textAlign: "center" }}>
                        {approvedStatus ? approvedStatus.charAt(0).toUpperCase() + approvedStatus.slice(1) : "Unknown"}
                    </Tag>
                </Space>
            ),
        },
        {
            title: "Date Posted",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (date) => date ? dayjs(date).format("YYYY-MM-DD") : "N/A",
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => {
                return (
                    <Space>
                        <Tooltip title="View details">
                            <Button
                                style={{ border: 'none', display: 'inline-block' }}
                                icon={<EyeOutlined />}
                                onClick={() => onView(record)}
                                type="default"
                                size="small"
                            />
                        </Tooltip>
                        {record.approvedStatus === "pending" && (
                            <>
                                <Tooltip title="Approve post">
                                    <Popconfirm
                                        title="Approve this post?"
                                        description="This will approve the accommodation post."
                                        onConfirm={() => handleApprove(record)}
                                        okText="Approve"
                                        cancelText="Cancel"
                                        okType="primary"
                                    >
                                        <Button
                                            style={{ border: 'none', display: 'inline-block', color: "#52c41a" }}
                                            icon={<CheckCircleOutlined />}
                                            size="small"
                                        />
                                    </Popconfirm>
                                </Tooltip>
                                <Tooltip title="Reject post">
                                    <Button
                                        style={{ border: 'none', display: 'inline-block', color: "#ff4d4f" }}
                                        icon={<CloseCircleOutlined />}
                                        size="small"
                                        onClick={() => handleReject(record)}
                                    />
                                </Tooltip>
                            </>
                        )}
                        {record.approvedStatus !== "deleted" && (
                            <Tooltip title="Delete post">
                                <Button
                                    style={{ border: 'none', display: 'inline-block' }}
                                    icon={<DeleteOutlined />}
                                    danger
                                    size="small"
                                    onClick={() => handleDelete(record)}
                                />
                            </Tooltip>
                        )}
                    </Space>
                );
            },
        },
    ];

    return (
        <>
            <Table
                columns={columns}
                dataSource={data}
                rowKey="id"
                loading={loading}
                pagination={pagination}
                onChange={onChange}
                locale={{ emptyText: "No posts found" }}
                bordered
                size="middle"
            />
            
            {/* Reject Modal */}
            <Modal
                open={rejectModal.open}
                onCancel={() => setRejectModal({ open: false, record: null, reason: "" })}
                onOk={handleConfirmReject}
                okText="Reject"
                okButtonProps={{ danger: true }}
                cancelText="Cancel"
                title={
                    <span>
                        <CloseCircleOutlined style={{ color: "#ff4d4f", marginRight: 8 }} />
                        Reject Post & Provide Reason
                    </span>
                }
            >
                <div>
                    <b>Post:</b> {rejectModal.record?.title}
                </div>
                <div style={{ margin: "12px 0" }}>
                    <Input.TextArea
                        rows={3}
                        placeholder="Enter reason for rejection (optional)"
                        value={rejectModal.reason}
                        onChange={e => setRejectModal(rm => ({ ...rm, reason: e.target.value }))}
                    />
                </div>
            </Modal>

            <Modal
                open={deleteModal.open}
                onCancel={() => setDeleteModal({ open: false, record: null, reason: "" })}
                onOk={handleConfirmDelete}
                okText="Delete"
                okButtonProps={{ 
                    danger: true,
                    disabled: !deleteModal.reason.trim()
                }}
                cancelText="Cancel"
                title={
                    <span>
                        <DeleteOutlined style={{ color: "#faad14", marginRight: 8 }} />
                        Delete Post & Provide Reason
                    </span>
                }
            >
                <div>
                    <b>Post:</b> {deleteModal.record?.title}
                </div>
                <div style={{ margin: "12px 0" }}>
                    <Input.TextArea
                        rows={3}
                        placeholder="Enter reason for deletion (required)"
                        value={deleteModal.reason}
                        onChange={e => setDeleteModal(dm => ({ ...dm, reason: e.target.value }))}
                    />
                    {!deleteModal.reason.trim() && (
                        <div style={{ color: "#ff4d4f", fontSize: "12px", marginTop: "4px" }}>
                            Reason is required
                        </div>
                    )}
                </div>
            </Modal>
        </>
    );
};

export default PostTable;