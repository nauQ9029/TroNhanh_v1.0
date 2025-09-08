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
  Spin,
  Dropdown,
  Menu,
} from "antd";
import {
  UserOutlined,
  HeartOutlined,
  HeartFilled,
  LeftOutlined,
  RightOutlined,
  DownOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import {
  getAccommodationById,
  addToFavorite,
} from "../../../services/accommodationAPI";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./ApartmentDetails.css";
import useUser from "../../../contexts/UserContext";
import RoommatePostModal from "./RoommatePostModal";
import { getRoommatePosts } from "../../../services/roommateAPI";
import Slider from "react-slick";

import ReviewForm from "./components/ReviewForm";
const sortOptions = [
  { key: "relevant", label: "Most relevant" },
  { key: "recent", label: "Most recent" },
  { key: "high_to_low", label: "Rating (High to Low)" },
  { key: "low_to_high", label: "Rating (Low to High)" },
];

const PropertyDetails = () => {
  const { id } = useParams();
  const [property, setProperty] = useState();
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const { user } = useUser();
  const [showModal, setShowModal] = useState(false);
  const [roommatePosts, setRoommatePosts] = useState([]);
  const sliderRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAccommodationById(id);
        console.log("Fetched property:", data);
        const position = [
          Number(data.location.latitude),
          Number(data.location.longitude),
        ];
        setProperty({ ...data, position });
      } catch (error) {
        console.log("No Accommodation found!", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const fetchRoommates = async () => {
    if (property?._id) {
      try {
        const posts = await getRoommatePosts(property._id);
        setRoommatePosts(posts);
      } catch (err) {
        console.log("Failed to load roommate posts", err);
      }
    }
  };

  useEffect(() => {
    fetchRoommates();
  }, [property?._id]);

  const navigate = useNavigate();

  const [selectedSort, setSelectedSort] = useState("relevant");
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const handleSortChange = ({ key }) => {
    setSelectedSort(key);
  };

  const menu = (
    <Menu
      selectedKeys={[selectedSort]}
      onClick={handleSortChange}
      className="sort-dropdown-menu"
    >
      {sortOptions.map((opt) => (
        <Menu.Item key={opt.key}>{opt.label}</Menu.Item>
      ))}
    </Menu>
  );

  if (loading)
    return (
      <Spin size="large" style={{ marginTop: "100px", display: "block" }} />
    );
  if (!property) {
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
        accommodationId: property._id,
      });
      console.log("Added to favorite!");
    } catch (error) {
      console.log("Failed to add to favorite", error);
    }
  };

  const handleContinueBooking = () => {
    navigate("/customer/checkout");
  };
  // calculate total
  const totalReviews = property.reviews?.length || 0;
  // calculate avg rating for each property
  const averageRating =
    totalReviews > 0
      ? (
          property.reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews
        ).toFixed(1)
      : "0.0";

  // const handleContinueBooking = () => {
  //   navigate("/customer/checkout");
  // };

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

  return (
    <div>
      {property && (
        <Row gutter={[16, 16]}>
          <Col xs={24}>
            <div className="property-main-image-wrapper">
              <img
                src={
                  property.photos && property.photos.length > 0
                    ? `http://localhost:5000${property.photos[0]}`
                    : "/image/default-image.jpg"
                }
                alt="property main"
                className="property-main-image"
              />
              <button className="favorite-btn" onClick={toggleFavorite}>
                {isFavorite ? (
                  <HeartFilled style={{ color: "red", fontSize: 24 }} />
                ) : (
                  <HeartOutlined style={{ color: "black", fontSize: 24 }} />
                )}
              </button>
            </div>
          </Col>
        </Row>
      )}
      <Row gutter={32} className="property-main-content">
        <Col xs={24} md={16}>
          <h1 className="property-title">{property.title}</h1>
          <p className="property-location">
            {[
              property.location?.street,
              property.location?.district,
              property.location?.addressDetail,
            ]
              .filter(Boolean)
              .join(", ")}
          </p>

          <div className="property-summary">
            {Array.isArray(property.summary) &&
              property.summary.map((item, idx) => (
                <span key={idx}>{item}</span>
              ))}
          </div>

          <h2>About {property.title}</h2>
          <p>{property.description}</p>

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
            <h2 className="booking-price">
              <span style={{ fontWeight: "bold" }}>
                {(property.price * 1000).toLocaleString("vi-VN")}₫
              </span>
              /month
            </h2>

            <div className="booking-guests">
              <UserOutlined />
              <Input type="number" placeholder="Guests" defaultValue={1} />
            </div>

            <p>All utilities are included</p>
            <Divider />

            <div className="booking-costs">
              <div className="cost-row">
                <span>Average monthly rent</span>
                <span>{(property.price * 1000).toLocaleString("vi-VN")}₫</span>
              </div>
              <div className="cost-row">
                <span>Pay upon booking</span>
                <span>
                  {Math.round(property.price * 1000 * 0.9998).toLocaleString(
                    "vi-VN"
                  )}
                  ₫
                </span>
              </div>
              <div className="cost-row total-cost">
                <span>Total costs</span>
                <span>
                  {Math.round(
                    property.price * 1000 * 0.9998 + 300000
                  ).toLocaleString("vi-VN")}
                  ₫
                </span>
              </div>
            </div>

            {/* <Button className="booking-button" onClick={handleContinueBooking}>
              Continue booking
            </Button> */}
            <p className="booking-note">
              Please be patient. When you book this apartment, your reservation
              will be confirmed by the owner in a moment.
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
                  <i className="bi bi-circle amenity-icon" /> {item}
                </li>
              ))}
            </ul>
          </Col>
        ))}
      </Row>
      <Divider />

      {/* ____________________ Reviews ____________________ */}
      <h1 className="text-heading">Rating & Reviews</h1>

      <div className="review-summary-box booking-style-rating">
        <div className="rating-badge">{averageRating}</div>
        <div className="rating-text">
          <div className="rating-label">Excelent</div>
          <div className="rating-count">From {totalReviews} reviews</div>
        </div>
      </div>

      <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
        <Col>
          <div className="filter-box">
            <Dropdown overlay={menu} trigger={["click"]}>
              <button
                className="sort-dropdown-trigger"
                onClick={(e) => e.preventDefault()}
              >
                <span className="sort-label-left">
                  <FilterOutlined style={{ marginRight: 6 }} />
                  Sort by:{" "}
                  <span className="selected-sort-label">
                    {sortOptions.find((o) => o.key === selectedSort)?.label}
                  </span>
                </span>
                <DownOutlined
                  style={{ color: "#49735a", marginLeft: "auto" }}
                />
              </button>
            </Dropdown>
          </div>
        </Col>
      </Row>
      <Divider />

      <ReviewForm
        propertyId={property._id}
        user={currentUser}
        onReviewSubmitted={(newReview) => {
          setProperty((prev) => ({
            ...prev,
            reviews: [newReview, ...(prev.reviews || [])],
          }));
        }}
      />

      <h2 className="text-subheading">Top Reviews</h2>
      {property.reviews?.map((review, index) => (
        <div className="review-item" key={index}>
          <Row>
            <Col span={24}>
              <div className="review-header">
                <div className="reviewer-info">
                  <div className="reviewer-name">{review.name}</div>
                  <div className="review-rating">
                    <span className="rating-score">
                      {review.rating.toFixed(1)}
                    </span>
                    <span className="rating-out-of">/10</span>
                    <span className="review-time">
                      {" "}
                      – {review.weeksAgo} weeks ago
                    </span>
                  </div>
                </div>
                <div className="review-purpose">
                  <i className="bi bi-person-check" /> {review.purpose}
                </div>
              </div>
              <p className="review-comment">"{review.comment}"</p>
            </Col>
          </Row>
          <Divider />
        </div>
      ))}

      <h1 className="text-heading">Neighbourhood</h1>
      <p>
        Ultricies etiam sit auctor aenean donec nunc, elementum etiam nisl. Sed
        arcu, sed elit egestas faucibus pellentesque. Morbi faucibus faucibus
        nam volutpat arcu lorem pharetra a. Pretium dolor nunc, dolor elit
        lectus sit amet sit. Elit enim mi ornare id ultricies accumsan proin
        amet.
      </p>
      <p>
        Molestie amet, pretium eu massa a, pharetra. Tellus quisque sollicitudin
        tristique maecenas vitae fames eget ut. Nisl commodo lacinia ultrices ut
        odio dui at. Adipiscing ac auctor hac urna dictum. Urna quis enim
        lobortis vel dignissim sed posuere. Semper lectus neque leo mollis
        pellentesque auctor pharetra, sed. Varius facilisis in sem tristique.
        Mauris condimentum pellentesque non commodo, quisque eget dolor. Et
        ultrices id placerat accumsan. Consectetur consectetur libero orci dolor
        dolor sagittis. Leo, augue sit sem adipiscing purus ut at malesuada.
        Dolor, eu dignissim adipiscing eget sed metus.
      </p>
      <Divider />
      <h1 className="text-heading">Location</h1>
      <div className="map-container">
        <MapContainer
          center={[property.location.latitude, property.location.longitude]}
          zoom={14}
          scrollWheelZoom={false}
          className="map-leaflet"
        >
          <TileLayer
            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {property.position ? (
            <Marker key={property._id} position={property.position}>
              <Popup>{property.title}</Popup>
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
        accommodationId={property._id}
        onSuccess={fetchRoommates}
      />

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
