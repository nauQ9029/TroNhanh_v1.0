import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import "./bookingResult.css";
import useUser from "../../../contexts/UserContext";

const BookingResult = () => {
  const { user } = useUser();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const success = query.get("success");
  const bookingId = query.get("bookingId");

  const [status, setStatus] = useState(null);

  useEffect(() => {
    if (success === "true") {
      setStatus("success");
    } else {
      setStatus("fail");
    }
  }, [success]);

  return (
    <main className="ticket-system">
      <div className="top">
        <h1 className="title">
          {status === "success"
            ? "Booking successful, your invoice is being printed..."
            : "Booking failed, check your order again."}
        </h1>
        <div className="printer" />
      </div>

      <div className="receipts-wrapper">
        <div className="receipts">
          <div className={`receipt ${status === "success" ? "" : "fail"}`}>
            <h2 className="receipt-title">
              {status === "success"
                ? "🧾 BOOKING INVOICE"
                : "❌ BOOKING FAILED"}
            </h2>

            <div className="details">
              <div className="item">
                <span>Status</span>
                <h3>{status === "success" ? "Success " : "Failure "}</h3>
              </div>
              <div className="item">
                <span>Booking code</span>
                <h3>{bookingId || "Undefined"}</h3>
              </div>
              <div className="item">
                <span>Time</span>
                <h3>{new Date().toLocaleString("vi-VN")}</h3>
              </div>
              <div className="item">
                <span>Customer</span>
                <h3>{user?.name || "Customer"}</h3>
              </div>
            </div>

            <div className="footer-btn">
              <Link to="/" className="btn-back">
                {status === "success" ? "Back to Home" : "Try again"}
              </Link>
            </div>
          </div>

          <div className="receipt qr-code">
            <img
              src={`${process.env.PUBLIC_URL}/Logo_TrọNhanh.png`}
              alt="Logo TrọNhanh"
              className="qr"
            />
            <div className="description">
              <h2>TroNhanh.vn</h2>
              <p>Thank you for booking at TroNhanh</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default BookingResult;
