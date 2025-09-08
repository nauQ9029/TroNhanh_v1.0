import { useState } from "react";
import { InputNumber, Button, Select, Popover, Checkbox, Space } from "antd";
import { DownOutlined, SearchOutlined, UserOutlined } from "@ant-design/icons";

const Filters = ({ onSearch, totalResults, filtersSummary }) => {
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedBedrooms, setSelectedBedrooms] = useState(null);
  const [selectedBathrooms, setSelectedBathrooms] = useState(null);
  const [filterVisible, setFilterVisible] = useState(false);

  const [features, setFeatures] = useState({
    disabledAccess: false,
    parking: false,
    elevator: false,
    washingMachine: false,
  });
  const [street, setStreet] = useState("");
  const [addressDetail, setAddressDetail] = useState("");

  const [guestCount, setGuestCount] = useState("");

  const districtOptions = [
    { label: "Liên Chiểu", value: "Liên Chiểu" },
    { label: "Hải Châu", value: "Hải Châu" },
    { label: "Thanh Khê", value: "Thanh Khê" },
    { label: "Cẩm Lệ", value: "Cẩm Lệ" },
    { label: "Sơn Trà", value: "Sơn Trà" },
    { label: "Ngũ Hành Sơn", value: "Ngũ Hành Sơn" },
  ];

  const handleSearch = () => {
    const filters = {
      district: selectedDistrict,
      street,
      addressDetail,
      guestCount,
      bedrooms: selectedBedrooms,
      bathrooms: selectedBathrooms,
      features,
    };

    onSearch(filters);
  };

  const handleFeatureChange = (featureName, checked) => {
    setFeatures((prev) => ({
      ...prev,
      [featureName]: checked,
    }));
  };

  const handleVisibleChange = (visible) => {
    setFilterVisible(visible);
  };

  const moreFiltersContent = (
    <div style={{ width: 250 }}>
      <div style={{ marginBottom: 12 }}>
        <strong>Bedrooms</strong>
        <Select
          style={{ width: "100%", marginTop: 4 }}
          placeholder="Select Bedrooms"
          value={selectedBedrooms}
          onChange={setSelectedBedrooms}
        >
          <Select.Option value="studio">Studio</Select.Option>
          <Select.Option value="1">1</Select.Option>
          <Select.Option value="2">2</Select.Option>
          <Select.Option value="3">3</Select.Option>
        </Select>
      </div>

      <div style={{ marginBottom: 12 }}>
        <strong>Bathrooms</strong>
        <Select
          style={{ width: "100%", marginTop: 4 }}
          placeholder="Select Bathrooms"
          value={selectedBathrooms}
          onChange={setSelectedBathrooms}
        >
          <Select.Option value="1">1</Select.Option>
          <Select.Option value="2">2</Select.Option>
          <Select.Option value="3">3</Select.Option>
        </Select>
      </div>

      <div>
        <strong>Features</strong>
        <Space direction="vertical" style={{ marginTop: 8 }}>
          <Checkbox
            checked={features.disabledAccess}
            onChange={(e) =>
              handleFeatureChange("disabledAccess", e.target.checked)
            }
          >
            Disabled Access
          </Checkbox>
          <Checkbox
            checked={features.parking}
            onChange={(e) => handleFeatureChange("parking", e.target.checked)}
          >
            Parking
          </Checkbox>
          <Checkbox
            checked={features.elevator}
            onChange={(e) => handleFeatureChange("elevator", e.target.checked)}
          >
            Elevator
          </Checkbox>
          <Checkbox
            checked={features.washingMachine}
            onChange={(e) =>
              handleFeatureChange("washingMachine", e.target.checked)
            }
          >
            Washing Machine
          </Checkbox>
        </Space>
      </div>
    </div>
  );

  return (
    <div style={{ padding: "24px 16px" }}>
      {/* Search Bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          border: "2px solid #004d47",
          borderRadius: "40px",
          overflow: "hidden",
          padding: "4px",
          flexWrap: "wrap",
        }}
      >
        {/* Districts */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "8px 16px",
            flex: "1",
            minWidth: "150px",
            borderRight: "1px solid #004d47",
          }}
        >
          <SearchOutlined style={{ marginRight: 8 }} />
          <Select
            placeholder="Select a district"
            style={{ flex: 1 }}
            bordered={false}
            options={districtOptions}
            value={selectedDistrict}
            onChange={setSelectedDistrict}
          />
        </div>

        {/* Street */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "8px 16px",
            flex: "1",
            minWidth: "150px",
            borderRight: "1px solid #004d47",
          }}
        >
          <input
            placeholder="Enter street"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              background: "transparent",
              fontSize: "14px",
              color: "#004d47",
            }}
          />
        </div>

        {/* Address Detail */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "8px 16px",
            flex: "1",
            minWidth: "150px",
            borderRight: "1px solid #004d47",
          }}
        >
          <input
            placeholder="Enter address detail"
            value={addressDetail}
            onChange={(e) => setAddressDetail(e.target.value)}
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              background: "transparent",
              fontSize: "14px",
              color: "#004d47",
            }}
          />
        </div>

        {/* Guests */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "8px 16px",
            flex: "1",
            minWidth: "120px",
            borderRight: "1px solid #004d47",
          }}
        >
          <UserOutlined style={{ marginRight: 8 }} />
          <InputNumber
            placeholder="Guests"
            min={1}
            style={{ flex: 1 }}
            bordered={false}
            value={guestCount}
            onChange={setGuestCount}
          />
        </div>

        {/* Search button */}
        <div>
          <Button
            type="primary"
            onClick={handleSearch}
            style={{
              backgroundColor: "#004d47",
              color: "#fff",
              borderRadius: "40px",
              height: "100%",
              padding: "12px 24px",
              border: "none",
            }}
          >
            Search
          </Button>
        </div>
      </div>

      {/* Bottom filters */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: "16px",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        {/* More filters */}
        <Popover
          content={moreFiltersContent}
          title="More Filters"
          trigger="click"
          visible={filterVisible}
          onVisibleChange={handleVisibleChange}
          placement="bottomLeft"
        >
          <Button
            style={{
              backgroundColor: "#004d47",
              color: "#fff",
              borderRadius: "40px",
              padding: "10px 24px",
              border: "none",
              fontWeight: "bold",
            }}
          >
            More filters <DownOutlined />
          </Button>
        </Popover>

        {/* Result summary */}
        <div style={{ fontSize: "16px" }}>
          <span style={{ fontWeight: "bold" }}>
            Found {totalResults} results
          </span>
          {filtersSummary?.bedrooms || filtersSummary?.district ? (
            <>
              {" "}
              for{" "}
              <span style={{ fontStyle: "italic" }}>
                {filtersSummary?.bedrooms
                  ? `${
                      filtersSummary.bedrooms === "studio"
                        ? "Studio"
                        : filtersSummary.bedrooms + " Bedroom"
                    }`
                  : ""}
                {filtersSummary?.district
                  ? ` in ${filtersSummary.district}`
                  : ""}
              </span>
            </>
          ) : null}
        </div>

        {/* Sort by */}
        <div style={{ fontSize: "16px" }}>
          <span style={{ fontWeight: "bold" }}>Sort by: </span>
          <span style={{ color: "#49735A", cursor: "pointer" }}>
            Availability <DownOutlined style={{ fontSize: "12px" }} />
          </span>
        </div>
      </div>
    </div>
  );
};

export default Filters;
