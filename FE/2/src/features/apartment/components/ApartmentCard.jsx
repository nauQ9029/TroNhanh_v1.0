import { Card, Tag, Space } from "antd";
import {
  HomeOutlined,
  WifiOutlined,
  CarOutlined,
  EyeOutlined,
} from "@ant-design/icons";

const ApartmentCard = ({ apartment }) => {
  return (
    <Card
      hoverable
      cover={
        <img
          alt="apartment"
          src={apartment.image}
          style={{ height: 200, objectFit: "cover" }}
        />
      }
    >
      <h3>{apartment.title}</h3>
      <Space>
        <Tag>{apartment.bedroom} bedroom</Tag>
        <Tag>{apartment.bathroom} bath</Tag>
        {apartment.wifi && <WifiOutlined />}
        <Tag icon={<EyeOutlined />}>{apartment.view}</Tag>
      </Space>
      <div style={{ marginTop: 10 }}>
        <Tag color="green">Available {apartment.availableFrom}</Tag>
        <div style={{ fontWeight: "bold" }}>From £{apartment.price}/month</div>
      </div>
    </Card>
  );
};

export default ApartmentCard;
