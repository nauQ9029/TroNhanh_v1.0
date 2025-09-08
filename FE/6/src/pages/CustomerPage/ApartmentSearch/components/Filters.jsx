import { useState } from "react";
import {
  InputNumber,
  DatePicker,
  Button,
  Select,
  Dropdown,
  Menu,
  Checkbox,
  Space,
  notification,
} from "antd";
import {
  DownOutlined,
  SearchOutlined,
  UserOutlined,
  CalendarOutlined,
} from "@ant-design/icons";

const Filters = ({onSearch}) => {
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedBedrooms, setSelectedBedrooms] = useState(null);
  const [selectedBathrooms, setSelectedBathrooms] = useState(null);
  const [features, setFeatures] = useState({
    disabledAccess: false,
    parking: false,
    elevator: false,
    washingMachine: false,
  });
  const [street, setStreet] = useState("");
  const [addressDetail, setAddressDetail] = useState("");

  const [guestCount, setGuestCount] = useState("");
  const [errors, setErrors] = useState({});

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
    };

    onSearch(filters); 
  };


  const handleFeatureChange = (featureName, checked) => {
    setFeatures((prev) => ({
      ...prev,
      [featureName]: checked,
    }));
  };

  const moreFiltersMenu = (
    <Menu>
      <Menu.Item key="bedrooms" disabled>
        <strong>Bedrooms</strong>
      </Menu.Item>
      <Menu.Item key="bedroom-select" style={{ padding: 8 }}>
        <Select
          style={{ width: "100%" }}
          placeholder="Select Bedrooms"
          value={selectedBedrooms}
          onChange={setSelectedBedrooms}
        >
          <Select.Option value="studio">Studio</Select.Option>
          <Select.Option value="1">1</Select.Option>
          <Select.Option value="2">2</Select.Option>
          <Select.Option value="3">3</Select.Option>
        </Select>
      </Menu.Item>

      <Menu.Divider />

      <Menu.Item key="bathrooms" disabled>
        <strong>Bathrooms</strong>
      </Menu.Item>
      <Menu.Item key="bathroom-select" style={{ padding: 8 }}>
        <Select
          style={{ width: "100%" }}
          placeholder="Select Bathrooms"
          value={selectedBathrooms}
          onChange={setSelectedBathrooms}
        >
          <Select.Option value="1">1</Select.Option>
          <Select.Option value="2">2</Select.Option>
          <Select.Option value="3">3</Select.Option>
        </Select>
      </Menu.Item>

      <Menu.Divider />

      <Menu.Item key="features" disabled>
        <strong>Features</strong>
      </Menu.Item>
      <Menu.Item key="features-checkboxes" style={{ padding: 8 }}>
        <Space direction="vertical">
          <Checkbox
            checked={features.disabledAccess}
            onChange={(e) =>
              handleFeatureChange("disabledAccess", e.target.checked)
            }
          >
            Disabled accesses
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
            Washing machine
          </Checkbox>
        </Space>
      </Menu.Item>
    </Menu>
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
        <Dropdown overlay={moreFiltersMenu} trigger={["click"]}>
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
        </Dropdown>

        {/* Result summary */}
        <div style={{ fontSize: "16px" }}>
          <span style={{ fontWeight: "bold" }}>52 results</span> for{" "}
          <span style={{ fontStyle: "italic" }}>
            "1 Bedroom property in West London"
          </span>
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
