import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import dayjs from "dayjs";
import {
  Row,
  Col,
  Input,
  Select,
  Radio,
  Checkbox,
  Button,
  Divider,
  notification,
  DatePicker,
} from "antd";
import {
  CalendarOutlined,
  UserOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import "./CheckoutPage.css";
import { getAccommodationById } from "../../../services/accommodationAPI";
import useUser from "../../../contexts/UserContext";

const { Option } = Select;

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const propertyId = location.state?.accommodationId;
  const [property, setProperty] = useState(null);

  // form state to auto-fill user info
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [purpose, setPurpose] = useState("");

  const [startDate, setStartDate] = useState(null);
  const [leaseDuration, setLeaseDuration] = useState(null);
  const [guests, setGuests] = useState(1);

  // get user info from context
  const { user } = useUser();
  const [paymentMethod, setPaymentMethod] = useState(null);

  // Function to disable past dates
  const disabledDate = (current) => {
    // Can not select days before today
    return current && current < dayjs().startOf('day');
  };

  // handle payment result after redirect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("success") === "true") {
      notification.success({
        message: "Payment Successful",
        description: "Your booking has been confirmed!",
      });
      setTimeout(() => {
        navigate("/");
      }, 2000);
    }
    if (params.get("success") === "false") {
      notification.error({
        message: "Payment Failed",
        description: "Your payment was not successful.",
      });
    }
  }, [navigate]);

  // VNPay booking handler
  const handleBook = async () => {
    console.log("Book button pressed");

    if (!paymentMethod) {
      notification.warning({ message: "Please select a payment method" });
      return;
    }
    if (!property) {
      notification.error({ message: "Property info not loaded" });
      return;
    }
    if (!user?._id) {
      notification.error({ message: "Please log in to book" });
      return;
    }

    if (!startDate || !leaseDuration || !guests) {
      notification.warning({ message: "Please fill in all booking details" });
      return;
    }

    // Validate that start date is not in the past
    if (startDate && startDate.isBefore(dayjs().startOf('day'))) {
      notification.error({ 
        message: "Invalid Date", 
        description: "Start date cannot be in the past. Please select today or a future date." 
      });
      return;
    }

    // 1. Create booking first
    try {
      const bookingRes = await axios.post(
        "http://localhost:5000/api/bookings",
        {
          userId: user._id,
          propertyId: property._id,
          guestInfo: {
            firstName,
            lastName,
            email,
            phone,
            purpose,
            startDate: startDate ? startDate.format("YYYY-MM-DD") : null,
            leaseDuration,
            guests,
          },
        }
      );

      // 2. Only proceed to payment if booking is created
      if (paymentMethod === "vnpay" || paymentMethod === "paypal") {
        const res = await axios.post(
          "http://localhost:5000/api/payment/create",
          {
            amount: Math.round(property.price * 1.003 + 500000),
            // packageId: property._id,
            userId: user._id,
            bookingId: bookingRes.data._id,
            type: "booking", // PLEASE MAKE SURE THIS IS THE CORRECT TYPE
          }
        );
        window.location.href = res.data.url;
      } else {
        // Handle other payment methods if needed
      }
    } catch (err) {
      notification.error({
        message: "Failed to create booking or initiate payment",
      });
    }
  };

  // prefill guest info if available from BE
  useEffect(() => {
    if (propertyId) {
      getAccommodationById(propertyId).then((data) => {
        setProperty(data);
        setFirstName(data.guestFirstName || "");
        setLastName(data.guestLastName || "");
        setEmail(data.guestEmail || "");
        setPhone(data.guestPhone || "");
        setPurpose(data.purpose || "");
      });
    }
  }, [propertyId]);

  return (
    <div className="checkout-container">
      <Row gutter={[40, 40]}>
        {/* Left side - Guest details */}
        <Col xs={24} md={14}>
          <h2 className="section-title">Guest details</h2>
          <Row gutter={16}>
            <Col span={12}>
              <Input
                placeholder="First name"
                size="large"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </Col>
            <Col span={12}>
              <Input
                placeholder="Last name"
                size="large"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </Col>
          </Row>

          <Input
            placeholder="Email"
            size="large"
            style={{ marginTop: 16 }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            addonBefore="+84"
            placeholder="Phone number"
            size="large"
            style={{ marginTop: 16 }}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <div className="sub-section">
            <p className="sub-label">Booking details</p>
            <DatePicker
              placeholder="Start date"
              suffixIcon={<CalendarOutlined />}
              value={startDate}
              onChange={setStartDate}
              disabledDate={disabledDate}
              style={{ width: "100%", marginBottom: 12 }}
            />
            <Select
              placeholder="Lease duration"
              style={{ width: "100%", marginBottom: 12 }}
              value={leaseDuration}
              onChange={setLeaseDuration}
            >
              <Option value="3">3 months</Option>
              <Option value="6">6 months</Option>
              <Option value="12">12 months</Option>
            </Select>
            <Input
              type="number"
              min={1}
              placeholder="Number of guests"
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              style={{ width: "100%" }}
            />
            <p className="sub-label">Purpose of stay</p>
            <Radio.Group
              className="purpose-options"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
            >
              <Radio value="work">Business Travel/ Work</Radio>
              <Radio value="moving">Moving to this city or country</Radio>
              <Radio value="holiday">Holiday</Radio>
              <Radio value="other">Other</Radio>
            </Radio.Group>

            {/* <Checkbox style={{ marginTop: 20 }} defaultChecked>
              I'm booking on behalf of someone else
            </Checkbox>

            <Row gutter={16} style={{ marginTop: 12 }}>
              <Col span={12}>
                <Input placeholder="Name" size="large" />
              </Col>
              <Col span={12}>
                <Input placeholder="Email of the guest" size="large" />
              </Col>
            </Row> */}
          </div>

          {/* Payment Method */}
          <div className="payment-method-section">
            <h3 className="section-title">Payment method</h3>
            <Select
              placeholder="Select payment method"
              size="large"
              style={{ width: "100%" }}
              value={paymentMethod}
              onChange={setPaymentMethod}
            >
              <Option value="vnpay">VNPay</Option>
              <Option value="paypal">PayPal</Option>
            </Select>

            <p className="terms-note">
              By clicking "Book" below, I have read and agreed to the{" "}
              <a href="#">key contract terms</a>,{" "}
              <a href="#">cancellation policy</a> and{" "}
              <a href="#">apartment & building rules</a>, and to pay the total
              amount shown.
            </p>

            <Button
              className="book-button"
              onClick={handleBook}
              disabled={!property || !user}
            >
              Book
            </Button>
          </div>
        </Col>

        {/* Right side - Summary */}
        <Col xs={24} md={10}>
          <div className="summary-card">
            <img
              src={
                property?.photos?.length
                  ? `http://localhost:5000${property.photos[0]}`
                  : "https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
              }
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

              {/* <div>
                <UserOutlined /> Guests <span style={{ marginLeft: 8 }}>1</span>
              </div> */}
              <p>All utilities are included</p>

              <Divider />

              <h4>Payment details</h4>
              <div className="payment-detail-row">
                <span>Average monthly rent</span>
                <span>
                  {property
                    ? new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(property.price * 0.93)
                    : "—"}
                  <br />
                  <span className="vat-label">incl. VAT</span>
                </span>
              </div>
              <div className="payment-detail-row">
                <span>
                  Pay upon booking <InfoCircleOutlined />
                </span>
                <span>
                  {property
                    ? new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(property.price * 0.9998)
                    : "—"}
                  <br />
                  <span className="vat-label">incl. VAT</span>
                </span>
              </div>
              <div className="payment-detail-row">
                <span>
                  Total costs <InfoCircleOutlined />
                </span>
                <span>
                  {property
                    ? new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(property.price * 1.003)
                    : "—"}
                  <br />
                  <span className="vat-label">incl. VAT</span>
                </span>
              </div>

              <Divider />

              <h4>Payment timeline</h4>
              <div className="payment-timeline">
                <div className="timeline-line"></div>

                <div className="payment-item">
                  <div className="bullet-point" />
                  <div className="payment-content">
                    <strong>Reserve this apartment</strong>
                    <div className="sub-note">
                      Due now {"(Including deposit fee)"}
                    </div>
                  </div>
                  <div className="payment-amount">
                    <span>
                      {property
                        ? new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(property.price * 1.003 + 500000)
                        : "—"}
                      <br />
                    </span>
                  </div>
                </div>

                <div className="payment-item">
                  <div className="bullet-point" />
                  <div className="payment-content">
                    <strong>After move-out</strong>
                    <div className="sub-note">
                      Receive your 500.000đ deposit after move out{" "}
                      <InfoCircleOutlined style={{ fontSize: 12 }} />
                    </div>
                  </div>
                  <div className="payment-amount">
                    <span>
                      {property
                        ? new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(property.price * 1.003 - 500000)
                        : "—"}
                      <br />
                    </span>
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