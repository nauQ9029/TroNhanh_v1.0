import { Row, Col, Typography } from "antd";
import Filters from "./components/Filters";
import PropertyList from "./components/PropertyList";
import MapView from "./components/MapView";
import FAQ from "./components/FAQ";

const ApartmentSearch = () => {
  return (
    <div>
      <Filters />
      <Row gutter={16} style={{ padding: 16 }}>
        <Col xs={24} lg={16}>
          <PropertyList />
        </Col>
        <Col xs={24} lg={8}>
          <div style={{ height: "600px", position: "sticky", top: "100px" }}>
            <MapView />
          </div>
        </Col>
      </Row>
      <FAQ />
    </div>
  );
};

export default ApartmentSearch;
