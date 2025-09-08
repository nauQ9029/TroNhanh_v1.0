// File: src/pages/OwnerPage/Rating/rating.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./rating.css";
import { Button, Table, Tag } from "antd";
import { Rate } from "antd"; // Thêm dòng này nếu chưa có


// Dummy data accommodations (id + name + status)
const accommodations = [
  { id: "1", name: "Phòng trọ Quận 1", status: "Available" },
  { id: "2", name: "Phòng trọ Thủ Đức", status: "Unavailable" },
  { id: "3", name: "Phòng trọ Gò Vấp", status: "Available" },
  { id: "4", name: "Phòng trọ Bình Thạnh", status: "Unavailable" },
  { id: "5", name: "Phòng trọ Quận 3", status: "Available" },
];

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


// Gom toàn bộ rating lại
const allRatings = Object.values(dummyRatings).flat();

// Tính điểm trung bình toàn bộ
const overallAvgRating =
  allRatings.length > 0
    ? (allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length).toFixed(1)
    : null;


const Rating = () => {
  const navigate = useNavigate();

  const columns = [
    {
      title: "Accommodation Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const displayStatus = status === "Available" ? "Available" : "Unavailable";
        const color = displayStatus === "Available" ? "green" : "volcano";
        return <Tag color={color}>{displayStatus}</Tag>;
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button
          className="view-rating-btn"
          onClick={() => navigate(`/owner/rating/${record.id}`)}
        >
          View Ratings
        </Button>
      ),
    },
  ];

  return (
    <div className="rating-wrapper">
      <h2>Your Accommodations</h2>
      {overallAvgRating && (
      <div className="overall-rating">
<strong>Overall Average Rating:</strong>{" "}
<Rate disabled allowHalf value={parseFloat(overallAvgRating)} /> ({overallAvgRating})
      </div>
)}

      <Table
        className="rating-table"
        dataSource={accommodations.map((a) => ({ ...a, key: a.id }))}
        columns={columns}
        pagination={false}
      />
    </div>
  );
};

export default Rating;
