// file: src/pages/OwnerPage/Rating/DetailRating.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./detailRating.css";
import { Rate, message, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { getAccommodationRatings } from "../../../services/accommodationAPI";

const DetailRating = () => {
  const { id } = useParams();
  const [ratings, setRatings] = useState([]);
  const [accommodationTitle, setAccommodationTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [avgRating, setAvgRating] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAccommodationRatings();
  }, [id]);

  const fetchAccommodationRatings = async () => {
    try {
      setLoading(true);
      console.log('🔍 [DEBUG DetailRating] Fetching ratings for accommodation ID:', id);
      const response = await getAccommodationRatings(id);
      console.log('📝 [DEBUG DetailRating] API Response:', response);
      
      if (response.success) {
        console.log('✅ [DEBUG DetailRating] API Success');
        console.log('📊 [DEBUG DetailRating] Ratings:', response.ratings);
        console.log('🏠 [DEBUG DetailRating] Accommodation Title:', response.accommodationTitle);
        
        setRatings(response.ratings);
        setAccommodationTitle(response.accommodationTitle);
        
        // Tính average rating
        if (response.ratings.length > 0) {
          const total = response.ratings.reduce((sum, rating) => sum + rating.rating, 0);
          const avg = (total / response.ratings.length).toFixed(1);
          setAvgRating(avg);
          console.log('⭐ [DEBUG DetailRating] Calculated average rating:', avg);
        } else {
          console.log('📝 [DEBUG DetailRating] No ratings found for this accommodation');
        }
      } else {
        console.log('❌ [DEBUG DetailRating] API Failed:', response.message);
        message.error(response.message || 'Không thể tải dữ liệu ratings');
      }
    } catch (error) {
      console.error('💥 [DEBUG DetailRating] Error fetching accommodation ratings:', error);
      message.error('Có lỗi xảy ra khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="detail-rating-wrapper" style={{ textAlign: 'center', marginTop: 50 }}>
        <Spin size="large" />
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className="detail-rating-wrapper">
      <h2>Ratings for: {accommodationTitle}</h2>

      {ratings.length === 0 ? (
        <div className="no-rating">No ratings available yet.</div>
      ) : (
        <>
          <div className="rating-summary">
            <span>
              <strong>Average Rating:</strong>{" "}
              <Rate disabled allowHalf value={parseFloat(avgRating)} />
              <span className="rating-number">({avgRating}/5)</span>
            </span>
            <span>
              <strong>Total Reviews:</strong> {ratings.length}
            </span>
          </div>

          <div className="rating-list">
            {ratings.map((rating) => (
              <div key={rating._id} className="rating-item">
                <Rate disabled value={rating.rating} />
                <p className="comment">"{rating.comment}"</p>
                <p className="info">
                  Customer: {rating.customerId?.name || 'Anonymous'} | {formatDate(rating.createdAt)}
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
