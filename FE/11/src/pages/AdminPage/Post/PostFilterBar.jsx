import { Space, Input, Select, DatePicker, Button } from "antd";
const { RangePicker } = DatePicker;
const { Option } = Select;

const PostFilterBar = ({ filters, setFilters, ownerOptions }) => (
  <Space style={{ marginBottom: 16, flexWrap: "wrap" }}>
    <Input
      placeholder="Search title"
      allowClear
      value={filters.search}
      onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
      style={{ width: 180 }}
    />
    {/* <Select
      placeholder="Filter by owner"
      allowClear
      style={{ width: 160 }}
      value={filters.owner}
      onChange={(value) => setFilters((f) => ({ ...f, owner: value }))}
    >
      {ownerOptions.map((owner) => (
        <Option key={owner} value={owner}>
          {owner}
        </Option>
      ))}
    </Select> */}
    <Select
      placeholder="Status"
      allowClear
      style={{ width: 140 }}
      value={filters.approvedStatus}
      onChange={(value) => setFilters((f) => ({ ...f, approvedStatus: value }))}
    >
      <Option value="pending">Pending</Option>
      <Option value="approved">Approved</Option>
      <Option value="rejected">Rejected</Option>
      <Option value="deleted">Deleted</Option>
    </Select>
    <RangePicker
      value={filters.dateRange}
      onChange={(dates) => setFilters((f) => ({ ...f, dateRange: dates || [] }))}
      style={{ width: 260 }}
    />
    <Button
      onClick={() =>
        setFilters({ owner: undefined, approvedStatus: undefined, dateRange: [], search: "" })
      }
    >
      Reset
    </Button>
  </Space>
);

export default PostFilterBar;