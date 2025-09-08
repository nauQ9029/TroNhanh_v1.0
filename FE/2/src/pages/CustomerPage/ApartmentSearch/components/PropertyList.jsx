import { useState } from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import PropertyCard from "./PropertyCard";
import { propertySampleData } from "../../../../seeders/propertySampleData";

const PropertyList = () => {
  const navigate = useNavigate();
  const [visibleCount] = useState(7); // show 7

  const handleShowMore = () => {
    navigate("/customer/apartments");
  };

  return (
    <div>
      {propertySampleData.slice(0, visibleCount).map((property) => (
        <PropertyCard key={property.id} property={property} />
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
