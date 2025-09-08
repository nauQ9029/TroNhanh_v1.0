import { useParams, useNavigate } from "react-router-dom";
import { Row, Col, Button, DatePicker, Input, Divider } from "antd";
import { UserOutlined, CalendarOutlined } from "@ant-design/icons";
import { propertySampleData } from "../../../../seeders/propertySampleData";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./ApartmentDetails.css";

const PropertyDetails = () => {
  const { id } = useParams();
  const property = propertySampleData.find((p) => p.id === parseInt(id));
  const navigate = useNavigate();

  if (!property) {
    return <div className="property-not-found">Property not found.</div>;
  }

  const handleContinueBooking = () => {
    navigate("/checkout");
  };

  return (
    <div>
      {property && (
        <Row gutter={[16, 16]}>
          <Col xs={24} md={16}>
            <img
              src={property.image}
              alt="property main"
              className="property-main-image"
            />
          </Col>
          <Col xs={24} md={8}>
            <Row gutter={[8, 8]}>
              {Array.isArray(property.galleryImages) &&
                property.galleryImages.map((img, index) => (
                  <Col
                    key={index}
                    span={property.galleryImages.length <= 2 ? 24 : 12}
                  >
                    <img
                      src={img}
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
          <h1 className="property-title">{property.title}</h1>
          <p className="property-location">{property.location}</p>

          <div className="property-summary">
            {property.summary.map((item, idx) => (
              <span key={idx}>{item}</span>
            ))}
          </div>

          <h2>Description</h2>
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
            <h2 className="booking-price">£{property.price} / Month</h2>

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
                <span>£{(property.price * 0.93).toFixed(2)}</span>
              </div>
              <div className="cost-row">
                <span>Pay upon booking</span>
                <span>£{(property.price * 0.9998).toFixed(2)}</span>
              </div>
              <div className="cost-row total-cost">
                <span>Total costs</span>
                <span>£{(property.price * 1.003).toFixed(2)}</span>
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
      <Row gutter={[24, 24]} className="property-amenities">
        {property.amenities?.map((item, index) => (
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
      Molestie amet, pretium eu massa a, pharetra. Tellus quisque sollicitudin
      tristique maecenas vitae fames eget ut. Nisl commodo lacinia ultrices ut
      odio dui at. Adipiscing ac auctor hac urna dictum. Urna quis enim lobortis
      vel dignissim sed posuere. Semper lectus neque leo mollis pellentesque
      auctor pharetra, sed. Varius facilisis in sem tristique. Mauris
      condimentum pellentesque non commodo, quisque eget dolor. Et ultrices id
      placerat accumsan. Consectetur consectetur libero orci dolor dolor
      sagittis. Leo, augue sit sem adipiscing purus ut at malesuada. Dolor, eu
      dignissim adipiscing eget sed metus.
      <p></p>
      <Divider />
      <h1 className="text-heading">Location</h1>
      <div className="map-container">
        <MapContainer
          center={property.mapPosition || [51.5074, -0.1278]}
          zoom={14}
          scrollWheelZoom={false}
          className="map-leaflet"
        >
          <TileLayer
            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={property.mapPosition || [51.5074, -0.1278]}>
            <Popup>{property.title}</Popup>
          </Marker>
        </MapContainer>
      </div>
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
