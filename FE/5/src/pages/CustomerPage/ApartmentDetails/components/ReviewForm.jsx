import { useState } from "react";
import axios from "axios";
import { Input, Button, message } from "antd";

const ReviewForm = ({ propertyId, user }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const handleSubmit = async () => {
    // if (!user || !user.token) {
    //   message.error("You must be logged in to submit a review.");
    //   return;
    // }

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/properties/${propertyId}/reviews`,
        { rating, comment },
        // { headers: { Authorization: `Bearer ${user.token}` } }
      );
      message.success("Review submitted!");
    } catch (err) {
      console.error(err);
      message.error("Failed to submit review.");
    }
  };

  return (
    <div className="review-form">
      <h3>Leave a Review</h3>
      <Input.TextArea
        rows={4}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write your experience here..."
      />
      <Input
        type="number"
        min={1}
        max={10}
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
        style={{ marginTop: "10px", width: "100px" }}
      />
      <Button
        type="primary"
        onClick={handleSubmit}
        style={{ marginTop: "10px" }}
      >
        Submit Review
      </Button>
    </div>
  );
};

export default ReviewForm;
