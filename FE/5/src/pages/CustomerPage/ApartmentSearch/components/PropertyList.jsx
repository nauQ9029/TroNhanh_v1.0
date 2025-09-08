import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import PropertyCard from "./PropertyCard";
// import { propertySampleData } from "../../../../seeders/propertySampleData";

const PropertyList = ({ properties }) => {
  const navigate = useNavigate();
  const [visibleCount] = useState(7); // show 7

  const handleShowMore = () => {
    navigate("/customer/apartments");
  };

  return (
    <div>
      {properties.slice(0, visibleCount).map((property) => (
        <PropertyCard key={property._id || property.id} property={property} />
      ))}

      {/* Show More button */}
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
