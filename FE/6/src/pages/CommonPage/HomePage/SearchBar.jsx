import React, { useState } from 'react';
import { Row, Col, Select, Input, Button } from 'antd';

const { Option } = Select;

export default function SearchBar({ onSearch }) {
  const [district, setDistrict] = useState('');
  const [street, setStreet] = useState('');
  const [facilities, setFacilities] = useState('');

  const handleSearch = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ district, street, facilities }),
      });

      const data = await response.json();
      console.log('Search result:', data);

      if (onSearch) {
        onSearch(data);
      }
    } catch (err) {
      console.error('Error Searching:', err);
    }
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
            placeholder="Nearby facilities (mart, convenience stores, etc.)"
            value={facilities}
            onChange={(e) => setFacilities(e.target.value)}
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
