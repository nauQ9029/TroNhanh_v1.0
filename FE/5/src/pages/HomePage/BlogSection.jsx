import React from "react";
import { Row, Col, Card, Typography, Button } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";

const { Title, Paragraph, Text } = Typography;

const blogData = [
  {
    id: 1,
    image: "blog1.jpg",
    title: "Turpis elit in dictum eget eget",
    description: "Convallis ac eu fames feugiat et venenatis nulla luctus.",
    time: "1 min read",
  },
  {
    id: 2,
    image: "blog2.jpg",
    title: "Faucibus egestas ut sit purus ultricies at eu",
    description:
      "Vivamus tellus risus lacus commodo urna fringilla cursus nulla amet.",
    time: "3 min read",
  },
  {
    id: 3,
    image: "blog3.jpg",
    title: "Feugiat gravida sed sit lacus sagittis",
    description: "Pellentesque ultricies hendrerit lacus lectus.",
    time: "3 min read",
  },
];

const BlogSection = () => {
  return (
    <div style={{ padding: "50px 20px", backgroundColor: "#fff" }}>
      <Title level={2} style={{ textAlign: "center", fontWeight: "bold" }}>
        Read our blog
      </Title>

      <Row gutter={[24, 24]} justify="center">
        {blogData.map((item) => (
          <Col xs={24} sm={12} md={8} key={item.id}>
            <Card
              hoverable
              cover={
                <img
                  alt={item.title}
                  src={item.image}
                  style={{ height: 200, objectFit: "cover" }}
                />
              }
            >
              <Title level={5}>{item.title}</Title>
              <Paragraph type="secondary" style={{ fontSize: "13px" }}>
                {item.description}
              </Paragraph>
              <Text type="secondary">
                <ClockCircleOutlined style={{ marginRight: 6 }} />
                {item.time}
              </Text>
            </Card>
          </Col>
        ))}
      </Row>

      <div style={{ textAlign: "center", marginTop: 30 }}>
        <Button type="primary" shape="round" size="large">
          Read more
        </Button>
      </div>
    </div>
  );
};

export default BlogSection;
