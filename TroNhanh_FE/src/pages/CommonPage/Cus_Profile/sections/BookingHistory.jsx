import React, { useState, useEffect } from 'react';
import { Table, Card, Tag, Button, Modal, message, Carousel } from 'antd';
import { EyeOutlined, CalendarOutlined, HomeOutlined, DollarOutlined } from '@ant-design/icons';
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import { getUserBookingHistory } from '../../../../services/bookingService';
import { getAccommodationById } from '../../../../services/accommodationAPI';
import useUser from '../../../../contexts/UserContext';
import './BookingHistory.css';

const BookingHistory = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const { user } = useUser();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    if (user?._id) {
      fetchBookingHistory();
    }
  }, [user]);

  const fetchBookingHistory = async () => {
    try {
      setLoading(true);
      console.log('Fetching booking history for user:', user._id);
      const data = await getUserBookingHistory(user._id);
      console.log('Booking history response:', data);
      setBookings(data);
    } catch (error) {
      console.error('Error fetching booking history:', error);
      messageApi.error(`Unable to load booking history! ${error.response?.data?.message || error.message || ''}`);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (booking) => {
    try {
      console.log('Booking object:', booking);
      console.log('PropertyId:', booking.propertyId);
      
      // Lấy ID từ propertyId (có thể là object hoặc string)
      const propertyId = booking.propertyId?._id || booking.propertyId;
      console.log('Extracted propertyId:', propertyId);
      
      if (!propertyId) {
        messageApi.error('Property ID not found!');
        return;
      }
      
      // Fetch chi tiết accommodation
      const accommodationData = await getAccommodationById(propertyId);
      setSelectedBooking({
        ...booking,
        accommodation: accommodationData
      });
      setIsModalVisible(true);
    } catch (error) {
      console.error('Error fetching accommodation details:', error);
      console.error('Error details:', error.response?.data);
      messageApi.error(`Unable to load detailed information! ${error.response?.data?.message || error.message || ''}`);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'success';
      case 'pending':
        return 'processing';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'paid':
        return 'Paid';
      case 'pending':
        return 'Pending';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const columns = [
    {
      title: 'Accommodation',
      dataIndex: 'propertyId',
      key: 'propertyId',
      render: (propertyId, record) => {
        // Hiển thị tên accommodation nếu có, nếu không thì hiển thị ID
        if (propertyId && typeof propertyId === 'object' && propertyId.title) {
          return propertyId.title;
        }
        return `Property #${(propertyId?.slice ? propertyId.slice(-8) : propertyId) || 'Unknown'}`;
      },
    },
    {
      title: 'Booking Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString('vi-VN'),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: 'Check-in Date',
      dataIndex: 'checkInDate',
      key: 'checkInDate',
      render: (date) => date ? new Date(date).toLocaleDateString('vi-VN') : 'N/A',
    },
    {
      title: 'Check-out Date',
      dataIndex: 'checkOutDate',
      key: 'checkOutDate',
      render: (date) => date ? new Date(date).toLocaleDateString('vi-VN') : 'N/A',
    },
    {
      title: 'Total Amount',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (price) => `${price?.toLocaleString()} VND`,
      sorter: (a, b) => a.totalPrice - b.totalPrice,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)} className="booking-history-tag">
          {getStatusText(status)}
        </Tag>
      ),
      filters: [
        { text: 'Paid', value: 'paid' },
        { text: 'Pending', value: 'pending' },
        { text: 'Cancelled', value: 'cancelled' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Actions',
      key: 'action',
      render: (_, record) => (
        <Button
          type="primary"
          icon={<EyeOutlined />}
          onClick={() => handleViewDetails(record)}
          size="small"
          className="booking-history-details-btn"
        >
          Details
        </Button>
      ),
    },
  ];

  return (
    <>
      {contextHolder}
      <div className="booking-history-container">
        <Card 
          title={
            <div className="header-with-icon">
              <CalendarOutlined style={{ marginRight: '8px', color: 'white' }} />
              Booking History
            </div>
          }
          className="booking-history-card"
        >
          <Table
            columns={columns}
            dataSource={bookings}
            rowKey="_id"
            loading={loading}
            className="booking-history-table"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => 
                `${range[0]}-${range[1]} of ${total} bookings`,
            }}
            scroll={{ x: 800 }}
          />
        </Card>

        {/* Modal chi tiết booking */}
        <Modal
          title="Booking Details"
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
          width={800}
          className="booking-history-modal"
        >
          {selectedBooking && (
            <div className="booking-detail-modal">
              {/* Thông tin accommodation */}
              {selectedBooking.accommodation && (
                <Card 
                  title={
                    <div className="detail-section-title">
                      <HomeOutlined /> Accommodation Information
                    </div>
                  } 
                  className="detail-card"
                >
                  {/* Hình ảnh accommodation */}
                  {selectedBooking.accommodation.photos && selectedBooking.accommodation.photos.length > 0 && (
                    <div style={{ marginBottom: '16px' }}>
                      <Carousel
                        autoplay
                        arrows
                        prevArrow={<AiOutlineLeft className="custom-arrow arrow-left" />}
                        nextArrow={<AiOutlineRight className="custom-arrow arrow-right" />}
                      >
                        {selectedBooking.accommodation.photos.map((photo, index) => (
                          <div key={index}>
                            <img
                              src={`http://localhost:5000${photo}`}
                              alt={`accommodation-${index}`}
                              style={{
                                width: "100%",
                                maxHeight: "250px",
                                objectFit: "cover",
                                borderRadius: "8px"
                              }}
                            />
                          </div>
                        ))}
                      </Carousel>
                    </div>
                  )}

                  <div className="accommodation-info">
                    <h3>{selectedBooking.accommodation.title}</h3>
                    <p><strong>Address:</strong> {selectedBooking.accommodation.location?.addressDetail}, {selectedBooking.accommodation.location?.street}, {selectedBooking.accommodation.location?.district}</p>
                    <p><strong>Room Price:</strong> {selectedBooking.accommodation.price?.toLocaleString()} VND</p>
                    <p><strong>Description:</strong> {selectedBooking.accommodation.description}</p>
                  </div>
                </Card>
              )}

              {/* Thông tin booking */}
              <Card 
                title={
                  <div className="detail-section-title">
                    <CalendarOutlined /> Booking Information
                  </div>
                } 
                className="detail-card"
                style={{ marginTop: '16px' }}
              >
                <div className="booking-info-inline">
                  <span className="info-inline-item">
                    <strong>VNPay Transaction ID:</strong> {selectedBooking.paymentInfo?.vnpayTransactionId || 'N/A'}
                  </span>
                  <span className="info-divider">|</span>
                  <span className="info-inline-item">
                    <strong>Guests:</strong> {selectedBooking.guests || 1} people
                  </span>
                  <span className="info-divider">|</span>
                  <span className="info-inline-item">
                    <strong>Purpose:</strong> {selectedBooking.guestInfo?.purpose || 'N/A'}
                  </span>
                </div>
              </Card>
            </div>
          )}
        </Modal>
      </div>
    </>
  );
};

export default BookingHistory;