import React from "react";
import { Input, Button } from "antd";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaGithub,
  FaYoutube,
  FaLinkedin
} from "react-icons/fa";
import './footer.css';

const FooterComponent = () => {
  return (
    <footer className="footer-compact">
      <div className="footer-content">
        <div className="footer-grid">
          {/* Logo & Contact */}
          <div className="footer-column">
            <img src="Logo_TrọNhanh.png" alt="Logo" className="footer-logo" />
            <p className="contact-number">Contact number: 02033074477</p>
            <div className="social-links">
              <a href="#"><FaFacebookF /></a>
              <a href="#"><FaInstagram /></a>
              <a href="#"><FaTwitter /></a>
              <a href="#"><FaGithub /></a>
              <a href="#"><FaYoutube /></a>
            </div>
            <p className="footer-copy">© 2021 Flex Living</p>
          </div>

          {/* Company */}
          <div className="footer-column">
            <h4>Company</h4>
            <a href="#">Home</a>
            <a href="#">About us</a>
            <a href="#">Our team</a>
          </div>

          {/* Guests */}
          <div className="footer-column">
            <h4>Guests</h4>
            <a href="#">Blog</a>
            <a href="#">FAQ</a>
            <a href="#">Career</a>
          </div>

          {/* Privacy */}
          <div className="footer-column">
            <h4>Privacy</h4>
            <a href="#">Terms of Service</a>
            <a href="#">Privacy Policy</a>
          </div>

          {/* Subscribe */}
          <div className="footer-column">
            <h4>Stay up to date</h4>
            <p>Be the first to know about our newest apartments</p>
            <Input placeholder="Email address" className="email-input" />
            <Button type="primary" className="subscribe-button">Subscribe</Button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterComponent;
