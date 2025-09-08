import { Row, Col } from "antd";
import Filters from "../../../../components/filters/filters";
import PropertyList from "../../../../components/PropertyList/PropertyList";
import MapView from "../../../../components/MapView/MapView";
import FAQSection from "../../../../components/FAQSection/FAQSection";

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
      <FAQSection />
    </div>
  );
};

export default ApartmentSearch;
