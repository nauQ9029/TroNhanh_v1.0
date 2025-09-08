import { useParams, useNavigate } from "react-router-dom";
import {
  Row,
  Col,
  Button,
  DatePicker,
  Input,
  Divider,
  Carousel,
  Card,
  Avatar,
} from "antd";
import {
  UserOutlined,
  CalendarOutlined,
  HeartOutlined,
  HeartFilled,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import "bootstrap-icons/font/bootstrap-icons.css";

import {
  getAccommodationById,
  addToFavorite,
} from "../../../services/accommodationAPI";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./ApartmentDetails.css";
import { useEffect, useState, useRef } from "react";
import useUser from "../../../contexts/UserContext";
import RoommatePostModal from "./RoommatePostModal";
import { getRoommatePosts } from "../../../services/roommateAPI";
import Slider from "react-slick";

const PropertyDetails = () => {
  const { id } = useParams();
  const [accommodation, setAccommodation] = useState();
  const [isFavorite, setIsFavorite] = useState(false);
  const { user } = useUser();
  const [showModal, setShowModal] = useState(false);
  const [roommatePosts, setRoommatePosts] = useState([]);
  const sliderRef = useRef();
  const [reviewContent, setReviewContent] = useState("");
  const [reviewPurpose, setReviewPurpose] = useState("");
  const [reviewRating, setReviewRating] = useState(null);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editedReviewContent, setEditedReviewContent] = useState("");
  const [editedReviewRating, setEditedReviewRating] = useState(null);
  const [editedReviewPurpose, setEditedReviewPurpose] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAccommodationById(id);
        const position = [
          parseFloat(data.location.latitude),
          parseFloat(data.location.longitude),
        ];
        setAccommodation({ ...data, position });
      } catch (error) {
        console.log("No Accommodation found!");
      }
    };
    fetchData();
  }, [id]);

  const fetchRoommates = async () => {
    if (accommodation?._id) {
      try {
        const posts = await getRoommatePosts(accommodation._id);
        setRoommatePosts(posts);
      } catch (err) {
        console.log("Failed to load roommate posts", err);
      }
    }
  };

  useEffect(() => {
    fetchRoommates();
  }, [accommodation?._id]);

  const navigate = useNavigate();

  if (!accommodation) {
    return <div className="property-not-found">Property not found.</div>;
  }

  const toggleFavorite = async () => {
    if (!user) {
      alert("Please log in to favorite this property.");
      return;
    }
    setIsFavorite((prev) => !prev);

    try {
      await addToFavorite({
        accommodationId: accommodation._id,
      });
      console.log("Added to favorite!");
    } catch (error) {
      console.log("Failed to add to favorite", error);
    }
  };

  const handleContinueBooking = () => {
    navigate("/customer/checkout");
  };

  const sliderSettings = {
    dots: false,
    infinite: roommatePosts.length > 3,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  // review submission handler section
  const handleSubmitReview = async () => {
    if (!reviewRating || !reviewContent || !reviewPurpose) {
      alert("Please fill in all review fields.");
      return;
    }

    console.log(" >>>[DEBUG] User context before review submission:", user);

    try {
      const response = await fetch(
        `http://localhost:5000/api/accommodation/${accommodation._id}/reviews`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`, // token from UserContext
          },
          body: JSON.stringify({
            rating: reviewRating,
            comment: reviewContent,
            purpose: reviewPurpose,
          }),
        }
      );

      const contentType = response.headers.get("content-type");

      if (!response.ok) {
        const errorText = contentType.includes("application/json")
          ? await response.json()
          : await response.text(); // fallback for HTML

        console.error("Submit error:", errorText);
        alert("Failed to submit review.");
        return;
      }

      const result = await response.json();

      alert("Review submitted successfully!");
      setAccommodation((prev) => ({
        ...prev,
        reviews: [result.review, ...prev.reviews],
      }));
      setReviewContent("");
      setReviewPurpose("");
      setReviewRating(null);
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("An error occurred while submitting your review.");
    }
  };

  const handleEditReview = async (reviewId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/accommodation/${accommodation._id}/reviews/${reviewId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            rating: editedReviewRating,
            comment: editedReviewContent,
            purpose: editedReviewPurpose,
          }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        alert("Review updated!");
        setAccommodation((prev) => {
          const updatedReviews = prev.reviews.map((r) =>
            r._id === reviewId ? result.review : r
          );
          return { ...prev, reviews: updatedReviews };
        });
        setEditingReviewId(null);
      } else {
        alert(result.message || "Failed to update review.");
      }
    } catch (err) {
      console.error("Error editing review:", err);
      alert("Error editing review.");
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/accommodation/${accommodation._id}/reviews/${reviewId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      const result = await response.json();

      if (response.ok) {
        alert("Review deleted.");
        setAccommodation((prev) => ({
          ...prev,
          reviews: prev.reviews.filter((r) => r._id !== reviewId),
        }));
      } else {
        alert(result.message || "Failed to delete review.");
      }
    } catch (err) {
      console.error("Error deleting review:", err);
      alert("Error deleting review.");
    }
  };

  return (
    <div>
      {accommodation && (
        <Row gutter={[16, 16]}>
          <Col xs={24} md={16}>
            <img
              src={`http://localhost:5000${accommodation.photos}`}
              alt="property main"
              className="property-main-image"
            />
          </Col>
          <Col xs={24} md={8}>
            <Row gutter={[8, 8]}>
              {Array.isArray(accommodation.galleryImages) &&
                accommodation.galleryImages.map((img, index) => (
                  <Col
                    key={index}
                    span={accommodation.galleryImages.length <= 2 ? 24 : 12}
                  >
                    <img
                      src={`http://localhost:5000${img}`}
                      alt={`property ${index}`}
                      className="property-gallery-image"
                    />
                  </Col>
                ))}
            </Row>
          </Col>
        </Row>
      )}
      <Row gutter={32} className="property-main-content">
        <Col xs={24} md={16}>
          <h1 className="property-title">{accommodation.title}</h1>
          <p className="property-location">
            {[
              accommodation.location?.street,
              accommodation.location?.district,
              accommodation.location?.addressDetail,
            ]
              .filter(Boolean)
              .join(", ")}
          </p>

          <div className="property-summary">
            {Array.isArray(accommodation.summary) &&
              accommodation.summary.map((item, idx) => (
                <span key={idx}>{item}</span>
              ))}
          </div>

          <h2>Description</h2>
          <p>{accommodation.description}</p>

          <h3>In sed</h3>
          <p>
            In nullam eget urna suspendisse odio nunc. Eu sodales vestibulum,
            donec rutrum justo, amet porttitor vitae.
          </p>

          <h3>Adipiscing risus, fermentum</h3>
          <p>
            Laoreet risus accumsan pellentesque lacus, in nulla eu elementum.
            Mollis enim fringilla aenean diam tellus diam.
          </p>
        </Col>

        <Col xs={24} md={8}>
          <div className="booking-card">
            <h2 className="booking-price">£{accommodation.price} / Month</h2>

            <div className="booking-dates">
              <DatePicker
                placeholder="Move in"
                suffixIcon={<CalendarOutlined />}
              />
              <DatePicker
                placeholder="Move out"
                suffixIcon={<CalendarOutlined />}
              />
            </div>

            <div className="booking-guests">
              <UserOutlined />
              <Input type="number" placeholder="Guests" defaultValue={1} />
            </div>

            <p>All utilities are included</p>
            <Divider />

            <div className="booking-costs">
              <div className="cost-row">
                <span>Average monthly rent</span>
                <span>
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(accommodation.price * 0.93)}
                </span>
              </div>
              <div className="cost-row">
                <span>Pay upon booking</span>
                <span>
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(accommodation.price * 0.9998)}
                </span>
              </div>
              <div className="cost-row total-cost">
                <span>Total costs</span>
                <span>
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(accommodation.price * 1.003)}
                </span>
              </div>
            </div>

            <Button className="booking-button" onClick={handleContinueBooking}>
              Continue booking
            </Button>
            <p className="booking-note">
              When you book this apartment, your reservation will be confirmed
              instantly.
            </p>
          </div>
        </Col>
      </Row>
      <Divider />
      <h1 className="text-heading">Amenities</h1>
      <Row gutter={[32, 32]} className="property-amenities">
        {[
          {
            category: "Public Facilities",
            icon: "bi bi-building",
            items: [
              "Parking",
              "Elevator",
              "24-hour room service",
              "Restaurant",
              "Breakfast restaurant",
              "Dinner restaurant",
              "Lunch restaurant",
              "Room service",
              "Safety deposit box",
              "WiFi in public area",
            ],
          },
          {
            category: "Food and Drinks",
            icon: "bi bi-cup-straw",
            items: [
              "A la carte breakfast",
              "A la carte dinner",
              "A la carte lunch",
              "Restaurant with AC",
              "Bar",
              "Breakfast",
              "Buffet breakfast",
              "Buffet dinner",
              "Buffet lunch",
            ],
          },
          {
            category: "In-room Facilities",
            icon: "bi bi-door-closed",
            items: [
              "Bathrobe",
              "Bathtub",
              "Desk",
              "In-room safe",
              "Kitchenette",
              "Separate shower and tub",
              "Shower",
              "TV",
            ],
          },
          {
            category: "Business Facilities",
            icon: "bi bi-laptop",
            items: [
              "Business center",
              "Computer station",
              "Conference room",
              "Meeting facilities",
              "Projector",
            ],
          },
          {
            category: "Hotel Services",
            icon: "bi bi-cone-striped",
            items: [
              "Welcoming drinks",
              "Concierge",
              "Doorman",
              "24-hour Receptionist",
              "Laundry service",
            ],
          },
          {
            category: "Connectivity",
            icon: "bi bi-wifi",
            items: ["Free WiFi", "WiFi in public area (surcharge)"],
          },
          {
            category: "General",
            icon: "bi bi-sliders",
            items: ["AC", "Swimming pool"],
          },
        ].map((group, index) => (
          <Col xs={24} sm={12} md={8} key={index}>
            <h3 className="amenity-category">
              <i className={`${group.icon} amenity-category-icon`} />{" "}
              {group.category}
            </h3>
            <ul className="amenity-list">
              {group.items.map((item, idx) => (
                <li key={idx}>
                  <i className="bi amenity-icon" /> {item}
                </li>
              ))}
            </ul>
          </Col>
        ))}
      </Row>

      <Divider />
      <h1 className="text-heading">Neighbourhood</h1>
      <p>
        Ultricies etiam sit auctor aenean donec nunc, elementum etiam nisl. Sed
        arcu, sed elit egestas faucibus pellentesque. Morbi faucibus faucibus
        nam volutpat arcu lorem pharetra a. Pretium dolor nunc, dolor elit
        lectus sit amet sit. Elit enim mi ornare id ultricies accumsan proin
        amet.
      </p>
      <p>
        Molestie amet, pretium eu massa a, pharetra.Tellus quisque sollicitudin
        tristique maecenas vitae fames eget ut.Nisl commodo lacinia ultrices ut
        odio dui at.Adipiscing ac auctor hac urna dictum.Urna quis enim lobortis
        vel dignissim sed posuere.Semper lectus neque leo mollis pellentesque
        auctor pharetra, sed.Varius facilisis in sem tristique.Mauris
        condimentum pellentesque non commodo, quisque eget dolor.Et ultrices id
        placerat accumsan.Consectetur consectetur libero orci dolor dolor
        sagittis.Leo, augue sit sem adipiscing purus ut at malesuada.Dolor, eu
        dignissim adipiscing eget sed metus.
      </p>
      <Divider />
      <h1 className="text-heading">Location</h1>
      <div className="map-container">
        <MapContainer
          center={[
            accommodation.location.latitude,
            accommodation.location.longitude,
          ]}
          zoom={14}
          scrollWheelZoom={false}
          className="map-leaflet"
        >
          <TileLayer
            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {accommodation.position ? (
            <Marker key={accommodation._id} position={accommodation.position}>
              <Popup>{accommodation.title}</Popup>
            </Marker>
          ) : null}
          ;
        </MapContainer>
      </div>

      <Divider />
      <h1 className="text-heading">Looking for Roommates</h1>

      <Button
        onClick={() => setShowModal(true)}
        type="primary"
        style={{ marginBottom: "1rem" }}
      >
        + Create Roommate Post
      </Button>

      {roommatePosts.length === 0 ? (
        <p>No roommate posts yet.</p>
      ) : (
        <div style={{ position: "relative" }}>
          <Slider {...sliderSettings} ref={sliderRef}>
            {roommatePosts.map((post) => (
              <div key={post._id} style={{ padding: "0 10px" }}>
                <Card className="roommate-card" hoverable>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: 12,
                    }}
                  >
                    <Avatar
                      src={
                        post.userId?.avatar
                          ? `http://localhost:5000${post.userId?.avatar}`
                          : "/default-avatar.png"
                      }
                      size={48}
                      style={{ marginRight: 12 }}
                    />

                    <div>
                      <h3 style={{ margin: 0 }}>
                        {post.userId?.name || "Unknown"}
                      </h3>
                      <small>{post.createdAt?.slice(0, 10)}</small>
                    </div>
                  </div>

                  {post.images?.length > 0 && (
                    <Carousel autoplay>
                      {post.images.map((img, idx) => (
                        <div key={idx}>
                          <img
                            src={img}
                            alt={`post-${idx}`}
                            style={{
                              width: "100%",
                              height: 200,
                              objectFit: "cover",
                              borderRadius: 8,
                              marginBottom: 12,
                            }}
                          />
                        </div>
                      ))}
                    </Carousel>
                  )}

                  <p>{post.intro}</p>
                  <p>
                    <strong>Habits:</strong>{" "}
                    {post.habits?.join(", ") || "Not specified"}
                  </p>
                </Card>
              </div>
            ))}
          </Slider>

          {/* Custom Buttons */}
          <div className="custom-carousel-buttons">
            <button
              className="nav-button"
              onClick={() => sliderRef.current.slickPrev()}
            >
              <LeftOutlined />
            </button>
            <button
              className="nav-button"
              onClick={() => sliderRef.current.slickNext()}
            >
              <RightOutlined />
            </button>
          </div>
        </div>
      )}

      <RoommatePostModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        accommodationId={accommodation._id}
        onSuccess={fetchRoommates}
      />

      <Divider />
      <h1 className="text-heading">Reviews</h1>

      <Row gutter={32} align="top">
        {/* Left: Add Review */}
        <Col xs={24} md={10}>
          <h2 style={{ marginBottom: 16 }}>Leave a Review</h2>

          {user ? (
            <div
              style={{
                background: "#fafafa",
                padding: 24,
                borderRadius: 12,
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              <Input.TextArea
                rows={4}
                placeholder="Write your review..."
                value={reviewContent}
                onChange={(e) => setReviewContent(e.target.value)}
                style={{ marginBottom: 12 }}
              />
              <Input
                placeholder="Purpose (e.g., Business trip)"
                value={reviewPurpose}
                onChange={(e) => setReviewPurpose(e.target.value)}
                style={{ marginBottom: 12 }}
              />
              <Input
                placeholder="Rating (1–10)"
                type="number"
                min={1}
                max={10}
                value={reviewRating}
                onChange={(e) => setReviewRating(Number(e.target.value))}
                style={{ marginBottom: 12 }}
              />
              <Button className="booking-button" onClick={handleSubmitReview}>
                Submit Review
              </Button>
            </div>
          ) : (
            <p>Please log in to leave a review.</p>
          )}
        </Col>

        {/* Right: Review List */}
        <Col xs={24} md={14}>
          <h2 style={{ marginBottom: 16, textAlign: "right" }}>
            Reviews from Others
          </h2>

          {accommodation.reviews && accommodation.reviews.length > 0 ? (
            accommodation.reviews.map((review, index) => (
              <Card
                key={index}
                className="custom-review-card"
                style={{ marginBottom: 16 }}
              >
                <div className="review-header">
                  <Avatar
                    style={{ backgroundColor: "#004d47", marginRight: 12 }}
                  >
                    {review.name?.[0]?.toUpperCase() ||
                      review.user?.name?.[0]?.toUpperCase() ||
                      "U"}{" "}
                  </Avatar>
                  <div className="review-meta">
                    <strong>
                      {review.name || review.user?.name || "Unknown"}
                    </strong>{" "}
                    <div className="review-rating-date">
                      <span className="review-rating">
                        <i
                          className="bi bi-star-fill"
                          style={{ color: "#004d47" }}
                        />{" "}
                        {review.rating.toFixed(1)} /10
                      </span>
                      <span className="review-time">
                        • From {review.weeksAgo} weeks ago
                      </span>
                    </div>
                  </div>
                </div>

                {editingReviewId === review._id ? (
                  <>
                    <Input.TextArea
                      rows={3}
                      value={editedReviewContent}
                      onChange={(e) => setEditedReviewContent(e.target.value)}
                      style={{ marginBottom: 8 }}
                    />
                    <Input
                      type="number"
                      min={1}
                      max={10}
                      placeholder="Rating"
                      value={editedReviewRating}
                      onChange={(e) =>
                        setEditedReviewRating(Number(e.target.value))
                      }
                      style={{ marginBottom: 8 }}
                    />
                    <Input
                      placeholder="Purpose"
                      value={editedReviewPurpose}
                      onChange={(e) => setEditedReviewPurpose(e.target.value)}
                      style={{ marginBottom: 8 }}
                    />
                    <Button
                      type="primary"
                      onClick={() =>
                        handleEditReview(review._id || review?.user?._id)
                      }
                    >
                      Save
                    </Button>
                    <Button
                      onClick={() => setEditingReviewId(null)}
                      style={{ marginLeft: 8 }}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <div className="review-body">
                    <p>{review.comment}</p>
                    <p>
                      <strong>Purpose:</strong> {review.purpose}
                    </p>

                    {user &&
                      review.user?._id &&
                      String(review.user._id) === String(user._id) && (
                        <div className="review-action-buttons">
                          <Button
                            size="small"
                            onClick={() => {
                              setEditingReviewId(review._id);
                              setEditedReviewContent(review.comment);
                              setEditedReviewRating(review.rating);
                              setEditedReviewPurpose(review.purpose);
                            }}
                          >
                            Edit
                          </Button>

                          <Button
                            size="small"
                            onClick={() => handleDeleteReview(review._id)}
                            style={{ marginLeft: 8 }}
                          >
                            Delete
                          </Button>
                        </div>
                      )}
                  </div>
                )}
              </Card>
            ))
          ) : (
            <p>No reviews yet for this property.</p>
          )}
        </Col>
      </Row>

      <Divider />

      <Divider />
      <h1 className="text-heading">Policy detail</h1>
      <Row gutter={[32, 32]} justify="center">
        <Col xs={24} md={8}>
          <h3>House rules</h3>
          <ul className="policy-list">
            <li>
              <i className="bi bi-clock-fill" /> Checkin time
            </li>
            <li>
              <i className="bi bi-clock-fill" /> Checkout time
            </li>
            <li>
              <i className="bi bi-x-circle" /> No smoking
            </li>
            <li>
              <i className="bi bi-slash-circle" /> No pets
            </li>
            <li>
              <i className="bi bi-ban" /> No parties or events
            </li>
          </ul>
        </Col>

        <Col xs={24} md={8}>
          <h3>Cancellation Policy</h3>
          <ul className="policy-list">
            <li>
              <i className="bi bi-dot" /> Free cancellation up to 24hrs before
              checkin
            </li>
          </ul>
        </Col>

        <Col xs={24} md={8}>
          <h3>Health & Safety</h3>
          <ul className="policy-list">
            <li>
              <i className="bi bi-shield-check" /> Cleaner follows COVID policy
            </li>
          </ul>
        </Col>
      </Row>
    </div>
  );
};

export default PropertyDetails;
