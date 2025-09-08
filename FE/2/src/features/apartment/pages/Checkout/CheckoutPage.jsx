import React from "react";
import {
  Row,
  Col,
  Input,
  Select,
  Radio,
  Checkbox,
  Button,
  Divider,
} from "antd";
import {
  CalendarOutlined,
  UserOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import "./CheckoutPage.css";

const { Option } = Select;

const CheckoutPage = () => {
  return (
    <div className="checkout-container">
      <Row gutter={[40, 40]}>
        {/* Left side - Guest details */}
        <Col xs={24} md={14}>
          <h2 className="section-title">Guest details</h2>
          <Row gutter={16}>
            <Col span={12}>
              <Input placeholder="First name" size="large" />
            </Col>
            <Col span={12}>
              <Input placeholder="Last name" size="large" />
            </Col>
          </Row>

          <Input placeholder="Email" size="large" style={{ marginTop: 16 }} />

          <Input
            addonBefore="+84"
            placeholder="Phone number"
            size="large"
            style={{ marginTop: 16 }}
          />

          <div className="sub-section">
            <p className="sub-label">Purpose of stay</p>
            <Radio.Group className="purpose-options">
              <Radio value="work">Business Travel/ Work</Radio>
              <Radio value="moving">Moving to this city or country</Radio>
              <Radio value="holiday">Holiday</Radio>
              <Radio value="other">Other</Radio>
            </Radio.Group>

            <Input
              placeholder="Name of Employer/ Organisation"
              size="large"
              style={{ marginTop: 16 }}
            />

            <Checkbox style={{ marginTop: 20 }} defaultChecked>
              I'm booking on behalf of someone else
            </Checkbox>

            <Row gutter={16} style={{ marginTop: 12 }}>
              <Col span={12}>
                <Input placeholder="Name" size="large" />
              </Col>
              <Col span={12}>
                <Input placeholder="Email of the guest" size="large" />
              </Col>
            </Row>
          </div>

          {/* Payment Method */}
          <div className="payment-method-section">
            <h3 className="section-title">Payment method</h3>
            <Select
              placeholder="Select payment method"
              size="large"
              style={{ width: "100%" }}
            >
              <Option value="credit">Credit card</Option>
              <Option value="paypal">PayPal</Option>
              <Option value="bank">Bank transfer</Option>
            </Select>

            <p className="terms-note">
              By clicking "Book" below, I have read and agreed to the{" "}
              <a href="#">key contract terms</a>,{" "}
              <a href="#">cancellation policy</a> and{" "}
              <a href="#">apartment & building rules</a>, and to pay the total
              amount shown.
            </p>

            <Button className="book-button">Book</Button>
          </div>
        </Col>

        {/* Right side - Summary */}
        <Col xs={24} md={10}>
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

              <h4>Payment details</h4>
              <div className="payment-detail-row">
                <span>Average monthly rent</span>
                <span>
                  £3700
                  <br />
                  <span className="vat-label">incl. VAT</span>
                </span>
              </div>
              <div className="payment-detail-row">
                <span>
                  Pay upon booking <InfoCircleOutlined />
                </span>
                <span>
                  £3998.23
                  <br />
                  <span className="vat-label">incl. VAT</span>
                </span>
              </div>
              <div className="payment-detail-row">
                <span>
                  Total costs <InfoCircleOutlined />
                </span>
                <span>
                  £4001.70
                  <br />
                  <span className="vat-label">incl. VAT</span>
                </span>
              </div>

              <Divider />

              <h4>Payment timeline</h4>
              <div className="payment-item">
                <div className="bullet-point"></div>
                <div>
                  <strong>Reserve this apartment</strong>
                  <div className="sub-note">Due now</div>
                </div>
                <div>£4001.70</div>
              </div>

              <div className="payment-item">
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
        </Col>
      </Row>
    </div>
  );
};

export default CheckoutPage;
