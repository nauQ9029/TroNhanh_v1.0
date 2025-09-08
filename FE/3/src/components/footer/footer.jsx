import React from "react";
import { Divider } from "antd";
import { 
  FaFacebookF, 
  FaInstagram, 
  FaTwitter, 
  FaGithub, 
  FaYoutube 
} from "react-icons/fa";
import './footer.css';

const FooterComponent = () => {
  return (
    <footer className="footer-compact">
      <div className="footer-content">
        <div className="footer-main">
          {/* Brand Section */}
          <div className="footer-brand">
            <div className="brand-info">
              <img src="/logo" alt="Logo" className="footer-logo" />
              <span className="brand-name">Tro Nhanh</span>
            </div>
            <div className="social-links">
              <a href="#" className="social-link"><FaFacebookF /></a>
              <a href="#" className="social-link"><FaInstagram /></a>
              <a href="#" className="social-link"><FaTwitter /></a>
              <a href="#" className="social-link"><FaGithub /></a>
              <a href="#" className="social-link"><FaYoutube /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-links">
            <div className="link-group">
              <a href="#">About</a>
              <a href="#">Courses</a>
              <a href="#">Support</a>
              <a href="#">Contact</a>
            </div>
            <Divider type="vertical" className="divider" />
            <div className="link-group">
              <a href="#">Terms</a>
              <a href="#">Privacy</a>
              <a href="#">Help</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2024 Tro Nhanh. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default FooterComponent;
