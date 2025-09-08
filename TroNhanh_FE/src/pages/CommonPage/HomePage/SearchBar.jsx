import React, { useState } from 'react';
import { Row, Col, Select, Input, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

export default function SearchBar() {
  const [district, setDistrict] = useState('');
  const [street, setStreet] = useState('');
  const [streetDetails, setStreetDetails] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    const filters = {
      district,
      street,
      streetDetails,
    };

    navigate("/customer/search", { state: filters });
  };

  return (
    <div className="search-box container mt-4">
      <Row gutter={[16, 16]} align="middle">
        <Col xs={24} md={6}>
          <Select
            value={district}
            onChange={(value) => setDistrict(value)}
            placeholder="Select district"
            style={{ width: '100%' }}
            allowClear
          >
            <Option value="">Select district</Option>
            <Option value="Liên Chiểu">Liên Chiểu</Option>
            <Option value="Hải Châu">Hải Châu</Option>
            <Option value="Thanh Khê">Thanh Khê</Option>
            <Option value="Cẩm Lệ">Cẩm Lệ</Option>
            <Option value="Sơn Trà">Sơn Trà</Option>
            <Option value="Ngũ Hành Sơn">Ngũ Hành Sơn</Option>
          </Select>
        </Col>

        <Col xs={24} md={6}>
          <Input
            placeholder="Name street"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
          />
        </Col>

        <Col xs={24} md={8}>
          <Input
            placeholder="Street Details"
            value={streetDetails}
            onChange={(e) => setStreetDetails(e.target.value)}
          />
        </Col>

        <Col xs={24} md={4}>
          <Button
            type="primary"
            block
            onClick={handleSearch}
            style={{ fontWeight: 500 }}
          >
            Search
          </Button>
        </Col>
      </Row>
    </div>
  );
}
