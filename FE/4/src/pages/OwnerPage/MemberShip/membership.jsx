import React from 'react';
import './membership.css';

const Membership = () => {
  return (
    <div className="membership-container">
      <div className="membership-header">
        <div className="header-left">
          <h2>Membership Plans</h2>
          <ul className="benefits-list">
            <li>💰 Save on posting costs for your rental listings</li>
            <li>👍 Manage your room listings easily and efficiently</li>
            <li>🌟 Access exclusive advanced features for members</li>
          </ul>
        </div>
        <img src={require("../../../assets/images/membership/house.png")} alt="House Icon" className="house-icon" />
      </div>
      <div className="plans">
        <div className="plan-card basic">
          <h3>Basic Member</h3>
          <button className="subscribe-btn">Subscribe</button>
          <ul className="plan-features">
            <li>✔ 10 Active Posts</li>
            <li>✔ 3 images per Post</li>
            <li>✘ No priority or highlight</li>
            <li>✔ Cost 100k / Month</li>
          </ul>
          <p className="plan-description">Best for new owner or those with a few rental rooms</p>
        </div>
        <div className="plan-card standard">
          <h3>Standard Member</h3>
          <button className="subscribe-btn">Subscribe</button>
          <ul className="plan-features">
            <li>✔ 30 Active Posts</li>
            <li>✔ 5 images per Post</li>
            <li>✔ Priority Listing</li>
            <li>✔ Top Search Position</li>
            <li>✔ Cost 250k / Month</li>
          </ul>
          <p className="plan-description">Best for owners with rental business experience (10 rooms or more)</p>
        </div>
        <div className="plan-card premium">
          <h3>Premium Member</h3>
          <button className="subscribe-btn">Subscribe</button>
          <ul className="plan-features">
            <li>✔ Unlimited Posts</li>
            <li>✔ Unlimited image per Post</li>
            <li>✔ Priority Listing</li>
            <li>✔ Top Search Position</li>
            <li>✔ Cost 400k / Month</li>
          </ul>
          <p className="plan-description">Best for professional owners or agencies with large budgets</p>
        </div>
      </div>
      <div className="upgrade-section">
        <div className="upgrade-left">
          <h3>Why Upgrade Your Membership?</h3>
          <ul className="upgrade-benefits">
            <li>✔ Reach more renters with higher listing visibility</li>
            <li>✔ Stand out with priority placement and more images</li>
            <li>✔ Save time with bulk posting tools and smart features</li>
          </ul>
        </div>
        <div className="upgrade-images">
          <img src={require("../../../assets/images/membership/mem1.png")} alt="Membership Card" className="membership-card" />
          <img src={require("../../../assets/images/membership/mem2.png")} alt="Team Meeting" className="team-meeting" />
          <img src={require("../../../assets/images/membership/mem3.png")} alt="Happy Owner" className="happy-owner" />
        </div>
      </div>
    </div>
  );
};

export default Membership;