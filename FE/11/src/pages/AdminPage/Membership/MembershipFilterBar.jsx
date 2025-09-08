import React from "react";
import { Input, Select, Space, Button } from "antd";

const MembershipFilterBar = ({ filters, setFilters }) => (
  <Space style={{ marginBottom: 16, flexWrap: "wrap" }}>
    <Input
      placeholder="Search by package name"
      value={filters.search}
      onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
      style={{ width: 200 }}
      allowClear
    />
    <Select
      placeholder="Status"
      allowClear
      value={filters.status}
      onChange={value => setFilters(f => ({ ...f, status: value }))}
      style={{ width: 120 }}
    >
      <Select.Option value="active">Active</Select.Option>
      <Select.Option value="inactive">Inactive</Select.Option>
    </Select>
    <Button 
    onClick={() => setFilters({ search: "", status: undefined })}
    style={{ border: 'none', display: 'inline-block' }}
    >Reset</Button>
  </Space>
);

export default MembershipFilterBar;