import React from "react";
import { Input, Select, Button, Space } from "antd";

const { Option } = Select;

const UserSearch = ({
  filters,
  setFilters,
  roleOptions = [],
  genderOptions = ["male", "female", "other"],
}) => (
  <Space style={{ marginBottom: 16, flexWrap: "wrap" }}>
    <Input
      placeholder="Search by Full Name"
      allowClear
      value={filters.fullName}
      onChange={e => setFilters(f => ({ ...f, fullName: e.target.value }))}
      style={{ width: 180 }}
    />
    <Input
      placeholder="Search by Email"
      allowClear
      value={filters.email}
      onChange={e => setFilters(f => ({ ...f, email: e.target.value }))}
      style={{ width: 180 }}
    />
    <Select
      placeholder="Gender"
      allowClear
      style={{ width: 140 }}
      value={filters.gender}
      onChange={value => setFilters(f => ({ ...f, gender: value }))}
    >
      {genderOptions.map(g => (
        <Option key={g} value={g}>
          {g.charAt(0).toUpperCase() + g.slice(1)}
        </Option>
      ))}
    </Select>
    <Select
      placeholder="Role"
      allowClear
      style={{ width: 140 }}
      value={filters.role}
      onChange={value => setFilters(f => ({ ...f, role: value }))}
    >
      {roleOptions.map(r => (
        <Option key={r} value={r}>
          {r}
        </Option>
      ))}
    </Select>
    <Button
      onClick={() =>
        setFilters({ fullName: "", email: "", gender: undefined, role: undefined })
      }
    >
      Reset
    </Button>
  </Space>
);

export default UserSearch;