import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, Tag, Progress, message, Modal, Descriptions } from 'antd';
import {
  HomeOutlined,
  DollarOutlined,
  UserOutlined,
  CalendarOutlined,
  TrophyOutlined,
  EyeOutlined,
  InfoCircleOutlined,
  CameraOutlined,
  EnvironmentOutlined
} from '@ant-design/icons';
import axios from 'axios';
import useUser from '../../../contexts/UserContext';
import {
  getOwnerStatistics,
  getOwnerRecentBookings,
  getOwnerTopAccommodations,
  getOwnerMonthlyRevenue,
  getOwnerCurrentMembership
} from '../../../services/accommodationAPI';
import './Statistics.css';

const Statistics = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const { user } = useUser();
  const [stats, setStats] = useState({
    totalAccommodations: 0,
    availableAccommodations: 0,
    bookedAccommodations: 0,
    unavailableAccommodations: 0,
    totalRevenue: 0,
    totalBookings: 0,
    monthlyRevenue: 0
  });
  const [membership, setMembership] = useState({
    packageName: "Loading...",
    isActive: false,
    expiredAt: null
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [topAccommodations, setTopAccommodations] = useState([]);
  const [monthlyRevenueData, setMonthlyRevenueData] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Modal states
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    if (user?._id) {
      fetchStatistics();
      fetchRecentBookings();
      fetchTopAccommodations();
      fetchMonthlyRevenue();
      fetchCurrentMembership();
    }
  }, [user]);

  // Force chart color after data loads
  useEffect(() => {
    // Không cần nữa vì dùng custom chart
  }, [monthlyRevenueData]);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      
      // Sử dụng API mới để lấy statistics tổng hợp
      const statisticsRes = await getOwnerStatistics();
      
      if (statisticsRes.success) {
        setStats(statisticsRes.statistics);
      } else {
        // Fallback to old method if API fails
        const accommodationsRes = await axios.get(`http://localhost:5000/api/accommodation?ownerId=${user._id}`);
        const accommodations = accommodationsRes.data;

        const totalAccommodations = accommodations.length;
        const availableAccommodations = accommodations.filter(acc => acc.status === 'Available').length;
        const bookedAccommodations = accommodations.filter(acc => acc.status === 'Booked').length;
        const unavailableAccommodations = accommodations.filter(acc => acc.status === 'Unavailable').length;

        // Calculate revenue (fallback calculation)
        const totalRevenue = bookedAccommodations * 2500000;
        const monthlyRevenue = totalRevenue * 0.3;

        setStats({
          totalAccommodations,
          availableAccommodations,
          bookedAccommodations,
          unavailableAccommodations,
          totalRevenue,
          totalBookings: bookedAccommodations,
          monthlyRevenue
        });
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
      messageApi.error('Unable to load statistics!');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentBookings = async () => {
    try {
      const bookingsRes = await getOwnerRecentBookings(10); // Lấy 10 booking gần nhất
      
      if (bookingsRes.success) {
        setRecentBookings(bookingsRes.bookings);
      } else {
        console.error('Failed to fetch recent bookings - API returned success: false');
        setRecentBookings([]);
      }
    } catch (error) {
      console.error('Error fetching recent bookings:', error);
      setRecentBookings([]);
    }
  };

  const fetchTopAccommodations = async () => {
    try {
      const topAccommodationsRes = await getOwnerTopAccommodations(5); // Lấy top 5
      
      if (topAccommodationsRes.success) {
        setTopAccommodations(topAccommodationsRes.accommodations);
      } else {
        console.error('Failed to fetch top accommodations');
        setTopAccommodations([]);
      }
    } catch (error) {
      console.error('Error fetching top accommodations:', error);
      setTopAccommodations([]);
    }
  };

  const fetchMonthlyRevenue = async () => {
    try {
      const monthlyRevenueRes = await getOwnerMonthlyRevenue(6); // Lấy 6 tháng gần nhất
      
      if (monthlyRevenueRes.success) {
        // Validate và clean data trước khi set state
        const cleanedData = monthlyRevenueRes.monthlyRevenue.map(item => {
          // Đảm bảo revenue là number và không bị mất giá trị
          let cleanRevenue = 0;
          if (typeof item.revenue === 'number' && !isNaN(item.revenue)) {
            cleanRevenue = item.revenue;
          } else if (typeof item.revenue === 'string' && !isNaN(parseFloat(item.revenue))) {
            cleanRevenue = parseFloat(item.revenue);
          }
          
          return {
            month: String(item.month || 'Unknown'),
            revenue: cleanRevenue,
            bookingsCount: typeof item.bookingsCount === 'number' ? item.bookingsCount : 0,
            year: item.year || new Date().getFullYear(),
            monthNumber: item.monthNumber || 1
          };
        });
        
        setMonthlyRevenueData(cleanedData);
      } else {
        console.error('Failed to fetch monthly revenue');
        setMonthlyRevenueData([]);
      }
    } catch (error) {
      console.error('Error fetching monthly revenue:', error);
      setMonthlyRevenueData([]);
    }
  };

  const fetchCurrentMembership = async () => {
    try {
      const membershipRes = await getOwnerCurrentMembership();
      
      if (membershipRes.success) {
        setMembership(membershipRes.membership);
      } else {
        console.error('Failed to fetch current membership - API returned success: false');
        setMembership({
          packageName: "No Active Membership",
          isActive: false,
          expiredAt: null
        });
      }
    } catch (error) {
      console.error('Error fetching current membership:', error);
      setMembership({
        packageName: "Error Loading",
        isActive: false,
        expiredAt: null
      });
    }
  };

  // Function để fetch chi tiết accommodation cho modal
  const fetchAccommodationDetails = async (accommodationId) => {
    try {
      setModalLoading(true);
      
      // Chỉ cần fetch thông tin accommodation và ảnh
      const accommodationResponse = await axios.get(`http://localhost:5000/api/accommodation/${accommodationId}?viewAs=owner`);
      
      setBookingDetails({
        accommodation: accommodationResponse.data
      });
    } catch (error) {
      console.error('Error fetching accommodation details:', error);
      messageApi.error(`Unable to load accommodation details! Error: ${error.message}`);
      setBookingDetails({ accommodation: null });
    } finally {
      setModalLoading(false);
    }
  };

  // Function để handle click vào row trong bảng Recent Bookings
  const handleRowClick = (record) => {
    setSelectedBooking(record);
    setIsModalVisible(true);
    
    // Fetch chi tiết accommodation từ accommodation ID
    if (record.accommodationId) {
      fetchAccommodationDetails(record.accommodationId);
    } else if (record.key) {
      fetchAccommodationDetails(record.key);
    } else {
      console.error('No accommodation ID found in record');
      setBookingDetails({ accommodation: null });
    }
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedBooking(null);
    setBookingDetails(null);
  };

  const recentBookingsColumns = [
    {
      title: 'Customer',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: 'Accommodation',
      dataIndex: 'accommodationTitle',
      key: 'accommodationTitle',
    },
    {
      title: 'Booking Date',
      dataIndex: 'bookingDate',
      key: 'bookingDate',
      render: (date) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => `${amount.toLocaleString()} VND`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = 'default';
        let text = status;
        
        switch(status) {
          case 'paid':
            color = 'green';
            text = 'Paid';
            break;
          case 'pending':
            color = 'orange';
            text = 'Pending';
            break;
          case 'completed':
            color = 'blue';
            text = 'Completed';
            break;
          default:
            color = 'default';
            text = status.charAt(0).toUpperCase() + status.slice(1);
        }
        
        return <Tag color={color}>{text}</Tag>;
      },
    },
  ];

  const topAccommodationsColumns = [
    {
      title: 'Accommodation',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Bookings Count',
      dataIndex: 'bookings',
      key: 'bookings',
      render: (bookings) => `${bookings} bookings`,
    },
    {
      title: 'Revenue',
      dataIndex: 'revenue',
      key: 'revenue',
      render: (revenue) => `${revenue.toLocaleString()} VND`,
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating) => (
        <div className="rating-display">
          <TrophyOutlined style={{ color: '#49735A', marginRight: '4px' }} />
          {rating}/5
        </div>
      ),
    },
  ];

  // Chart data for monthly revenue column chart - sử dụng dữ liệu thực từ API
  const columnChartData = monthlyRevenueData.length > 0 ? monthlyRevenueData : [
    // Sample data để test chart
    { month: 'thg 2 2025', revenue: 0, bookingsCount: 0 },
    { month: 'thg 3 2025', revenue: 0, bookingsCount: 0 },
    { month: 'thg 4 2025', revenue: 0, bookingsCount: 0 },
    { month: 'thg 5 2025', revenue: 0, bookingsCount: 0 },
    { month: 'thg 6 2025', revenue: 0, bookingsCount: 0 },
    { month: 'thg 7 2025', revenue: 1738271, bookingsCount: 1 }
  ];

  // Custom chart component
  const CustomColumnChart = ({ data }) => {
    if (!data || data.length === 0) {
      return (
        <div className="no-data-chart">
          <p>No revenue data available</p>
        </div>
      );
    }

    const maxRevenue = Math.max(...data.map(item => item.revenue || 0));
    
    const chartHeight = 250;
    const chartPadding = 60;
    const availableHeight = chartHeight - chartPadding;

    return (
      <div className="custom-column-chart">
        <div className="statisic-chart-container">
          {/* Grid lines */}
          <div className="grid-lines">
            <div className="grid-line" style={{ bottom: '25px' }}></div>
            <div className="grid-line" style={{ bottom: '50%' }}></div>
            <div className="grid-line" style={{ top: '20px' }}></div>
          </div>
          
          {data.map((item, index) => {
            let barHeight = 0;
            
            if (item.revenue > 0 && maxRevenue > 0) {
              barHeight = Math.max((item.revenue / maxRevenue) * availableHeight, 10); // Min 10px height
            } else if (item.revenue === 0) {
              barHeight = 5; // Show small bar for 0 values
            }
            
            const percentage = item.revenue > 0 ? (item.revenue / 1000000).toFixed(1) : '0';
            
            return (
              <div 
                key={index} 
                className="chart-column"
                style={{ '--index': index }}
              >
                <div className="column-wrapper">
                  {/* Value label */}
                  <div className="column-label" style={{ 
                    fontSize: '11px',
                    fontWeight: 'bold',
                    color: '#000',
                    textAlign: 'center',
                    marginBottom: '4px'
                  }}>
                    {item.revenue > 0 ? `${percentage}M` : '0'}
                  </div>
                  
                  {/* Column bar */}
                  <div 
                    className="column-bar" 
                    style={{ 
                      height: barHeight + 'px'
                    }}
                    title={`${item.month}: ${item.revenue.toLocaleString()} VND`}
                  />
                  
                  {/* Month label */}
                  <div className="month-label" style={{ 
                    fontSize: '12px',
                    color: '#666',
                    textAlign: 'center',
                    marginTop: '4px'
                  }}>
                    {item.month}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Y-axis labels - chỉ có title */}
        <div className="y-axis-labels">
          <div className="y-axis-title">Revenue (VND)</div>
        </div>
        
        {/* X-axis title */}
        <div className="x-axis-title" style={{ textAlign: 'center', marginTop: '10px', color: '#666' }}>
          Month
        </div>
      </div>
    );
  };

  const occupancyRate = stats.totalAccommodations > 0 
    ? Math.round((stats.bookedAccommodations / stats.totalAccommodations) * 100) 
    : 0;

  // Chart data with all 3 statuses
  const occupancyData = [
    {
      type: 'Booked',
      value: stats.bookedAccommodations,
    },
    {
      type: 'Available', 
      value: stats.availableAccommodations,
    },
    {
      type: 'Unavailable',
      value: stats.unavailableAccommodations,
    }
  ].filter(item => item.value > 0); // Only show statuses that have values

  const pieConfig = {
    data: occupancyData,
    angleField: 'value',
    colorField: 'type',
    color: ['#1890ff', '#52c41a', '#ff4d4f'], // Blue, Green, Red
    radius: 0.8,
    innerRadius: 0.4,
    legend: false,
    autoFit: true,
    statistic: {
      title: {
        style: {
          fontSize: '14px',
          color: '#666',
        },
        content: 'Total',
      },
      content: {
        style: {
          fontSize: '20px',
          fontWeight: 'bold',
          color: '#333',
        },
        content: `${stats.totalAccommodations}`,
      },
    },
  };

  return (
    <>
      {contextHolder}
      <div className="statistics-wrapper">
        
        {/* Overview Cards */}
        <Row gutter={[24, 24]} className="stats-cards">
          <Col xs={24} sm={12} lg={6}>
            <Card className="stat-card">
              <Statistic
                title="Total Accommodations"
                value={stats.totalAccommodations}
                prefix={<HomeOutlined className="stat-icon" />}
                valueStyle={{ color: '#49735A' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="stat-card">
              <Statistic
                title="Booked"
                value={stats.bookedAccommodations}
                prefix={<UserOutlined className="stat-icon" />}
                valueStyle={{ color: '#49735A' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="stat-card">
              <Statistic
                title={`Membership: ${membership.packageName}`}
                value={membership.isActive ? "Active" : "Inactive"}
                prefix={<UserOutlined className="stat-icon" />}
                valueStyle={{ 
                  color: membership.isActive ? '#52c41a' : '#ff4d4f',
                  fontSize: '18px'
                }}
                suffix={
                  membership.expiredAt && membership.isActive ? (
                    <span style={{ fontSize: '12px', color: '#666' }}>
                      Until {new Date(membership.expiredAt).toLocaleDateString('vi-VN')}
                    </span>
                  ) : null
                }
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="stat-card">
              <Statistic
                title="Total Revenue"
                value={stats.totalRevenue}
                prefix={<DollarOutlined className="stat-icon" />}
                formatter={(value) => `${value.toLocaleString()} VND`}
                valueStyle={{ color: '#49735A' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Monthly Revenue Chart and Occupancy Rate */}
        <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
          <Col xs={24} lg={16}>
            <Card className="chart-card" title={
              <div className="card-title">
                <DollarOutlined /> Monthly Revenue
              </div>
            }>
              <CustomColumnChart data={columnChartData} />
            </Card>
          </Col>
          <Col xs={24} lg={8}>
            <Card className="chart-card" title={
              <div className="card-title">
                <CalendarOutlined /> Occupancy Rate
              </div>
            }>
              <div className="occupancy-container">
                {stats.totalAccommodations > 0 ? (
                  <div className="occupancy-chart-container">
                    <div className="occupancy-chart-svg">
                      <svg width="160" height="160" viewBox="0 0 160 160">
                        <defs>
                          <circle
                            id="circle"
                            cx="80"
                            cy="80"
                            r="70"
                            fill="none"
                            strokeWidth="12"
                          />
                        </defs>
                        
                        {/* Background circle */}
                        <circle
                          cx="80"
                          cy="80"
                          r="70"
                          fill="none"
                          stroke="#f0f0f0"
                          strokeWidth="12"
                        />
                        
                        {/* Booked segment */}
                        {stats.bookedAccommodations > 0 && (
                          <circle
                            cx="80"
                            cy="80"
                            r="70"
                            fill="none"
                            stroke="#1890ff"
                            strokeWidth="12"
                            strokeDasharray={`${(stats.bookedAccommodations / stats.totalAccommodations) * 440} ${440 - (stats.bookedAccommodations / stats.totalAccommodations) * 440}`}
                            strokeDashoffset="0"
                            transform="rotate(-90 80 80)"
                          />
                        )}
                        
                        {/* Available segment */}
                        {stats.availableAccommodations > 0 && (
                          <circle
                            cx="80"
                            cy="80"
                            r="70"
                            fill="none"
                            stroke="#52c41a"
                            strokeWidth="12"
                            strokeDasharray={`${(stats.availableAccommodations / stats.totalAccommodations) * 440} ${440 - (stats.availableAccommodations / stats.totalAccommodations) * 440}`}
                            strokeDashoffset={`-${(stats.bookedAccommodations / stats.totalAccommodations) * 440}`}
                            transform="rotate(-90 80 80)"
                          />
                        )}
                        
                        {/* Unavailable segment */}
                        {stats.unavailableAccommodations > 0 && (
                          <circle
                            cx="80"
                            cy="80"
                            r="70"
                            fill="none"
                            stroke="#ff4d4f"
                            strokeWidth="12"
                            strokeDasharray={`${(stats.unavailableAccommodations / stats.totalAccommodations) * 440} ${440 - (stats.unavailableAccommodations / stats.totalAccommodations) * 440}`}
                            strokeDashoffset={`-${((stats.bookedAccommodations + stats.availableAccommodations) / stats.totalAccommodations) * 440}`}
                            transform="rotate(-90 80 80)"
                          />
                        )}
                      </svg>
                      
                      {/* Center text */}
                      <div className="occupancy-chart-center">
                        <div className="occupancy-chart-center-title">Total</div>
                        <div className="occupancy-chart-center-value">
                          {stats.totalAccommodations}
                        </div>
                      </div>
                    </div>
                    <div className="occupancy-legend">
                      <div className="occupancy-legend-item">
                        <span className="occupancy-legend-dot booked"></span>
                        <span className="occupancy-legend-text">Booked ({stats.bookedAccommodations})</span>
                      </div>
                      <div className="occupancy-legend-item">
                        <span className="occupancy-legend-dot available"></span>
                        <span className="occupancy-legend-text">Available ({stats.availableAccommodations})</span>
                      </div>
                      <div className="occupancy-legend-item">
                        <span className="occupancy-legend-dot unavailable"></span>
                        <span className="occupancy-legend-text">Unavailable ({stats.unavailableAccommodations})</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="no-data">
                    <p>No accommodation data available</p>
                  </div>
                )}
              </div>
            </Card>
          </Col>
        </Row>

        {/* Recent Bookings */}
        <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
          <Col span={24}>
            <Card className="chart-card" title={
              <div className="card-title">
                <EyeOutlined /> Recent Bookings
                <span className="recent-bookings-hint">
                  (Click on any row to view details)
                </span>
              </div>
            }>
              <Table
                dataSource={recentBookings}
                columns={recentBookingsColumns}
                pagination={false}
                loading={loading}
                className="bookings-table"
                onRow={(record) => ({
                  onClick: () => handleRowClick(record),
                  style: { cursor: 'pointer' }
                })}
              />
            </Card>
          </Col>
        </Row>

        {/* Modal để hiển thị chi tiết booking */}
        <Modal
          title={
            <div className="modal-title">
              <InfoCircleOutlined />
              Booking Details - {selectedBooking?.accommodationTitle}
            </div>
          }
          open={isModalVisible}
          onCancel={handleCloseModal}
          footer={null}
          width={800}
        >
          {selectedBooking && (
            <div>
              {/* Thông tin booking chính */}
              <Card 
                title="Booking Information" 
                size="small" 
                className="booking-info-card"
              >
                <Descriptions column={2} size="small">
                  <Descriptions.Item label="Customer Name">
                    <strong>{selectedBooking.customerName}</strong>
                  </Descriptions.Item>
                  <Descriptions.Item label="Booking ID">
                    <code>{selectedBooking.bookingId || selectedBooking.key}</code>
                  </Descriptions.Item>
                  <Descriptions.Item label="Accommodation">
                    {selectedBooking.accommodationTitle}
                  </Descriptions.Item>
                  <Descriptions.Item label="Booking Date">
                    {new Date(selectedBooking.bookingDate).toLocaleDateString('vi-VN')} {new Date(selectedBooking.bookingDate).toLocaleTimeString('vi-VN')}
                  </Descriptions.Item>
                                    <Descriptions.Item label="Amount">
                    <strong style={{ color: '#49735A' }}>{selectedBooking.amount.toLocaleString()} VND</strong>
                  </Descriptions.Item>
                  <Descriptions.Item label="Status">
                    <Tag color={
                      selectedBooking.status === 'paid' ? 'green' :
                      selectedBooking.status === 'pending' ? 'orange' :
                      selectedBooking.status === 'completed' ? 'blue' : 'default'
                    }>
                      {selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}
                    </Tag>
                  </Descriptions.Item>
                </Descriptions>
              </Card>

              {/* Hình ảnh accommodation */}
              <Card 
                title="Accommodation Images"
                size="small"
                loading={modalLoading}
              >
                {modalLoading ? (
                  <div className="modal-loading">
                    <p>Loading accommodation images...</p>
                  </div>
                ) : bookingDetails?.accommodation ? (
                  <div>
                    {/* Hiển thị hình ảnh accommodation */}
                    {bookingDetails.accommodation.photos && bookingDetails.accommodation.photos.length > 0 ? (
                      <div className="accommodation-images">
                        {bookingDetails.accommodation.photos.slice(0, 4).map((photo, index) => (
                          <div key={index} className="accommodation-image">
                            <img
                              src={`http://localhost:5000${photo}`}
                              alt={`Accommodation ${index + 1}`}
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          </div>
                        ))}
                        {bookingDetails.accommodation.photos.length > 4 && (
                          <div className="accommodation-more-images">
                            +{bookingDetails.accommodation.photos.length - 4} more
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="no-images-placeholder">
                        <CameraOutlined />
                        No images available for this accommodation
                      </div>
                    )}
                    <div className="accommodation-info">
                      <strong>{bookingDetails.accommodation.title}</strong>
                      <div className="accommodation-location">
                        <EnvironmentOutlined style={{ marginRight: '4px', color: '#49735A' }} />
                        {[
                          bookingDetails.accommodation.location?.street,
                          bookingDetails.accommodation.location?.district,
                          bookingDetails.accommodation.location?.addressDetail
                        ].filter(Boolean).join(', ')}
                      </div>
                      <div className="accommodation-price">
                        <DollarOutlined style={{ marginRight: '4px', color: '#49735A' }} />
                        {bookingDetails.accommodation.price?.toLocaleString()} VND/month
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="accommodation-details-error">
                    <EyeOutlined />
                    <p>Unable to load accommodation details.</p>
                  </div>
                )}
              </Card>
            </div>
          )}
        </Modal>
      </div>
    </>
  );
};

export default Statistics;
