// file TroNhanh_FE/src/pages/OwnerPage/MemberShip/membership.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './membership.css';

const Membership = () => {
  const [packages, setPackages] = useState([]);
  const [currentPackageId, setCurrentPackageId] = useState(null);

  // ⚠️ Kiểm tra đăng nhập ngay khi vào trang
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser || !storedUser.id) {
      alert("Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn!");
      window.location.href = "/login";
    }
  }, []);

  // Lấy danh sách gói membership
  const fetchMembershipPackages = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/membership-packages');
      setPackages(res.data.packages);
    } catch (err) {
      console.error("❌ Failed to load membership packages:", err);
    }
  };

  // Lấy gói membership hiện tại từ MongoDB
  const fetchCurrentPackage = async (userId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/payment/current/${userId}`);
      const pkg = res.data.package;
      if (pkg && pkg._id) {
        setCurrentPackageId(String(pkg._id)); // ✅ Ép kiểu rõ ràng
      }
    } catch (err) {
      console.error("❌ Failed to fetch current membership:", err);
    }
  };

  // Gọi dữ liệu khi trang load
  useEffect(() => {
    fetchMembershipPackages();

    const storedUser = JSON.parse(localStorage.getItem("user"));
    const userId = storedUser?.id;

    if (userId) {
      fetchCurrentPackage(userId);
    }

    const query = new URLSearchParams(window.location.search);
    const success = query.get("success");

    if (success === "false") {
      alert("❌ Thanh toán thất bại hoặc chữ ký không hợp lệ.");
    }
  }, []);

  // Xử lý khi click Subscribe

  const handleSubscribe = async (pkg) => {
  try {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const userId = storedUser?.id;

    if (!userId) {
      alert("Bạn chưa đăng nhập!");
      return;
    }

    // ✅ Nếu đang dùng đúng gói này → cảnh báo
    if (String(currentPackageId) === String(pkg._id)) {
      alert("Bạn đã mua gói thành viên này rồi.");
      return;
    }

    // ✅ Nếu đang dùng gói khác → chặn
    if (currentPackageId && String(currentPackageId) !== String(pkg._id)) {
      const currentPkg = packages.find(p => String(p._id) === String(currentPackageId));
      alert(`Bạn đã mua gói thành viên "${currentPkg?.packageName}" rồi. Chỉ khi gói đó hết hạn thì bạn mới có thể mua gói "${pkg.packageName}".`);
      return;
    }

    console.log("💡 Subscribing with userId:", userId);
    console.log("📦 Package:", pkg.packageName, "—", pkg.price);

    const res = await axios.post("http://localhost:5000/api/payment/create", {
      amount: pkg.price,
      packageId: pkg._id,
      userId: userId,
      role: "owner"
    });

    window.location.href = res.data.url;
  } catch (err) {
    console.error("❌ Error creating VNPay URL:", err);
    alert("Đã có lỗi xảy ra khi tạo thanh toán. Vui lòng thử lại.");
  }
};

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
        <img
          src={require("../../../assets/images/membership/house.png")}
          alt="House Icon"
          className="house-icon"
        />
      </div>

      <div className="plans">
        {packages.map((pkg) => (
          <div
            className={`plan-card ${String(currentPackageId) === String(pkg._id) ? "active" : ""}`}
            key={pkg._id}
          >
            <h3>{pkg.packageName}</h3>

            {String(currentPackageId) === String(pkg._id) && (
              <div className="active-badge">🎉 Gói đang được áp dụng</div>
            )}

            <button
              className="subscribe-btn"
              onClick={() => handleSubscribe(pkg)}
            >
              Subscribe
            </button>

            <ul className="plan-features">
              <li>✔ {pkg.postsAllowed} Active Posts</li>
              <li>✔ Duration: {pkg.duration} days</li>
              <li>✔ Price: {pkg.price.toLocaleString()} VND</li>
              <li>✔ {pkg.isActive ? 'Currently Active' : 'Inactive'}</li>
              {pkg.features.length > 0 ? (
                pkg.features.map((feature, index) => (
                  <li key={index}>✔ {feature}</li>
                ))
              ) : (
                <li>✘ No extra features</li>
              )}
            </ul>
            <p className="plan-description">{pkg.description}</p>
          </div>
        ))}
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
          <img
            src={require("../../../assets/images/membership/mem1.png")}
            alt="Membership Card"
            className="membership-card"
          />
          <img
            src={require("../../../assets/images/membership/mem2.png")}
            alt="Team Meeting"
            className="team-meeting"
          />
          <img
            src={require("../../../assets/images/membership/mem3.png")}
            alt="Happy Owner"
            className="happy-owner"
          />
        </div>
      </div>
    </div>
  );
};

export default Membership;