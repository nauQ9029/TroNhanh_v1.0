import React from "react";
import { Table, Tag, Button, Space, Alert } from "antd";

const statusColors = {
  Pending: "orange",
  Resolved: "green",
  Rejected: "red",
  Forwarded: "blue",
};

const ReportsTable = ({ data, onView, onResolve }) => {
  const columns = [
    { title: "ID", dataIndex: "id", key: "id", width: 60 },
    { title: "User", dataIndex: "user", key: "user", render: (_, r) => `${r.user} (${r.userId})` },
    { title: "Date", dataIndex: "date", key: "date" },
    { title: "Type", dataIndex: "type", key: "type" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: status => <Tag color={statusColors[status]}>{status}</Tag>,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button 
          size="small" 
          onClick={() => onView(record)}>View</Button>
          {record.status === "Pending" && (
            <Button 
            size="small" 
            style={{ border: 'none', display: 'inline-block' }}
            type="primary" onClick={() => onResolve(record)}>
              Resolve
            </Button>
          )}
        </Space>
      ),
    },
  ];
  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey="id"
      pagination={{ pageSize: 10 }}
      locale={{
        emptyText: <Alert message="No complaints available." type="info" showIcon />,
      }}
    />
  );
};

export default ReportsTable;