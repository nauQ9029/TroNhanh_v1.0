// File: src/pages/OwnerPage/Rating/rating.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./rating.css";
import { Button, Table, Tag, Spin, message } from "antd";
import { Rate } from "antd";
import { getOwnerRatings } from "../../../services/accommodationAPI";

const Rating = () => {
  const navigate = useNavigate();
  const [accommodations, setAccommodations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [overallAvgRating, setOverallAvgRating] = useState(null);

  useEffect(() => {
    fetchOwnerRatings();
  }, []);

  const fetchOwnerRatings = async () => {
    try {
      setLoading(true);
      console.log('🔍 [DEBUG] Calling getOwnerRatings API...');
      const response = await getOwnerRatings();
      console.log('📝 [DEBUG] API Response:', response);
      
      if (response.success && response.accommodations) {
        console.log('✅ [DEBUG] API Success, accommodations:', response.accommodations);
        setAccommodations(response.accommodations);
        
        // Tính tổng average rating
        const accommodationsWithRatings = response.accommodations.filter(acc => acc.totalReviews > 0);
        if (accommodationsWithRatings.length > 0) {
          const totalRating = accommodationsWithRatings.reduce((sum, acc) => sum + acc.averageRating, 0);
          const avgRating = (totalRating / accommodationsWithRatings.length).toFixed(1);
          setOverallAvgRating(avgRating);
        }
      } else {
        console.log('❌ [DEBUG] API Failed or no accommodations found');
        message.error('Không thể tải dữ liệu ratings');
      }
    } catch (error) {
      console.error('💥 [DEBUG] Error fetching owner ratings:', error);
      message.error('Có lỗi xảy ra khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Accommodation Name",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Status", 
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let displayStatus = status;
        let color = "default";
        
        switch(status) {
          case "Available":
            displayStatus = "Available";
            color = "green";
            break;
          case "Booked":
            displayStatus = "Booked";
            color = "blue";
            break;
          case "Unavailable":
            displayStatus = "Unavailable";
            color = "volcano";
            break;
          default:
            displayStatus = status;
            color = "default";
        }
        
        return <Tag color={color}>{displayStatus}</Tag>;
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button
          className="view-rating-btn"
          onClick={() => navigate(`/owner/rating/${record._id}`)}
          type="primary"
        >
          View Ratings
        </Button>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="rating-wrapper" style={{ textAlign: 'center', marginTop: 50 }}>
        <Spin size="large" />
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

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
        dataSource={accommodations.map((a) => ({ ...a, key: a._id }))}
        columns={columns}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default Rating;
