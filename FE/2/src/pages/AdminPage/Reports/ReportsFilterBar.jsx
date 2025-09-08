import React from "react";
import { Input, Select, DatePicker, Space } from "antd";
const { RangePicker } = DatePicker;

const ReportsFilterBar = ({ filters, setFilters }) => (
  <Space style={{ marginBottom: 16, flexWrap: "wrap" }}>
    <Input.Search
      placeholder="Search by user or user ID"
      value={filters.search}
      onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
      style={{ width: 200 }}
      allowClear
    />
    <Select
      placeholder="Type"
      allowClear
      value={filters.type}
      onChange={v => setFilters(f => ({ ...f, type: v }))}
      style={{ width: 140 }}
    >
      <Select.Option value="Rental">Rental</Select.Option>
      <Select.Option value="Payment">Payment</Select.Option>
      <Select.Option value="Behavior">Behavior</Select.Option>
    </Select>
    <Select
      placeholder="Status"
      allowClear
      value={filters.status}
      onChange={v => setFilters(f => ({ ...f, status: v }))}
      style={{ width: 140 }}
    >
      <Select.Option value="Pending">Pending</Select.Option>
      <Select.Option value="Resolved">Resolved</Select.Option>
      <Select.Option value="Rejected">Rejected</Select.Option>
      <Select.Option value="Forwarded">Forwarded</Select.Option>
    </Select>
    <RangePicker
      value={filters.dateRange}
      onChange={dates => setFilters(f => ({ ...f, dateRange: dates || [] }))}
    />
  </Space>
);

export default ReportsFilterBar;