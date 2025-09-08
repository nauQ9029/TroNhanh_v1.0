import React from 'react';
import { Row, Col, Card, Typography } from 'antd';

const { Title, Paragraph } = Typography;
const services = [
  {
    icon: "calendar.png",
    title: "Flexible living",
    desc: "Stay as long or as little as you need with month-to-month contracts",
  },
  {
    icon: "sofa.png",
    title: "Move-in ready",
    desc: "Ready to move in with everything you need",
  },
  {
    icon: "wi-fi.png",
    title: "High-speed Wi-Fi",
    desc: "Best in class internet speeds suitable for working from home",
  },
  {
    icon: "chat.png",
    title: "24/7 support",
    desc: "On hand team for any issues you have",
  },
];

export default function ServicesSection() {
  return (
    <div className="service_box_container">
      <Row
        justify="center"
        align="middle"
        style={{ marginTop: 20, textAlign: 'center', padding: '0 20px', background: 'white' }}
      >
        <Col xs={24} sm={20} md={16} lg={12}>
          <Title level={2}>Discover what makes our platform stand out</Title>
          <Paragraph>
            Easily browse listings, book securely, manage your stays, and explore nearby amenities—all in one platform.
          </Paragraph>
        </Col>
      </Row>
      <Row gutter={[24, 24]} justify="center">
        {services.map((item, index) => (
          <Col xs={24} sm={12} md={6} key={index}>
            <Card hoverable className="service_box" bordered={false}>
              <img src={item.icon} alt={item.title} className="icon_image mb-3" />
              <h4 style={{ fontWeight: 600 }}>{item.title}</h4>
              <p className="text-muted">{item.desc}</p>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
