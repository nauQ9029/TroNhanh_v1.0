import { Tag } from "antd";
import { Link } from "react-router-dom";

const PropertyCard = ({ property }) => {
  return (
    <Link
      to={`/customer/property/${property.id}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <div
        style={{
          display: "flex",
          background: "#fff",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          marginBottom: "16px",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.02)";
          e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.1)";
        }}
      >
        <img
          alt="property"
          src={property.image}
          style={{
            width: "200px",
            height: "150px",
            objectFit: "cover",
          }}
        />
        <div style={{ padding: "16px", flex: 1 }}>
          <h3 style={{ margin: 0, marginBottom: "8px" }}>{property.title}</h3>
          <p style={{ margin: 0, marginBottom: "8px", color: "#555" }}>
            {property.locationDetails}
          </p>
          <p style={{ margin: 0, marginBottom: "8px", color: "#555" }}>
            {property.roomDetails}
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Tag
              style={{
                backgroundColor: "#49735A",
                color: "#fff",
                borderRadius: "8px",
                padding: "4px 12px",
                fontWeight: "bold",
                fontSize: "14px",
              }}
            >
              Available {property.available}
            </Tag>
            <span style={{ fontSize: "16px" }}>
              from <span style={{ fontWeight: "bold" }}>£{property.price}</span>{" "}
              /month
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
