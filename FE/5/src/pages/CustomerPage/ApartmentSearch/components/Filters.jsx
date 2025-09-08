import {
  InputNumber,
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
} from "@ant-design/icons";

const Filters = ({
  filters,
  setFilters,
  filteredProperties,
  sortBy,
  setSortBy,
}) => {
  const cityOptions = [
    { label: "Thua Thien - Hue", value: "Thua Thien - Hue" },
    { label: "Da Nang", value: "Da Nang" },
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
          value={filters.bedrooms}
          onChange={(value) =>
            setFilters((prev) => ({ ...prev, bedrooms: value }))
          }
        >
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
          value={filters.bathrooms}
          onChange={(value) =>
            setFilters((prev) => ({ ...prev, bathrooms: value }))
          }
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
            checked={filters.disabledAccess}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                disabledAccess: e.target.checked,
              }))
            }
          >
            Disabled accesses
          </Checkbox>
          <Checkbox
            checked={filters.parking}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                parking: e.target.checked,
              }))
            }
          >
            Parking
          </Checkbox>
          <Checkbox
            checked={filters.elevator}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                elevator: e.target.checked,
              }))
            }
          >
            Elevator
          </Checkbox>
          <Checkbox
            checked={filters.washingMachine}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                washingMachine: e.target.checked,
              }))
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
            value={filters.city}
            onChange={(value) =>
              setFilters((prev) => ({ ...prev, city: value }))
            }
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
            value={filters.guestCount}
            onChange={(value) =>
              setFilters((prev) => ({ ...prev, guestCount: value }))
            }
          />
        </div>

        {/* Search button
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
        </div> */}
      </div>

      {/* bottom filters */}
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
        {/* more filters */}
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

        {/* result summary */}
        <div style={{ fontSize: "16px" }}>
          Found{" "}
          <span style={{ fontWeight: "bold" }}>
            {filteredProperties.length}{" "}
            {filteredProperties.length === 1
              ? "accommodation"
              : "accommodations"}
          </span>{" "}
          in{" "}
          <span style={{ fontStyle: "italic" }}>
            {filters.city || "Vietnam"}
          </span>
        </div>

        {/* sort by dropdown */}
        <div
          style={{ fontSize: "16px", display: "flex", alignItems: "center" }}
        >
          <span style={{ fontWeight: "bold", marginRight: 8 }}>Sort by:</span>
          <Select value={sortBy} onChange={setSortBy} style={{ width: 180 }}>
            <Select.Option value="availability">Availability</Select.Option>
            <Select.Option value="priceLowToHigh">
              Price (Low to High)
            </Select.Option>
            <Select.Option value="priceHighToLow">
              Price (High to Low)
            </Select.Option>
            <Select.Option value="rating">Top Rating</Select.Option>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default Filters;
