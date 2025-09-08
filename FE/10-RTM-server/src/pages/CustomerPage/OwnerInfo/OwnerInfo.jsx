import React from "react";
import { Row, Col, Button, Divider } from "antd";
import {
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
  CalendarOutlined,
  UserOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import "./OwnerInfo.css";

const OwnerInformation = () => {
  return (
    <div className="owner-info-container">
      <Row gutter={[32, 32]}>
        {/* Left Section - Owner Info */}
        <Col xs={24} md={12}>
          <h1 className="owner-title">Owner Information</h1>

          <div className="owner-detail">
            <span className="label">Name:</span> <span>John Due</span>
          </div>
          <div className="owner-detail">
            <span className="label">Phone:</span> <span>0123456789</span>
          </div>
          <div className="owner-detail">
            <span className="label">Email:</span> <span>JohnDue@gmail.com</span>
          </div>
          <div className="owner-detail">
            <span className="label">Address:</span> <span>Knowhere</span>
          </div>

          <Button className="contact-owner-btn">Contact owner</Button>
        </Col>

        {/* Right Section - Summary Card */}
        <Col xs={24} md={12}>
          <div className="summary-card">
            <img
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
              alt="apartment"
              className="summary-image"
            />

            <div className="summary-section">
              <Row>
                <Col span={12}>
                  <CalendarOutlined /> Move in
                  <div>31.12.2021</div>
                </Col>
                <Col span={12}>
                  <CalendarOutlined /> Move out
                  <div>31.02.2022</div>
                </Col>
              </Row>

              <Divider />

              <div>
                <UserOutlined /> Guests <span style={{ marginLeft: 8 }}>1</span>
              </div>
              <p>All utilities are included</p>

              <Divider />

              <h4>Payment timeline</h4>
              <div className="payment-item">
                <div>
                  <div className="bullet-point"></div>
                  <div>
                    <strong>Reserve this apartment</strong>
                    <div className="sub-note">Due now</div>
                  </div>
                </div>
                <div>£4001.70</div>
              </div>
              <div className="payment-item">
                <div>
                  <div className="bullet-point"></div>
                  <div>
                    <strong>After move-out</strong>
                    <div className="sub-note">
                      Receive your £400.00 deposit back within 30 days{" "}
                      <InfoCircleOutlined style={{ fontSize: 12 }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default OwnerInformation;
