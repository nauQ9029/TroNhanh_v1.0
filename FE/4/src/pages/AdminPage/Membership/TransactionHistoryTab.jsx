import React, { useState } from "react";
import { Table, Input, DatePicker, Select, Space, Tag, Alert } from "antd";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;
const { Option } = Select;

const mockTransactions = [
  {
    id: 1,
    date: "2025-06-15",
    sender: "Nguyen Van A",
    receiver: "System",
    type: "Buy Membership",
    amount: 500000,
    status: "success",
  },
  {
    id: 2,
    date: "2025-06-14",
    sender: "Tran Thi B",
    receiver: "System",
    type: "Buy Membership",
    amount: 300000,
    status: "success",
  },
  // ... thêm dữ liệu mẫu
];

const statusColors = {
  success: "green",
  failed: "red",
  pending: "orange",
};

const TransactionHistoryTab = () => {
  const [filters, setFilters] = useState({
    search: "",
    dateRange: [],
    status: undefined,
  });

  const filtered = mockTransactions
    .filter(tx =>
      (!filters.search ||
        tx.sender.toLowerCase().includes(filters.search.toLowerCase()) ||
        tx.receiver.toLowerCase().includes(filters.search.toLowerCase())) &&
      (!filters.status || tx.status === filters.status) &&
      (filters.dateRange.length !== 2 ||
        (dayjs(tx.date).isAfter(filters.dateRange[0].startOf("day").subtract(1, "day")) &&
          dayjs(tx.date).isBefore(filters.dateRange[1].endOf("day").add(1, "day"))))
    )
    .sort((a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf());

  const columns = [
    { title: "Date", dataIndex: "date", key: "date", render: d => dayjs(d).format("YYYY-MM-DD") },
    { title: "Sender", dataIndex: "sender", key: "sender" },
    { title: "Receiver", dataIndex: "receiver", key: "receiver" },
    { title: "Type", dataIndex: "type", key: "type" },
    { title: "Amount", dataIndex: "amount", key: "amount", render: v => v.toLocaleString() + " VNĐ" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: status => <Tag color={statusColors[status]}>{status}</Tag>,
    },
  ];

  return (
    <div>
      <Space style={{ marginBottom: 16, flexWrap: "wrap" }}>
        <Input.Search
          placeholder="Search sender/receiver"
          value={filters.search}
          onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
          style={{ width: 200 }}
          allowClear
        />
        <RangePicker
          value={filters.dateRange}
          onChange={dates => setFilters(f => ({ ...f, dateRange: dates || [] }))}
        />
        <Select
          placeholder="Status"
          allowClear
          value={filters.status}
          onChange={v => setFilters(f => ({ ...f, status: v }))}
          style={{ width: 120 }}
        >
          <Option value="success">Success</Option>
          <Option value="failed">Failed</Option>
          <Option value="pending">Pending</Option>
        </Select>
      </Space>
      <Table
        columns={columns}
        dataSource={filtered}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        locale={{
          emptyText: <Alert message="No data available." type="info" showIcon />,
        }}
      />
    </div>
  );
};

export default TransactionHistoryTab;