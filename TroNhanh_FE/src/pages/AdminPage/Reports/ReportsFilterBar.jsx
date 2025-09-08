import React from "react";
import { Input, Select, DatePicker, Space } from "antd";
const { RangePicker } = DatePicker;

const ReportsFilterBar = ({ filters, setFilters }) => (
  <Space style={{ marginBottom: 16, flexWrap: "wrap" }}>
    <Input.Search
      placeholder="Search by name, email or content"
      value={filters.search}
      onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
      style={{ width: 250 }}
      allowClear
    />
    <Select
      placeholder="Status"
      allowClear
      value={filters.status}
      onChange={v => setFilters(f => ({ ...f, status: v }))}
      style={{ width: 140 }}
    >
      <Select.Option value="Pending">Pending</Select.Option>
      <Select.Option value="Approved">Approved</Select.Option>
      <Select.Option value="Rejected">Rejected</Select.Option>

    </Select>
    <RangePicker
      placeholder={["From date", "To date"]}
      value={filters.dateRange}
      onChange={dates => setFilters(f => ({ ...f, dateRange: dates || [] }))}
      style={{ width: 240 }}
    />
  </Space>
);

export default ReportsFilterBar;