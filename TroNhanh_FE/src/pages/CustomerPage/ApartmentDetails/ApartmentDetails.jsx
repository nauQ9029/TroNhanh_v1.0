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
  Select,
  Tag,
  message,
  Modal,
  List,
} from "antd";
import {
  UserOutlined,
  CalendarOutlined,
  HeartOutlined,
  HeartFilled,
  LeftOutlined,
  RightOutlined,
  CheckCircleOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import axios from "axios";
import "bootstrap-icons/font/bootstrap-icons.css";
import {
  getAccommodationById,
  addToFavorite,
  getUserFavorites,
  removeFromFavorite
} from "../../../services/accommodationAPI";
import { getUserBookingForAccommodation } from "../../../services/bookingService";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./ApartmentDetails.css";
import { useEffect, useState, useRef } from "react";
import useUser from "../../../contexts/UserContext";
import RoommatePostModal from "./RoommatePostModal";
import { getRoommatePosts } from "../../../services/roommateAPI";
// riel-time messaging
import { useSocket } from "../../../contexts/SocketContext";

import Slider from "react-slick";
import { getValidAccessToken } from "../../../services/authService";

const { Option } = Select;

const { TextArea } = Input;

const PropertyDetails = ({ accommodationId, ownerId }) => {
  const { id } = useParams();
  const [accommodation, setAccommodation] = useState();
  const [isFavorite, setIsFavorite] = useState(false);
  const [userBooking, setUserBooking] = useState(null);
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
  const [token, setToken] = useState('');
  const [messageApi, contextHolder] = message.useMessage();

  // Tạo function riêng để fetch accommodation data
  const fetchAccommodationData = async () => {
    try {
      const data = await getAccommodationById(id);
      const position = [
        parseFloat(data.location.latitude),
        parseFloat(data.location.longitude),
      ];
      setAccommodation({ ...data, position });
      const userToken = await getValidAccessToken()
      setToken(userToken)
    } catch (error) {
      console.log("No Accommodation found!");
    }
  };

  // riel-time messaging
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    fetchAccommodationData();
  }, [id]);

  useEffect(() => {
    const fetchIsFavorite = async () => {
      if (!user || !accommodation?._id) return;

      try {
        const favorites = await getUserFavorites();
        const isFav = favorites.some(
          (fav) => fav.accommodationId._id === accommodation._id
        );
        setIsFavorite(isFav);
      } catch (err) {
        console.error("Error checking favorite", err);
      }
    };

    fetchIsFavorite();
  }, [user, accommodation?._id]);

  useEffect(() => {
    const fetchUserBooking = async () => {
      if (!user || !accommodation?._id) {
        return;
      }

      try {
        const booking = await getUserBookingForAccommodation(user._id, accommodation._id);
        setUserBooking(booking);
      } catch (error) {
        console.error("Error fetching user booking:", error);
        setUserBooking(null);
      }
    };

    fetchUserBooking();
  }, [user, accommodation?._id]);

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

  // Fetch user's booking for this accommodation
  useEffect(() => {
    const fetchUserBooking = async () => {
      if (!user || !accommodation?._id) {
        return;
      }

      try {
        const booking = await getUserBookingForAccommodation(user._id, accommodation._id);
        setUserBooking(booking);
      } catch (error) {
        console.error("Error fetching user booking:", error);
        setUserBooking(null);
      }
    };

    fetchUserBooking();
  }, [user, accommodation?._id]);

  // DEBUG
  useEffect(() => {
    console.log("[DEBUG] Accommodation fetched:", accommodation);
    console.log("[DEBUG] Owner ID:", accommodation?.ownerId?._id);
  }, [accommodation]);

  useEffect(() => {
    if (!accommodationId) {
      console.log("[WARN] accommodationId is NOT ready");
      return;
    } else {
      console.log("[DEBUG] Accommodation ID:", accommodation?._id);
    }

    if (!user) {
      console.log("[WARN] User is NOT logged in");
      return;
    } else {
      console.log("[DEBUG] User ID:", user._id);
    }
  }, [accommodationId, user]);

  const navigate = useNavigate();

  if (!accommodation) {
    return <div className="accommodation-not-found">accommodation not found.</div>;
  }



  const toggleFavorite = async () => {
    if (!user) {
      messageApi.warning("Please log in to favorite this accommodation.");
      return;
    }

    try {
      if (isFavorite) {
        await removeFromFavorite(accommodation._id);
        setIsFavorite(false);
        messageApi.success("Removed from favorites");
      } else {
        await addToFavorite({ accommodationId: accommodation._id });
        setIsFavorite(true);
        messageApi.success("Added to favorites");
      }
    } catch (error) {
      console.error("Favorite toggle error:", error);
      messageApi.error("Failed to update favorites");
    }
  };


  // pass acco ID when navigating
  const handleContinueBooking = () => {
    if (!user) {
      messageApi.warning("Please log in to booking!");
      return;
    }
    navigate("/customer/checkout", { state: { accommodationId: accommodation._id } });
  };

  const handleContactOwner = () => {
    console.log("Click: ", accommodation)
    if (!accommodation || !accommodation.ownerId) return;
    navigate(`/customer/chat/${accommodation.ownerId._id}`)
  };

  const handleContactPoster = () => {
    if (!roommatePosts || !roommatePosts.user) return;

    navigate(`/customer/chat/${roommatePosts.user._id}`);
  };


  // Render booking card hoặc booking info
  const renderBookingSection = () => {
    // Kiểm tra xem accommodation có status "Booked" không
    const isBooked = accommodation.status === "Booked";

    if (userBooking) {
      // User đã có booking, hiển thị thông tin booking
      return (
        <div className="booking-card">
          <div className="booking-status-header">
            <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 20, marginRight: 8 }} />
            <h2 className="booking-success-title">You've Booked This Place!</h2>
          </div>

          <Tag color={userBooking.status === 'paid' ? 'green' : 'orange'} className="booking-status-tag">
            Status: {userBooking.status.toUpperCase()}
          </Tag>

          <Divider />

          <div className="booking-info">
            <div className="info-row">
              <span><strong>Guest Name:</strong></span>
              <span>{userBooking.guestInfo.firstName} {userBooking.guestInfo.lastName}</span>
            </div>
            <div className="info-row">
              <span><strong>Email:</strong></span>
              <span>{userBooking.guestInfo.email}</span>
            </div>
            <div className="info-row">
              <span><strong>Phone:</strong></span>
              <span>{userBooking.guestInfo.phone}</span>
            </div>
            <div className="info-row">
              <span><strong>Purpose:</strong></span>
              <span>{userBooking.guestInfo.purpose}</span>
            </div>
            <div className="info-row">
              <span><strong>Start Date:</strong></span>
              <span>{new Date(userBooking.guestInfo.startDate).toLocaleDateString('vi-VN')}</span>
            </div>
            <div className="info-row">
              <span><strong>Lease Duration:</strong></span>
              <span>{userBooking.guestInfo.leaseDuration} months</span>
            </div>
            <div className="info-row">
              <span><strong>Guests:</strong></span>
              <span>{userBooking.guestInfo.guests} person(s)</span>
            </div>

            {userBooking.status === 'paid' && userBooking.paymentInfo && (
              <>
                <Divider />
                <div className="payment-info">
                  <h3 className="booking-payment-info-title">Payment Information</h3>
                  <div className="info-row">
                    <span><strong>Amount Paid:</strong></span>
                    <span>{new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(userBooking.paymentInfo.amount)}</span>
                  </div>
                  <div className="info-row">
                    <span><strong>Transaction ID:</strong></span>
                    <span>{userBooking.paymentInfo.vnpayTransactionId}</span>
                  </div>
                  <div className="info-row">
                    <span><strong>Paid At:</strong></span>
                    <span>{new Date(userBooking.paymentInfo.paidAt).toLocaleString('vi-VN')}</span>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="booking-meta-info">
            <p className="booking-meta-text">
              Booking ID: {userBooking._id}
            </p>
            <p className="booking-meta-text">
              Booked on: {new Date(userBooking.createdAt).toLocaleString('vi-VN')}
            </p>
          </div>
        </div>
      );
    } else if (isBooked) {
      // Accommodation đã được book bởi user khác
      return (
        <div className="booking-card">
          <div className="booking-unavailable-header">
            <div className="unavailable-icon">✕</div>
            <h2 className="booking-unavailable-title">Đã hết phòng</h2>
          </div>

          <Tag color="red" className="booking-status-tag">
            KHÔNG CÒN TRỐNG
          </Tag>

          <Divider />

          <div className="unavailable-message">
            <p>Rất tiếc, căn phòng này đã được đặt bởi khách hàng khác.</p>
            <p>Hãy tìm kiếm các căn phòng khác phù hợp với bạn!</p>

            <Button
              type="primary"
              className="find-other-btn"
              onClick={() => navigate('/customer')}
            >
              Tìm phòng khác
            </Button>
          </div>

          <p className="booking-date-info">
            Accommodation đã được đặt vào {accommodation.updatedAt && new Date(accommodation.updatedAt).toLocaleDateString('vi-VN')}
          </p>
        </div>
      );
    } else {
      // User chưa có booking và accommodation chưa được book, hiển thị booking card
      return (
        <div className="booking-card">
          <h2 className="booking-price">{accommodation.price}đ/ Month</h2>

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
      );
    }
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
      messageApi.error("Please fill in all review fields.");
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
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            rating: reviewRating,
            comment: reviewContent,
            purpose: reviewPurpose,
          }),
        }
      );
      console.log("Token: ", token)
      const contentType = response.headers.get("content-type");

      if (!response.ok) {
        const errorText = contentType.includes("application/json")
          ? await response.json()
          : await response.text(); // fallback for HTML

        console.error("Submit error:", errorText);

        // Hiển thị thông báo lỗi cụ thể từ backend
        if (response.status === 403) {
          messageApi.error("You can only review accommodations that you have booked and stayed at.");
        } else if (response.status === 400) {
          messageApi.error(errorText.message || "You have already reviewed this accommodation or missing required fields.");
        } else {
          messageApi.error("Failed to submit review.");
        }
        return;
      }

      const result = await response.json();

      messageApi.success("Review submitted successfully!");

      // Refresh toàn bộ accommodation data để đảm bảo reviews được load đúng
      await fetchAccommodationData();

      setReviewContent("");
      setReviewPurpose("");
      setReviewRating(null);
    } catch (error) {
      console.error("Error submitting review:", error);
      messageApi.error("An error occurred while submitting your review.");
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
            Authorization: `Bearer ${token}`,
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
        messageApi.success("Review updated successfully!");
        setAccommodation((prev) => {
          const updatedReviews = Array.isArray(prev.reviews)
            ? prev.reviews.map((r) =>
              r._id === reviewId ? result.review : r
            )
            : [];
          return { ...prev, reviews: updatedReviews };
        });
        setEditingReviewId(null);
      } else {
        messageApi.error(result.message || "Failed to update review.");
      }
    } catch (err) {
      console.error("Error editing review:", err);
      messageApi.error("Error editing review.");
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      const confirmed = await new Promise((resolve) => {
        messageApi.warning({
          content: 'Are you sure you want to delete this review?',
          duration: 0,
          onClose: () => resolve(false),
          action: (
            <div>
              <Button size="small" type="primary" onClick={() => { messageApi.destroy(); resolve(true); }}>
                Yes
              </Button>
              <Button size="small" style={{ marginLeft: 8 }} onClick={() => { messageApi.destroy(); resolve(false); }}>
                No
              </Button>
            </div>
          ),
        });
      });

      if (!confirmed) return;

      const response = await fetch(
        `http://localhost:5000/api/accommodation/${accommodation._id}/reviews/${reviewId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (response.ok) {
        messageApi.success("Review deleted successfully.");
        setAccommodation((prev) => ({
          ...prev,
          reviews: Array.isArray(prev.reviews)
            ? prev.reviews.filter((r) => r._id !== reviewId)
            : [],
        }));
      } else {
        messageApi.error(result.message || "Failed to delete review.");
      }
    } catch (err) {
      console.error("Error deleting review:", err);
      messageApi.error("Error deleting review.");
    }
  };

  // riel-time messaging section
  const handleOpen = () => {
    if (!user) {
      return Modal.warning({ title: "Please login to message the owner." });
    }
    setIsModalOpen(true);
    fetchMessages(); // Load existing chat
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;
    const messageData = {
      senderId: user._id,
      receiverId: accommodation.ownerId,
      accommodationId: accommodation._id,
      text: inputValue,
    };
    try {
      await axios.post(
        process.env.REACT_APP_API_URL + "/messages/send",
        messageData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setMessages((prev) => [
        ...prev,
        { ...messageData, createdAt: new Date() },
      ]);
      setInputValue("");
    } catch (err) {
      console.error("Message send failed", err);
    }
  };

  const fetchMessages = async () => {
    const accommodationId = accommodation?._id;

    try {
      console.log(
        "[DEBUG] GET messages for:",
        `/api/messages/${accommodationId}`
      );

      console.log("[DEBUG] accommodationId length:", accommodationId.length);

      const res = await axios.get(process.env.REACT_APP_API_URL + `/messages/${accommodationId}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setMessages(res.data);
    } catch (err) {
      console.error("Fetch messages failed", err);
    }
  };

  return (
    <div>
      {contextHolder}
      {accommodation && (
        <Row gutter={[16, 16]}>
          <Col xs={24}>
            <div className="accommodation-main-image-wrapper">
              <img
                src={
                  accommodation.photos && accommodation.photos.length > 0
                    ? `http://localhost:5000${accommodation.photos[0]}`
                    : "/image/default-image.jpg"
                }
                alt="accommodation main"
                className="accommodation-main-image"
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
      <Row gutter={32} className="accommodation-main-content">
        <Col xs={24} md={16}>
          <h1 className="accommodation-title">{accommodation.title}</h1>
          <p className="accommodation-location">
            {[
              accommodation.location?.street,
              accommodation.location?.district,
              accommodation.location?.addressDetail,
            ]
              .filter(Boolean)
              .join(", ")}
          </p>

          <div className="accommodation-summary">
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

            {/* riel-time messaging section */}
            <>
              <Button
                type="primary"
                icon={<MessageOutlined />}
                onClick={handleOpen}
                style={{ marginTop: 16 }}
              >
                Message Owner
              </Button>

              <Modal
                title="Chat with Owner"
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
                width={600}
              >
                <div
                  style={{
                    maxHeight: "300px",
                    overflowY: "auto",
                    marginBottom: "1rem",
                  }}
                >
                  <List
                    dataSource={messages}
                    renderItem={(msg) => (
                      <List.Item
                        style={{
                          textAlign:
                            msg.senderId === user._id ? "right" : "left",
                        }}
                      >
                        <div
                          style={{
                            display: "inline-block",
                            backgroundColor:
                              msg.senderId === user._id ? "#d3f0ff" : "#f0f0f0",
                            padding: "8px 12px",
                            borderRadius: "8px",
                            maxWidth: "75%",
                          }}
                        >
                          {msg.text}
                        </div>
                      </List.Item>
                    )}
                  />
                </div>
                <TextArea
                  rows={2}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onPressEnter={(e) => {
                    e.preventDefault();
                    handleSend();
                  }}
                  placeholder="Type your message..."
                />
                <Button
                  type="primary"
                  onClick={handleSend}
                  style={{ marginTop: "10px", float: "right" }}
                >
                  Send
                </Button>
              </Modal>
            </>
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
      <Button className="booking-button" onClick={handleContactOwner}>
        Contact with Owner
      </Button>
      <Row gutter={[24, 24]} className="accommodation-amenities">
        {accommodation.amenities?.map((item, index) => (
          <Col xs={12} sm={8} md={6} key={index} className="amenity-item">
            <i className={`bi ${item.icon} amenity-icon`}></i>
            <div>
              <strong>{item.name}</strong>
              {item.note && <div className="amenity-note">{item.note}</div>}
            </div>
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
      Molestie amet, pretium eu massa a, pharetra.Tellus quisque sollicitudin
      tristique maecenas vitae fames eget ut.Nisl commodo lacinia ultrices ut
      odio dui at.Adipiscing ac auctor hac urna dictum.Urna quis enim lobortis
      vel dignissim sed posuere.Semper lectus neque leo mollis pellentesque
      auctor pharetra, sed.Varius facilisis in sem tristique.Mauris condimentum
      pellentesque non commodo, quisque eget dolor.Et ultrices id placerat
      accumsan.Consectetur consectetur libero orci dolor dolor sagittis.Leo,
      augue sit sem adipiscing purus ut at malesuada.Dolor, eu dignissim
      adipiscing eget sed metus.
      <p></p>
      <Divider />
      <h1 className="text-heading">Location</h1>
      <div className="map-container">
        <MapContainer
          center={[accommodation.location.latitude, accommodation.location.longitude]}
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
                <Card className="roommate-card" hoverable onClick={handleContactPoster}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: 12,
                    }}
                  >
                    <Avatar
                      src={
                        post.userId.avatar
                          ? `${post.userId.avatar}`
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
          <div className="leave-review-section">
            <h2 className="leave-review-title">Leave a Review</h2>

            {user ? (
              userBooking ? (
                <div className="review-form-container">
                  <div className="review-form-row">
                    <label className="review-form-label">Your Review</label>
                    <Input.TextArea
                      rows={4}
                      placeholder="Share your experience about this accommodation..."
                      value={reviewContent}
                      onChange={(e) => setReviewContent(e.target.value)}
                      className="review-custom-textarea"
                    />
                  </div>

                  <div className="review-form-row">
                    <label className="review-form-label">Purpose</label>
                    <Input
                      placeholder="e.g., Business trip, Vacation, Study"
                      value={reviewPurpose}
                      onChange={(e) => setReviewPurpose(e.target.value)}
                      className="review-custom-input"
                    />
                  </div>

                  <div className="review-form-row">
                    <label className="review-form-label">Rating (1-5)</label>
                    <Input
                      type="number"
                      min={1}
                      max={5}
                      placeholder="Rate from 1 to 5 stars"
                      value={reviewRating}
                      onChange={(e) => setReviewRating(Number(e.target.value))}
                      className="review-custom-input"
                    />
                  </div>

                  <Button
                    className="review-submit-button"
                    onClick={handleSubmitReview}
                    size="large"
                  >
                    Submit Review
                  </Button>
                </div>
              ) : (
                <div className="login-prompt-custom">
                  <div className="review-prompt-container">
                    <i className="bi bi-info-circle review-prompt-icon"></i>
                    <h3 className="review-prompt-title">Only Verified Guests Can Review</h3>
                    <p className="review-prompt-description">
                      You need to book and stay at this accommodation to leave a review.
                    </p>
                    <p className="review-prompt-note">
                      This helps ensure authentic and helpful reviews for other travelers.
                    </p>
                  </div>
                </div>
              )
            ) : (
              <div className="login-prompt-custom">
                Please log in to leave a review.
              </div>
            )}
          </div>
        </Col>

        {/* Right: Review List */}
        <Col xs={24} md={14}>
          <h2 className="reviews-section-header">
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
                    size={48}
                    style={{ backgroundColor: "#004d47", marginRight: 12 }}
                  >
                    {review.name?.[0]?.toUpperCase() ||
                      review.user?.name?.[0]?.toUpperCase() ||
                      review.customerId?.name?.[0]?.toUpperCase() ||
                      "U"}{" "}
                  </Avatar>
                  <div className="review-meta">
                    <div className="review-name-rating">
                      <strong className="review-customer-name">
                        {review.name || review.user?.name || review.customerId?.name || "Unknown User"}
                      </strong>
                      <span className="review-rating">
                        <i
                          className="bi bi-star-fill"
                          style={{ color: "#004d40" }}
                        />{" "}
                        {review.rating}/5
                      </span>
                    </div>
                    <span className="review-time">
                      • From {review.weeksAgo} weeks ago
                    </span>
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
                      max={5}
                      placeholder="Rating (1-5 stars)"
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
                      (review.user?._id || review.customerId?._id) &&
                      (String(review.user?._id || review.customerId?._id) === String(user._id)) && (
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
            <p>No reviews yet for this accommodation.</p>
          )}
        </Col>
      </Row>

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