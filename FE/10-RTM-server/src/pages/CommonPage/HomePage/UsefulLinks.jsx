import React from 'react';
import { Row, Col, Typography } from 'antd';

const { Title, Link } = Typography;

export default function UsefulLinks() {
  return (
    <div className="container py-5">
      <Title level={5} strong>
        Useful links
      </Title>
      <Row gutter={[32, 16]}>
        <Col xs={24} md={12}>
          <ul className="list-unstyled">
            <li><Link href="#">West London Apartments →</Link></li>
            <li><Link href="#">Riverside Apartments →</Link></li>
            <li><Link href="#">Apartments in Finance Sector City of London →</Link></li>
            <li><Link href="#">Apartments in Soho, Fitrovia →</Link></li>
            <li><Link href="#">East London Apartments →</Link></li>
          </ul>
        </Col>
        <Col xs={24} md={12}>
          <ul className="list-unstyled">
            <li><Link href="#">Suitable for Families or Groups →</Link></li>
            <li><Link href="#">Apartments with Parking →</Link></li>
            <li><Link href="#">Apartments with Elevator →</Link></li>
            <li><Link href="#">Apartments suitable for physical disabilities →</Link></li>
          </ul>
        </Col>
      </Row>
    </div>
  );
}
