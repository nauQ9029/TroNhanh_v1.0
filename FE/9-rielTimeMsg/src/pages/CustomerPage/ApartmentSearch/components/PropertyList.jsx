import { useState } from "react";
import { Button, Card } from "antd";
import { useNavigate } from "react-router-dom";
import PropertyCard from "./PropertyCard";

const PropertyList = ({ data }) => {
  const navigate = useNavigate();
  const [visibleCount] = useState(7); // show 7

  const handleShowMore = () => {
    navigate("/customer/apartments");
  };
  // Nếu không có data
  if (!data || data.length === 0) {
    return (
      <div>
        <p>No results found</p>
      </div>
    );
  }

  // Nếu có data từ BE
  return (
    <div>
      {data.map((item) => (
        <PropertyCard key={item._id} property={item} />
      ))}

      <div style={{ marginTop: "35px", textAlign: "center" }}>
        <Button
          style={{
            backgroundColor: "#49735A",
            color: "#fff",
            padding: "10px 24px",
            fontSize: "16px",
            borderRadius: "8px",
            border: "none",
          }}
          onClick={handleShowMore}
        >
          Show more apartments
        </Button>
      </div>
    </div>
  );
};


export default PropertyList;
