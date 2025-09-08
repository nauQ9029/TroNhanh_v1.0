import { useState, useEffect } from "react";
import axios from "axios";
import { Row, Col } from "antd";
import Filters from "./components/Filters";
import PropertyList from "./components/PropertyList";
import MapView from "./components/MapView";
import FAQ from "./components/FAQ";

const ApartmentSearch = () => {
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [allProperties, setAllProperties] = useState([]);
  const [sortBy, setSortBy] = useState("availability");

  const [filters, setFilters] = useState({
    city: null,
    guestCount: "",
    bedrooms: null,
    bathrooms: null,
    disabledAccess: false,
    parking: false,
    elevator: false,
    washingMachine: false,
  });

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/properties`
        );
        setAllProperties(res.data);
        setFilteredProperties(res.data); // default to all
      } catch (err) {
        console.error(">>>[DEBUG] Failed to fetch properties:", err);
      }
    };

    fetchProperties();
  }, [JSON.stringify(filters), sortBy]);

  // auto-filter on filter changes
  useEffect(() => {
    const {
      city,
      bedrooms,
      bathrooms,
      disabledAccess,
      parking,
      elevator,
      washingMachine,
      guestCount,
    } = filters;

    let results = allProperties.filter((property) => {
      const summary = property.summary.join(" ").toLowerCase();

      if (city && property.city.toLowerCase() !== city.toLowerCase())
        return false;
      if (guestCount && property.maxGuest < guestCount) return false;

      if (
        bedrooms &&
        bedrooms !== "studio" &&
        !summary.includes(`${bedrooms} bedroom`) &&
        !summary.includes(`${bedrooms} bedrooms`)
      )
        return false;

      if (
        bathrooms &&
        !summary.includes(`${bathrooms} bath`) &&
        !summary.includes(`${bathrooms} baths`)
      )
        return false;

      if (disabledAccess && !summary.includes("disabled access")) return false;
      if (parking && !summary.includes("parking")) return false;
      if (elevator && !summary.includes("elevator")) return false;
      if (washingMachine && !summary.includes("washing machine")) return false;

      return true;
    });

    // sorting logic
    if (sortBy === "priceLowToHigh") {
      results.sort((a, b) => a.price - b.price);
    } else if (sortBy === "priceHighToLow") {
      results.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      results.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === "availability") {
      results.sort((a, b) => {
        return new Date(a.available) - new Date(b.available);
      });
    }

    setFilteredProperties(results);
  }, [filters, allProperties, sortBy]);

  return (
    <div>
      <Filters
        filters={filters}
        setFilters={setFilters}
        filteredProperties={filteredProperties}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />
      <Row gutter={16} style={{ padding: 16 }}>
        <Col xs={24} lg={16}>
          <PropertyList properties={filteredProperties} />
        </Col>
        <Col xs={24} lg={8}>
          <div style={{ height: "600px", position: "sticky", top: "100px" }}>
            <MapView properties={filteredProperties} />
          </div>
        </Col>
      </Row>
      <FAQ />
    </div>
  );
};

export default ApartmentSearch;
