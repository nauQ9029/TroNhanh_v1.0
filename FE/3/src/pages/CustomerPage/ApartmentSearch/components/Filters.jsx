import { useState } from "react";
import {
  Input,
  DatePicker,
  Button,
  Select,
  Dropdown,
  Menu,
  Checkbox,
  Space,
} from "antd";
import {
  DownOutlined,
  SearchOutlined,
  UserOutlined,
  CalendarOutlined,
} from "@ant-design/icons";

const Filters = () => {
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedBedrooms, setSelectedBedrooms] = useState(null);
  const [selectedBathrooms, setSelectedBathrooms] = useState(null);
  const [features, setFeatures] = useState({
    disabledAccess: false,
    parking: false,
    elevator: false,
    washingMachine: false,
  });

  const handleFeatureChange = (featureName, checked) => {
    setFeatures((prev) => ({
      ...prev,
      [featureName]: checked,
    }));
  };

  const cityOptions = [
    { label: "Thua Thien - Hue", value: "Thua Thien - Hue" },
    { label: "Danang", value: "Danang" },
    { label: "Quang Nam", value: "Quang Nam" },
  ];

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
    <div style={{ padding: "24px 16px", backgroundColor: "#f9f9f9" }}>
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
        {/* City */}
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
            placeholder="Select a city"
            style={{ flex: 1 }}
            bordered={false}
            options={cityOptions}
            value={selectedCity}
            onChange={setSelectedCity}
          />
        </div>

        {/* Move-in */}
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
          <CalendarOutlined style={{ marginRight: 8 }} />
          <DatePicker
            placeholder="Move-in"
            style={{ flex: 1 }}
            bordered={false}
          />
        </div>

        {/* Move-out */}
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
          <CalendarOutlined style={{ marginRight: 8 }} />
          <DatePicker
            placeholder="Move-out"
            style={{ flex: 1 }}
            bordered={false}
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
          <Input
            placeholder="Guests"
            type="number"
            style={{ flex: 1 }}
            bordered={false}
          />
        </div>

        {/* Search button */}
        <div>
          <Button
            type="primary"
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
