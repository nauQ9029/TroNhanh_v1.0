import React, { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
  Legend, CartesianGrid, Label
} from "recharts";
import { Table, Col, Row, Radio, Card } from "antd";
import "./dashboard.css";

// Data and constants
const postData = [
  { name: "Approved", value: 120 },
  { name: "Rejected", value: 30 },
  { name: "Pending", value: 50 },
];

const revenueData = [
  { month: "JAN", revenue: 600, profit: 200 },
  { month: "FEB", revenue: 1800, profit: 700 },
  { month: "MAR", revenue: 2600, profit: 1100 },
  { month: "APR", revenue: 600, profit: 200 },
  { month: "MAY", revenue: 1700, profit: 650 },
  { month: "JUN", revenue: 2600, profit: 1000 },
  { month: "JUL", revenue: 1300, profit: 500 },
  { month: "AUG", revenue: 800, profit: 300 },
  { month: "SEP", revenue: 1800, profit: 700 },
  { month: "OCT", revenue: 600, profit: 200 },
  { month: "NOV", revenue: 1800, profit: 700 },
  { month: "DEC", revenue: 2600, profit: 1100 },
];

// Table data and columns
const userColumns = [
  { title: "User Type", dataIndex: "type", key: "type" },
  { title: "Total", dataIndex: "total", key: "total" },
  { title: "Banned", dataIndex: "banned", key: "banned" },
];

const userData = [
  { key: "1", type: "Owner", total: 134, banned: 5 },
  { key: "2", type: "Customer", total: 560, banned: 12 },
];

const complaintColumns = [
  { title: "Status", dataIndex: "status", key: "status" },
  { title: "Count", dataIndex: "count", key: "count" },
];

const complaintData = [
  { key: "1", status: "Resolved", count: 58 },
  { key: "2", status: "Processing", count: 14 },
];

const transactionColumns = [
  { title: "Type", dataIndex: "type", key: "type" },
  { title: "Count", dataIndex: "count", key: "count" },
  { title: "Amount", dataIndex: "amount", key: "amount" },
];

const transactionData = [
  { key: "1", type: "Total", count: 420, amount: "$48,000" },
  { key: "2", type: "Pending", count: 15, amount: "$2,300" },
];

// Table props
const tableProps = {
  size: "small",
  pagination: false,
  className: "dashboard-table extra-compact-table",
  bordered: false,
};

const Dashboard = () => {
  const [timeFrame, setTimeFrame] = useState("annual");

  return (
    <>
      {/* Tables Section - All in one row */}
      <Row gutter={[12, 12]}>
        <Col xs={24} sm={8}>
          <Card
            className="super-compact-card"
            title="User Statistics"
            headStyle={{ fontSize: '0.95rem', fontWeight: 600, padding: '8px 16px' }}
            bodyStyle={{ padding: '8px 16px' }}
          >
            <Table
            style={{backgroundColor:'unset'}}
              columns={userColumns}
              dataSource={userData}
              {...tableProps}
            />
          </Card>
        </Col>

        <Col xs={24} sm={8}>
          <Card
            className="super-compact-card"
            title="Complaints"
            headStyle={{ fontSize: '0.95rem', fontWeight: 600, padding: '8px 16px' }}
            bodyStyle={{ padding: '8px 16px' }}
          >
            <Table
              columns={complaintColumns}
              dataSource={complaintData}
              {...tableProps}
            />
          </Card>
        </Col>

        <Col xs={24} sm={8}>
          <Card
            className="super-compact-card"
            title="Transactions"
            headStyle={{ fontSize: '0.95rem', fontWeight: 600, padding: '8px 16px' }}
            bodyStyle={{ padding: '8px 16px' }}
          >
            <Table
              columns={transactionColumns}
              dataSource={transactionData}
              {...tableProps}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[12, 12]} className="mt-3">
        <Col xs={24} sm={16}>
          {/* Revenue & Profit Column Chart */}
          <Card
            className="super-compact-card chart-container"
          >
            <div className="chart-header revenue-header">
              <div>
                <h2 className="text-lg font-semibold mb-1">Revenue</h2>
              </div>
              <Radio.Group
                value={timeFrame}
                onChange={(e) => setTimeFrame(e.target.value)}
                className="time-selector"
              >
                <Radio.Button value="quarter">Quarter</Radio.Button>
                <Radio.Button value="semester">Semester</Radio.Button>
                <Radio.Button value="annual">Annual</Radio.Button>
              </Radio.Group>
            </div>
            <div className="chart-divider"></div>
            <ResponsiveContainer width="100%" height={300}>
              {/* Your existing bar chart remains the same */}
              <BarChart
                data={revenueData}
                margin={{ top: 10, right: 10, left: 20, bottom: 20 }}
                barGap={0}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis
                  dataKey="month"
                  axisLine={true}
                  tickLine={true}
                  tick={{ fontSize: 10, fill: '#888' }}
                />
                <YAxis
                  axisLine={true}
                  tickLine={true}
                  tick={{ fontSize: 10, fill: '#888' }}
                  tickFormatter={(value) => value === 0 ? '0' : `${value / 1000}k`}
                  domain={[0, 6000]}
                />
                <Tooltip
                  formatter={(value) => [`$${value}`, '']}
                  labelFormatter={(label) => `${label}`}
                />
                <Bar
                  dataKey="revenue"
                  fill="#6366f1"
                  name="Revenue"
                  barSize={14}
                  radius={[2, 2, 0, 0]}
                />
                <Bar
                  dataKey="profit"
                  fill="#a5b4fc"
                  name="Profit"
                  barSize={14}
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col xs={24} sm={8}>
          {/* Brand Popularity Donut Chart */}
          <Card
            className="super-compact-card chart-container"
            title="Brand popularity"
            headStyle={{ fontSize: '0.95rem', fontWeight: 600, padding: '8px 16px' }}
            bodyStyle={{ padding: '8px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
          >
            <ResponsiveContainer width="100%" height={240}>
              <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <Pie
                  data={postData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  startAngle={90}
                  endAngle={-270}
                  paddingAngle={2}
                  cornerRadius={4}
                >
                  {postData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={['#42d3b4', '#ff7d59', '#7263f3'][index % 3]}
                      stroke="transparent"
                    />
                  ))}
                  <Label
                    content={({ viewBox }) => {
                      const { cx, cy } = viewBox;
                      return (
                        <g>
                          <text x={cx} y={cy - 15} fill="#374151" textAnchor="middle" dominantBaseline="central" fontSize="36" fontWeight="600">
                            3986
                          </text>
                          <text x={cx} y={cy + 15} fill="#6B7280" textAnchor="middle" dominantBaseline="central" fontSize="14" fontWeight="400">
                            PRODUCTS
                          </text>
                        </g>
                      );
                    }}
                  />
                </Pie>
                <Tooltip
                  formatter={(value) => [`${value} products`, '']}
                  labelFormatter={(name) => `${name}`}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0];
                      return (
                        <div className="custom-tooltip">
                          <span className="percent">
                            {`${Math.round((data.value / postData.reduce((sum, entry) => sum + entry.value, 0)) * 100)}%`}
                          </span>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="brand-buttons">
              <button className="brand-button reebok">Approved</button>
              <button className="brand-button nike">Rejected</button>
              <button className="brand-button adidas">Pending</button>
            </div>
          </Card>
        </Col>
      </Row >
    </>
  );
};

export default Dashboard;