// file: src/pages/OwnerPage/Rating/DetailRating.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./detailRating.css";
import { Rate, message } from "antd";
import { useNavigate } from "react-router-dom";

// Dummy ratings theo accommodationId
const dummyRatings = {
  "1": [
    {
      _id: "r1",
      customerId: "cust001",
      rating: 5,
      comment: "Rất tuyệt vời!",
      createdAt: "2024-05-01",
    },
    {
      _id: "r2",
      customerId: "cust002",
      rating: 4,
      comment: "Phòng sạch sẽ, tiện nghi.",
      createdAt: "2024-06-10",
    },
  ],
  "2": [
    {
      _id: "r3",
      customerId: "cust001",
      rating: 4,
      comment: "View biển đẹp, nhưng phòng hơi nhỏ.",
      createdAt: "2024-05-20",
    },
    {
      _id: "r4",
      customerId: "cust002",
      rating: 5,
      comment: "Chủ nhà rất nhiệt tình, sẽ quay lại!",
      createdAt: "2024-06-05",
    },
  ],
  "3": [
    {
      _id: "r3",
      customerId: "cust003",
      rating: 3,
      comment: "Vị trí đẹp nhưng hơi xa trung tâm.",
      createdAt: "2024-05-15",
    },
  ],
  "4": [
    {
      _id: "r4",
      customerId: "cust004",
      rating: 4,
      comment: "Giá hợp lý, chủ nhà thân thiện.",
      createdAt: "2024-06-01",
    },
  ],
  "5": [
    {
      _id: "r5",
      customerId: "cust005",
      rating: 5,
      comment: "Phòng như hình, rất đáng tiền.",
      createdAt: "2024-06-11",
    },
  ],
};


const accommodationNames = {
  "1": "Cozy Apartment",
  "2": "Beachfront Villa",
  "3": "Mountain Cabin",
};

const customerNames = {
  cust001: "Nguyễn Văn An",
  cust002: "Trần Thị Lan",
  cust003: "Lê Văn Cường",
  cust004: "Phạm Thị Dung",
  cust005: "Hoàng Văn Hải",
};


const DetailRating = () => {
  const { id } = useParams();
  const [ratings, setRatings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (dummyRatings[id]) {
      setRatings(dummyRatings[id]);
    } else {
      message.error("System error while loading ratings.");
    }
  }, [id]);

  const avgRating =
    ratings.length > 0
      ? (
          ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
        ).toFixed(1)
      : null;

  return (
    <div className="detail-rating-wrapper">
      <h2>Ratings for: {accommodationNames[id]}</h2>

      {ratings.length === 0 ? (
        <div className="no-rating">No ratings available yet.</div>
      ) : (
        <>
          <div className="rating-summary">
            <span>
              <strong>Average Rating:</strong>{" "}
              <Rate disabled allowHalf value={parseFloat(avgRating)} />
              <span className="rating-number">({avgRating})</span>
            </span>
            <span>
              <strong>Total Reviews:</strong> {ratings.length}
            </span>
          </div>

          <div className="rating-list">
            {ratings.map((r) => (
              <div key={r._id} className="rating-item">
                <Rate disabled value={r.rating} />
                <p className="comment">"{r.comment}"</p>
                <p className="info">
                   Customer: {customerNames[r.customerId] || r.customerId} | {r.createdAt}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
      <button className="back-btn" onClick={() => navigate("/owner/rating")}>
           Back
        </button>
    </div>
  );
};

export default DetailRating;
