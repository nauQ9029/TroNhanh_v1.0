import React from 'react';
import { Row, Col, Typography } from 'antd';

const { Title, Paragraph } = Typography;

export default function InfoSection() {
  return (
    <div className="info-section container-fluid px-0">
      <Row
        gutter={[32, 32]}
        justify="center"
        align="middle"
        className="images"
      >
        {/* Images Grid */}
        <Col xs={24} md={10} className="image-grid">
          <img className="top-left" src="DaNang1.jpg" alt="img1" />
          <img src="DaNang2.png" alt="img2" />
          <img className="bottom-left" src="DaNang3.jpg" alt="img3" />
          <img src="Danang4.jpg" alt="img4" />
        </Col>

        {/* Text Content */}
        <Col
          xs={24}
          md={10}
          className="text"
          style={{backgroundColor: 'white', padding: '0 40px', display:'flex', flexDirection:'column', justifyContent: 'center'}}
        >
          <Title level={2}>The choice is flexible</Title>
          <Paragraph>
            We believe in a world where finding a home is just a click away.
            Whether you're selling your home, travelling for work or moving to
            a new city. Just bring your bags, and we'll handle the rest.
          </Paragraph>
        </Col>
      </Row>
    </div>
  );
}
