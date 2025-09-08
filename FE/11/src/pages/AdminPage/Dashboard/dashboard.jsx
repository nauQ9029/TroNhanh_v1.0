import React, { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
  CartesianGrid, Label
} from "recharts";
import { Table, Col, Row, Radio, Card, Spin, message, Button } from "antd";
import { DownloadOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import dashboardService from "../../../services/dashboardService";
import "./dashboard.module.css";

// Data and constants - keeping revenue data for the bar chart
// const revenueData = [
//   { month: "JAN", revenue: 600, profit: 200 },
//   { month: "FEB", revenue: 1800, profit: 700 },
//   { month: "MAR", revenue: 2600, profit: 1100 },
//   { month: "APR", revenue: 600, profit: 200 },
//   { month: "MAY", revenue: 1700, profit: 650 },
//   { month: "JUN", revenue: 2600, profit: 1000 },
//   { month: "JUL", revenue: 1300, profit: 500 },
//   { month: "AUG", revenue: 800, profit: 300 },
//   { month: "SEP", revenue: 1800, profit: 700 },
//   { month: "OCT", revenue: 600, profit: 200 },
//   { month: "NOV", revenue: 1800, profit: 700 },
//   { month: "DEC", revenue: 2600, profit: 1100 },
// ];

// Table columns
const userColumns = [
  { title: "User Type", dataIndex: "type", key: "type" },
  { title: "Total", dataIndex: "total", key: "total" },
];

const accommodationColumns = [
  { title: "Status", dataIndex: "status", key: "status" },
  { title: "Count", dataIndex: "count", key: "count" },
];

const transactionColumns = [
  { title: "Metric", dataIndex: "type", key: "type" },
  { title: "Value", dataIndex: "count", key: "count" },
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
  const [dashboardData, setDashboardData] = useState(null);
  const [accommodationData, setAccommodationData] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [membershipData, setMembershipData] = useState(null);
  const [financialData, setFinancialData] = useState(null);
  const [loading, setLoading] = useState(true);


  // Fetch dashboard data on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Check if token exists

        // Fetch user, accommodation, report, membership, and financial data in parallel
        const [userData, accomData, reportDataRes, membershipDataRes, financialDataRes] = await Promise.all([
          dashboardService.getUserDashboard(),
          dashboardService.getAccommodationDashboard(),
          dashboardService.getReportDashboard(),
          dashboardService.getMembershipDashboard(),
          dashboardService.getFinancialDashboard()
        ]);


        setDashboardData(userData);
        setAccommodationData(accomData);
        setReportData(reportDataRes);
        setMembershipData(membershipDataRes);
        setFinancialData(financialDataRes);
      } catch (error) {
        message.error('Failed to load dashboard data: ' + error.message);

        // Set fallback data if API fails
        setDashboardData({
          success: true,
          data: {
            totalUsers: 0,
            totalOwners: 0,
            totalCustomers: 0
          }
        });
        setAccommodationData({
          success: true,
          data: {
            total: 0,
            newAccommodations: 0,
            occupancyRate: 0,
            approvalBreakdown: { pending: 0, approved: 0, rejected: 0 },
            postStatusSummary: { totalPosts: 0, pendingPosts: 0, approvedPosts: 0, rejectedPosts: 0 }
          }
        });
        setReportData({
          success: true,
          data: {
            totalReports: 0,
            recentReports: 0,
            pendingCount: 0,
            resolutionRate: 0,
            statusBreakdown: { pending: 0, approved: 0, rejected: 0 },
            ownerReports: { total: 0, pending: 0, approved: 0, rejected: 0 },
            customerReports: { total: 0, pending: 0, approved: 0, rejected: 0 }
          }
        });
        setMembershipData({
          success: true,
          data: {
            totalPackages: 0,
            totalPurchases: 0,
            recentPurchases: 0,
            activePurchases: 0,
            conversionRate: 0,
            mostPopularPackage: { packageName: '', ownerPurchaseCount: 0, totalRevenue: 0 }
          }
        });
        setFinancialData({
          success: true,
          data: {
            summary: {
              totalTransactions: 0,
              recentTransactions: 0,
              totalRevenue: 0,
              recentRevenue: 0,
              averageTransaction: 0,
              growthRate: "0.00"
            },
            dailyRevenueList: [
              {
                date: "",
                dayOfWeek: "",
                revenue: 0,
                transactions: 0,
                averagePerTransaction: 0
              }
            ],
            charts: {
              statusRevenue: {
                categories: ["Paid"],
                series: [
                  {
                    name: "Revenue (VND)",
                    data: []
                  },
                  {
                    name: "Transaction Count",
                    data: [3]
                  }
                ]
              }
            }
          }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Transform API data for display
  const getUserData = () => {

    if (!dashboardData?.data) {
      return [];
    }

    // Extract data from the API response structure
    const apiData = dashboardData.data;
    console.log('👥 API data:', apiData);

    // Map API fields to our display format
    const totalUsers = apiData.totalUsers || 0;
    const totalOwners = apiData.totalOwners || 0;
    const totalCustomers = apiData.totalCustomers || 0;

    // Calculate admin count (total - owners - customers, or use a specific field if available)
    const adminCount = totalUsers - totalOwners - totalCustomers;

    const userData = [
      { key: "1", type: "Admin", total: adminCount },
      { key: "2", type: "Owner", total: totalOwners },
      { key: "3", type: "Customer", total: totalCustomers },
    ];

    return userData;
  };

  // Transform financial data for revenue chart
  const getFinancialRevenueData = () => {
    if (!financialData?.data) {
      // Return fallback static data if financial data is not available
    }

    // Use dailyRevenueList for daily revenue display
    if (financialData.data.dailyRevenueList && financialData.data.dailyRevenueList.length > 0) {
      return financialData.data.dailyRevenueList.map((day, index) => ({
        month: day.date, // Use date instead of month
        revenue: day.revenue || 0,
        profit: Math.round((day.revenue || 0) * 0.3) // Assume 30% profit margin
      }));
    }

    const charts = financialData.data.charts;

    // Fallback to statusRevenue data if dailyRevenueList is empty
    if (charts?.statusRevenue && charts.statusRevenue.categories.length > 0) {
      const categories = charts.statusRevenue.categories;
      const revenueData = charts.statusRevenue.series.find(s => s.name === "Revenue (VND)")?.data || [];

      return categories.map((status, index) => ({
        month: status.toUpperCase(),
        revenue: revenueData[index] || 0,
        profit: Math.round((revenueData[index] || 0) * 0.3) // Assume 30% profit margin
      }));
    }

    // If no statusRevenue data, try monthlyRevenue
    if (charts?.monthlyRevenue && charts.monthlyRevenue.categories.length > 0) {
      const categories = charts.monthlyRevenue.categories;
      const revenueData = charts.monthlyRevenue.series.find(s => s.name === "Revenue (VND)")?.data || [];

      return categories.map((month, index) => ({
        month: month.toUpperCase(),
        revenue: revenueData[index] || 0,
        profit: Math.round((revenueData[index] || 0) * 0.3)
      }));
    }

    // If no chart data available, return fallback
  };

  // Transform report data for reports status table  
  const getReportData = () => {
    if (!reportData?.data?.statusBreakdown) {
      return [
        { key: "1", status: "Pending", count: 0 },
        { key: "2", status: "Approved", count: 0 },
        { key: "3", status: "Rejected", count: 0 },
      ];
    }

    const breakdown = reportData.data.statusBreakdown;
    return [
      { key: "1", status: "Pending", count: breakdown.Pending || breakdown.pending || 0 },
      { key: "2", status: "Approved", count: breakdown.Approved || breakdown.approved || 0 },
      { key: "3", status: "Rejected", count: breakdown.Rejected || breakdown.rejected || 0 },
    ];
  };


  // Transform membership data for membership table
  const getMembershipData = () => {
    if (!membershipData?.data) {
      return [
        { key: "1", type: "Total Packages", count: 0, amount: "0%" },
        { key: "2", type: "Total Purchases", count: 0, amount: "$0" },
        { key: "3", type: "Recent Purchases", count: 0, amount: "0%" },
      ];
    }

    const data = membershipData.data;
    const mostPopular = data.mostPopularPackage;

    return [
      { key: "1", type: "Total Packages", count: data.totalPackages || 0, amount: `${data.conversionRate || 0}%` },
      { key: "2", type: "Total Purchases", count: data.totalPurchases || 0, amount: `$${mostPopular?.totalRevenue || 0}` },
      { key: "3", type: "Active Memberships", count: data.activePurchases || 0, amount: mostPopular?.packageName || "N/A" },
    ];
  };

  // Transform financial data for financial overview table
  const getFinancialOverviewData = () => {
    if (!financialData?.data?.summary) {
      return [
        { key: "1", type: "Total Transactions", count: 0, amount: "₫0" },
        { key: "2", type: "Total Revenue", count: "₫0", amount: "0%" },
        { key: "3", type: "Average Transaction", count: "₫0", amount: "₫0" },
      ];
    }

    const summary = financialData.data.summary;
    const formatVND = (amount) => `₫${amount.toLocaleString()}`;

    return [
      { key: "1", type: "Total Transactions", count: summary.totalTransactions || 0, amount: formatVND(summary.totalRevenue || 0) },
      { key: "2", type: "Recent Transactions", count: summary.recentTransactions || 0, amount: `${summary.growthRate || 0}%` },
      { key: "3", type: "Total Revenue", count: formatVND(summary.totalRevenue || 0), amount: formatVND(summary.recentRevenue || 0) },
    ];
  };

  // Transform accommodation data for pie chart
  const getPostStatusData = () => {
    if (!accommodationData?.data?.postStatusSummary) {
      // Fallback data
      return [
        { name: "Approved", value: 120 },
        { name: "Rejected", value: 30 },
        { name: "Pending", value: 50 },
      ];
    }

    const summary = accommodationData.data.postStatusSummary;
    return [
      { name: "Approved", value: summary.approvedPosts || 0 },
      { name: "Rejected", value: summary.rejectedPosts || 0 },
      { name: "Pending", value: summary.pendingPosts || 0 },
    ];
  };

  // Export dashboard data to Excel
  const exportToExcel = () => {
    try {
      // Create a new workbook
      const workbook = XLSX.utils.book_new();

      // Prepare User Statistics data
      const userStatsData = getUserData();
      const userStatsSheet = XLSX.utils.json_to_sheet(userStatsData.map(item => ({
        'User Type': item.type,
        'Total': item.total
      })));

      // Prepare Report Status data
      const reportStatsData = getReportData();
      const reportStatsSheet = XLSX.utils.json_to_sheet(reportStatsData.map(item => ({
        'Status': item.status,
        'Count': item.count
      })));

      // Prepare Membership Overview data
      const membershipStatsData = getMembershipData();
      const membershipStatsSheet = XLSX.utils.json_to_sheet(membershipStatsData.map(item => ({
        'Metric': item.type,
        'Value': item.count,
        'Details': item.amount
      })));

      // Prepare Financial Overview data
      const financialStatsData = getFinancialOverviewData();
      const financialStatsSheet = XLSX.utils.json_to_sheet(financialStatsData.map(item => ({
        'Metric': item.type,
        'Value': item.count,
        'Amount': item.amount
      })));

      // Prepare Daily Revenue data
      const revenueData = getFinancialRevenueData();
      const revenueSheet = XLSX.utils.json_to_sheet(revenueData?.map(item => ({
        'Date': item.month,
        'Revenue (VND)': item.revenue,
        'Profit (VND)': item.profit
      })) || []);

      // Prepare Post Status data
      const postStatusData = getPostStatusData();
      const postStatusSheet = XLSX.utils.json_to_sheet(postStatusData.map(item => ({
        'Status': item.name,
        'Count': item.value
      })));

      // Add sheets to workbook
      XLSX.utils.book_append_sheet(workbook, userStatsSheet, 'User Statistics');
      XLSX.utils.book_append_sheet(workbook, reportStatsSheet, 'Report Status');
      XLSX.utils.book_append_sheet(workbook, membershipStatsSheet, 'Membership Overview');
      XLSX.utils.book_append_sheet(workbook, financialStatsSheet, 'Financial Overview');
      XLSX.utils.book_append_sheet(workbook, revenueSheet, 'Daily Revenue');
      XLSX.utils.book_append_sheet(workbook, postStatusSheet, 'Post Status');

      // Generate filename with current date
      const currentDate = new Date().toISOString().split('T')[0];
      const filename = `Dashboard_Report_${currentDate}.xlsx`;

      // Save the file
      XLSX.writeFile(workbook, filename);
      
      message.success('Dashboard data exported successfully!');
    } catch (error) {
      console.error('Export error:', error);
      message.error('Failed to export dashboard data: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Export Button */}
      <Row gutter={[12, 12]} style={{ marginBottom: '16px' }}>
        <Col xs={24} style={{ textAlign: 'right' }}>
          <Button 
            type="primary" 
            style={{ border: 'none', display: 'inline-block' }}
            icon={<DownloadOutlined />}
            onClick={exportToExcel}
            size="middle"
          >
            Export to Excel
          </Button>
        </Col>
      </Row>

      {/* Tables Section - All in one row */}
      <Row gutter={[12, 12]}>
        <Col xs={24} sm={6}>
          <Card
            className="super-compact-card"
            title="User Statistics"
            headStyle={{ fontSize: '0.95rem', fontWeight: 600, padding: '8px 16px' }}
            bodyStyle={{ padding: '8px 16px' }}
          >
            <Table
              style={{ backgroundColor: 'unset' }}
              columns={userColumns}
              dataSource={getUserData()}
              {...tableProps}
            />
          </Card>
        </Col>

        <Col xs={24} sm={6}>
          <Card
            className="super-compact-card"
            title="Report Status"
            headStyle={{ fontSize: '0.95rem', fontWeight: 600, padding: '8px 16px' }}
            bodyStyle={{ padding: '8px 16px' }}
          >
            <Table
              columns={accommodationColumns}
              dataSource={getReportData()}
              {...tableProps}
            />
          </Card>
        </Col>

        <Col xs={24} sm={6}>
          <Card
            className="super-compact-card"
            title="Membership Overview"
            headStyle={{ fontSize: '0.95rem', fontWeight: 600, padding: '8px 16px' }}
            bodyStyle={{ padding: '8px 16px' }}
          >
            <Table
              columns={transactionColumns}
              dataSource={getMembershipData()}
              {...tableProps}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card
            className="super-compact-card"
            title="Financial Overview"
            headStyle={{ fontSize: '0.95rem', fontWeight: 600, padding: '8px 16px' }}
            bodyStyle={{ padding: '8px 16px' }}
          >
            <Table
              columns={transactionColumns}
              dataSource={getFinancialOverviewData()}
              {...tableProps}
            />
          </Card>
        </Col>
      </Row>

      {/* Financial Overview Row */}


      <Row gutter={[12, 12]} className="mt-3">
        <Col xs={24} sm={16}>
          {/* Revenue & Profit Column Chart */}
          <Card
            className="super-compact-card chart-container-admin"
          >
            <div className="chart-header revenue-header">
              <div>
                <h2 className="text-lg font-semibold mb-1">Daily Revenue</h2>
              </div>
            </div>
            <div className="chart-divider"></div>
            <ResponsiveContainer width="100%" height={300}>
              {/* Revenue chart using financial API data */}
              <BarChart
                data={getFinancialRevenueData()}
                margin={{ top: 10, right: 10, left: 20, bottom: 20 }}
                barGap={0}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis
                  dataKey="month"
                  axisLine={true}
                  tickLine={true}
                  tick={{ fontSize: 9, fill: '#888' }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  interval={0}
                />
                <YAxis
                  axisLine={true}
                  tickLine={true}
                  tick={{ fontSize: 10, fill: '#888' }}
                  tickFormatter={(value) => {
                    if (value === 0) return '0';
                    if (value >= 1000000) return `${(value / 1000000).toFixed(0)}M`;
                    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
                    return value.toString();
                  }}
                  domain={[0, 'dataMax']}
                />
                <Tooltip
                  formatter={(value, name) => [
                    `${value.toLocaleString()} VND`,
                    name
                  ]}
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
            className="super-compact-card chart-container-admin"
            title="Post Status Distribution"
            headStyle={{ fontSize: '0.95rem', fontWeight: 600, padding: '8px 16px' }}
            bodyStyle={{ padding: '8px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
          >
            <ResponsiveContainer width="100%" height={240}>
              <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <Pie
                  data={getPostStatusData()}
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
                  {getPostStatusData().map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        entry.name === 'Approved' ? '#42d3b4' :
                          entry.name === 'Rejected' ? '#ff7d59' :
                            entry.name === 'Pending' ? '#7263f3' : '#cccccc'
                      }
                      stroke="transparent"
                    />
                  ))}
                  <Label
                    content={({ viewBox }) => {
                      const { cx, cy } = viewBox;
                      const totalPosts = getPostStatusData().reduce((sum, entry) => sum + entry.value, 0);
                      return (
                        <g>
                          <text x={cx} y={cy - 15} fill="#374151" textAnchor="middle" dominantBaseline="central" fontSize="36" fontWeight="600">
                            {totalPosts}
                          </text>
                          <text x={cx} y={cy + 15} fill="#6B7280" textAnchor="middle" dominantBaseline="central" fontSize="14" fontWeight="400">
                            POSTS
                          </text>
                        </g>
                      );
                    }}
                  />
                </Pie>
                <Tooltip
                  formatter={(value) => [`${value} posts`, '']}
                  labelFormatter={(name) => `${name}`}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0];
                      const totalPosts = getPostStatusData().reduce((sum, entry) => sum + entry.value, 0);
                      return (
                        <div className="custom-tooltip">
                          <span className="percent">
                            {`${Math.round((data.value / totalPosts) * 100)}%`}
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
              <button className="brand-button" style={{ backgroundColor: '#42d3b4', color: 'white', border: 'none', padding: '4px 8px', margin: '2px', borderRadius: '4px', fontSize: '12px' }}>
                Approved
              </button>
              <button className="brand-button" style={{ backgroundColor: '#ff7d59', color: 'white', border: 'none', padding: '4px 8px', margin: '2px', borderRadius: '4px', fontSize: '12px' }}>
                Rejected
              </button>
              <button className="brand-button" style={{ backgroundColor: '#7263f3', color: 'white', border: 'none', padding: '4px 8px', margin: '2px', borderRadius: '4px', fontSize: '12px' }}>
                Pending
              </button>
            </div>
          </Card>
        </Col>
      </Row >

    </div>
  );
};

export default Dashboard;