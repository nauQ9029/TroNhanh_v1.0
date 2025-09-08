import React from "react";

const AboutUs = () => {
  return (
    <div className="about-us-page" style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem", textAlign: "center" }}>About Us</h1>
      <p style={{ fontSize: "1.1rem", lineHeight: "1.8" }}>
        Welcome to <strong>Trọ Nhanh</strong> – your trusted companion in finding affordable and quality rental spaces.
        Our mission is to simplify the search for rental housing by providing a fast, transparent, and user-friendly platform.
      </p>

      <h2 style={{ marginTop: "2rem" }}>Our Vision</h2>
      <p style={{ fontSize: "1.05rem", lineHeight: "1.7" }}>
        We believe everyone deserves a safe and convenient place to live. That’s why we connect tenants and landlords 
        directly, reducing time, cost, and unnecessary hassle in the rental process.
      </p>

      <h2 style={{ marginTop: "2rem" }}>What We Offer</h2>
      <ul style={{ fontSize: "1.05rem", lineHeight: "1.7", paddingLeft: "1.5rem" }}>
        <li>Easy search for rental listings by location, price, and amenities.</li>
        <li>Verified listings to ensure trust and safety.</li>
        <li>Chat system for quick communication with landlords.</li>
        <li>Fast and responsive website on all devices.</li>
      </ul>

      <h2 style={{ marginTop: "2rem" }}>Meet the Team</h2>
      <p style={{ fontSize: "1.05rem", lineHeight: "1.7" }}>
        We are a group of passionate developers, designers, and real estate experts working together to bring
        innovation to the housing market.
      </p>

      <p style={{ marginTop: "2rem", fontStyle: "italic", textAlign: "center" }}>
        Thank you for choosing Trọ Nhanh. We are committed to making your rental experience better every day!
      </p>
    </div>
  );
};

export default AboutUs;
