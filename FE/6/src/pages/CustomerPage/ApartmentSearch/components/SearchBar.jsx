import React from "react";
import { Row, Col, Input, DatePicker, Button, Select } from "antd";
import { UserOutlined, SearchOutlined } from "@ant-design/icons";

const { RangePicker } = DatePicker;

const SearchBar = () => (
  <div style={{ padding: "16px", background: "#f9f9f9" }}>
    <Row gutter={16} align="middle">
      <Col>
        <Select placeholder="Select a city" style={{ width: 160 }}>
          <Select.Option value="london">London</Select.Option>
        </Select>
      </Col>
      <Col>
        <RangePicker />
      </Col>
      <Col>
        <Input
          prefix={<UserOutlined />}
          defaultValue="1"
          style={{ width: 100 }}
        />
      </Col>
      <Col>
        <Button type="primary" icon={<SearchOutlined />}>
          Search
        </Button>
      </Col>
    </Row>
  </div>
);

export default SearchBar;
