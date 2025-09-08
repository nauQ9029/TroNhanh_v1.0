import React, { useCallback } from "react";
import { Input, Select, Button, Space } from "antd";
import { SearchOutlined, ClearOutlined } from "@ant-design/icons";

const { Option } = Select;

const UserSearch = ({
  filters,
  setFilters,
  roleOptions = [],
  genderOptions = ["male", "female", "other"],
}) => {
  const handleInputChange = useCallback((field, value) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
  }, [filters, setFilters]);

  const handleReset = useCallback(() => {
    setFilters({ name: "", email: "", gender: undefined, role: undefined });
  }, [setFilters]);

  return (
    <div style={{ 
      padding: '16px', 
      background: '#fafafa', 
      borderRadius: '8px', 
      marginBottom: '16px' 
    }}>
      <Space style={{ marginBottom: 8 }}>
        <span style={{ fontWeight: 'bold', color: '#1890ff' }}>
          <SearchOutlined /> Search & Filter Users
        </span>
      </Space>
      <Space style={{ flexWrap: "wrap", width: '100%' }}>
        <Input
          placeholder="Search by Full Name"
          allowClear
          value={filters.name}
          onChange={e => handleInputChange('name', e.target.value)}
          style={{ width: 200 }}
          prefix={<SearchOutlined />}
        />
        <Input
          placeholder="Search by Email"
          allowClear
          value={filters.email}
          onChange={e => handleInputChange('email', e.target.value)}
          style={{ width: 200 }}
          prefix={<SearchOutlined />}
        />
        <Select
          placeholder="Select Gender"
          allowClear
          style={{ width: 150 }}
          value={filters.gender}
          onChange={value => handleInputChange('gender', value)}
        >
          {genderOptions.map(g => (
            <Option key={g} value={g}>
              {g.charAt(0).toUpperCase() + g.slice(1)}
            </Option>
          ))}
        </Select>
        <Select
          placeholder="Select Role"
          allowClear
          style={{ width: 150 }}
          value={filters.role}
          onChange={value => handleInputChange('role', value)}
        >
          {roleOptions.map(r => (
            <Option key={r} value={r}>
              {r}
            </Option>
          ))}
        </Select>
        <Button 
          icon={<ClearOutlined />}
          onClick={handleReset}
          type="default"
        >
          Reset Filters
        </Button>
      </Space>
    </div>
  );
};

export default UserSearch;