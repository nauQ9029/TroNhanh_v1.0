import React, { useState } from "react";
import { Table, Tag, Button, Space, Tooltip, Badge, Popconfirm, Dropdown, Modal, Input } from "antd";
import { EyeOutlined, DeleteOutlined, CheckCircleOutlined, MoreOutlined, WarningOutlined, CloseCircleOutlined, UndoOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const statusColors = {
    pending: "orange",
    approved: "green",
    reported: "red",
    deleted: "default",
};

const PostTable = ({
    data,
    onView,
    onApprove,
    onDelete,
    onDropdownAction,
    onUndo,
}) => {
    // State cho popup lý do xóa
    const [deleteModal, setDeleteModal] = useState({ open: false, record: null, reason: "" });
    const [undoModal, setUndoModal] = useState({ open: false, record: null });

    // Xử lý khi chọn Approve (chuyển sang deleted, hiện popup nhập lý do)
    const handleApprove = (record) => {
        setDeleteModal({ open: true, record, reason: "" });
    };

    // Xử lý khi xác nhận xóa
    const handleConfirmDelete = () => {
        if (deleteModal.record) {
            // Gửi lý do xóa qua callback, bạn có thể sửa lại nếu muốn lưu log
            onDropdownAction(deleteModal.record.id, "deleted", deleteModal.reason);
        }
        setDeleteModal({ open: false, record: null, reason: "" });
    };

    const handleReject = (record) => {
        onApprove(record.id, "rejected");
    };

    const handleUndo = (record) => {
        setUndoModal({ open: true, record });
    };

    // Xác nhận Undo
    const handleConfirmUndo = () => {
        if (undoModal.record) {
            onUndo(undoModal.record.id);
        }
        setUndoModal({ open: false, record: null });
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
            dataIndex: "status",
            key: "status",
            render: (status, record) => (
                <Space>
                    <Tag color={statusColors[status]} style={{ minWidth: 90, textAlign: "center" }}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Tag>
                    {status === "reported" && (
                        <Badge
                            count={record.reported}
                            overflowCount={99}
                            style={{ backgroundColor: "#f5222d" }}
                            offset={[0, 0]}
                        >
                            {record.reported > 5 && (
                                <Tooltip title="Priority: Reported > 5 times">
                                    <WarningOutlined style={{ color: "#faad14", marginLeft: 4 }} />
                                </Tooltip>
                            )}
                        </Badge>
                    )}
                </Space>
            ),
        },
        {
            title: "Date Posted",
            dataIndex: "datePosted",
            key: "datePosted",
            render: (date) => dayjs(date).format("YYYY-MM-DD"),
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => {
                // Menu cho bài reported
                const menuItems = [
                    {
                        key: "rejected",
                        icon: <CloseCircleOutlined />,
                        label: "Rejected",
                        onClick: () => handleReject(record),
                    },
                    {
                        key: "approved",
                        icon: <CheckCircleOutlined />,
                        label: "Approved (Delete)",
                        onClick: () => handleApprove(record),
                    },
                ];
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
                        {record.status === "pending" && (
                            <Tooltip title="Approve post">
                                <Popconfirm
                                    title="Approve this post?"
                                    onConfirm={() => onApprove(record.id)}
                                    okText="Approve"
                                    cancelText="Cancel"
                                >
                                    <Button
                                        style={{ border: 'none', display: 'inline-block', color: "#52c41a" }}
                                        icon={<CheckCircleOutlined />}
                                        size="small"
                                    />
                                </Popconfirm>
                            </Tooltip>
                        )}
                        {record.status !== "deleted" && (
                            <Tooltip title="Delete post">
                                <Button
                                    style={{ border: 'none', display: 'inline-block' }}
                                    icon={<DeleteOutlined />}
                                    danger
                                    size="small"
                                    onClick={() => onDelete(record)}
                                />
                            </Tooltip>
                        )}
                        {record.status === "reported" && (
                            <Dropdown
                                menu={{ items: menuItems }}
                                trigger={['click']}
                            >
                                <Button
                                    icon={<MoreOutlined />}
                                    size="small"
                                    style={{ border: 'none', display: 'inline-block' }}
                                />
                            </Dropdown>
                        )}
                        {(record.status === "deleted" || record.status === "rejected") && (
                            <Tooltip title="Undo last action">
                                <Button
                                    icon={<UndoOutlined />}
                                    size="small"
                                    style={{ border: 'none', display: 'inline-block', color: "#1890ff" }}
                                    onClick={() => handleUndo(record)}
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
                pagination={{ pageSize: 20 }}
                locale={{ emptyText: "No posts found" }}
                bordered
                size="middle"
            />
            <Modal
                open={deleteModal.open}
                onCancel={() => setDeleteModal({ open: false, record: null, reason: "" })}
                onOk={handleConfirmDelete}
                okText="Delete"
                okButtonProps={{ danger: true }}
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
                </div>
            </Modal>
            <Modal
                open={undoModal.open}
                onCancel={() => setUndoModal({ open: false, record: null })}
                onOk={handleConfirmUndo}
                okText="Undo"
                cancelText="Cancel"
                title={
                    <span>
                        <UndoOutlined style={{ color: "#1890ff", marginRight: 8 }} />
                        Undo Action
                    </span>
                }
            >
                <div>
                    Are you sure you want to undo the last action for post: <b>{undoModal.record?.title}</b>?
                </div>
            </Modal>
        </>
    );
};

export default PostTable;