import React from "react";
import { Row, Col, Button } from "antd";
import ApartmentCard from "./ApartmentCard";
import listings from "../data/listings";

const Listings = () => (
  <div style={{ padding: "24px" }}>
    <Row gutter={[16, 16]}>
      {listings.map((item, index) => (
        <Col xs={24} md={12} lg={8} key={index}>
          <ApartmentCard listing={item} />
        </Col>
      ))}
    </Row>
    <div style={{ textAlign: "center", marginTop: 24 }}>
      <Button type="default">Show more apartments</Button>
    </div>
  </div>
);

export default Listings;
