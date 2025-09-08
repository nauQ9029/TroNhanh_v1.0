import React, { useState, useEffect } from "react";
import "./report.css";
import { Table, Button, Select, Modal, message } from "antd";
import { EnvironmentOutlined, UserOutlined } from "@ant-design/icons";
import { createReport, getMyReports } from "../../../services/reportService";
import useUser from "../../../contexts/UserContext";
import axios from "axios";
const { Option } = Select;

const Report = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const { user } = useUser();
  const [reportList, setReportList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Thêm state cho accommodations và bookings
  const [bookedAccommodations, setBookedAccommodations] = useState([]);
  
  const [reportForm, setReportForm] = useState({
    type: "",
    content: "",
    accommodationId: "", // Đổi về accommodationId thay vì bookingId
  });

  // Fetch reports khi component mount
  useEffect(() => {
    if (user?._id) {
      const loadData = async () => {
        await fetchBookedAccommodations();
        await fetchReports();
      };
      loadData();
    }
  }, [user]);

  // Fetch accommodations đang ở trạng thái "Booked"
  const fetchBookedAccommodations = async () => {
    try {
      // Lấy tất cả accommodations của owner có status = "Booked"
      const accRes = await axios.get(`http://localhost:5000/api/accommodation?ownerId=${user._id}`);
      const ownerAccommodations = accRes.data;
      
      // Lọc chỉ những accommodation đang có status "Booked"
      const bookedAccommodations = ownerAccommodations.filter(acc => acc.status === "Booked");
      
      // Nếu không có accommodation nào có status "Booked", test với Available accommodations có booking
      let accommodationsToProcess = bookedAccommodations;
      if (bookedAccommodations.length === 0) {
        accommodationsToProcess = ownerAccommodations;
      }
      
      // Lấy thông tin customer cho mỗi accommodation đã booked
      const accommodationsWithCustomer = await Promise.all(
        accommodationsToProcess.map(async (acc) => {
          try {
            // Lấy booking info để có thông tin customer
            const bookingRes = await axios.get(`http://localhost:5000/api/booking/accommodation/${acc._id}`);
            
            const latestBooking = bookingRes.data.find(booking => 
              booking.status === "paid" || booking.status === "pending"
            );
            
            // Nếu không có booking paid/pending, lấy booking mới nhất bất kỳ
            const fallbackBooking = bookingRes.data.length > 0 ? bookingRes.data[0] : null;
            const selectedBooking = latestBooking || fallbackBooking;
            
            // Lấy customer info từ customerId của booking (đã populated từ backend)
            const customerInfo = selectedBooking?.customerId;
            
            // Thử trực tiếp lấy từ customerId nếu customerInfo bị undefined
            const finalCustomerInfo = customerInfo || selectedBooking?.customerId;
            
            // Tạo object mới với customer info ghi đè - KHÔNG dùng spread
            const result = Object.assign({}, acc, {
              bookingInfo: selectedBooking,
              customerId: selectedBooking?.customerId || null,
              customer: finalCustomerInfo
            });
            
            return result;
          } catch (error) {
            console.error(`❌ Failed to fetch booking for accommodation ${acc._id}:`, error);
            return {
              ...acc,
              customer: null
            };
          }
        })
      );
      
      setBookedAccommodations(accommodationsWithCustomer);
    } catch (error) {
      console.error("❌ Failed to fetch booked accommodations:", error);
    }
  };

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await getMyReports();
      
      // Format data để hiển thị trong table
      const formattedReports = response.data.map((report, index) => {
        // Nếu report không có reportedUserId nhưng có accommodationId, 
        // thử tìm customer từ accommodations data hiện tại
        let customerName = null;
        if (report.reportedUserId) {
          customerName = report.reportedUserId.name || report.reportedUserId.email || report.reportedUserId;
        } else if (report.accommodationId) {
          // Tìm accommodation trong bookedAccommodations để lấy customer info
          const matchedAcc = bookedAccommodations.find(acc => acc._id === report.accommodationId._id);
          if (matchedAcc?.customer) {
            customerName = matchedAcc.customer.name || matchedAcc.customer.email || 'Customer Found';
          }
        }
        
        return {
          key: report._id || index,
          type: report.type,
          content: report.content,
          relatedAccommodation: report.accommodationId ? {
            title: report.accommodationId.title,
            location: `${report.accommodationId.location?.street}, ${report.accommodationId.location?.district}`,
            status: report.accommodationId.status,
            customer: customerName // Thêm customer info vào accommodation object
          } : null,
          adminFeedback: report.adminFeedback || null,
          reportedUser: customerName,
          status: report.status,
          submittedAt: new Date(report.createAt).toLocaleString(),
        };
      });
      
      setReportList(formattedReports);
    } catch (error) {
      console.error("❌ Failed to fetch reports:", error);
      messageApi.error("Unable to load reports!");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setReportForm({ ...reportForm, [field]: value });
  };

  const handleSubmit = async () => {
    const { type, content, accommodationId } = reportForm;

    if (!type || content.trim().length < 10) {
      messageApi.error("Vui lòng chọn loại report và nội dung tối thiểu 10 ký tự.");
      return;
    }

    try {
      setSubmitting(true);
      
      // Lấy thông tin accommodation và customer đã chọn
      const selectedAccommodation = bookedAccommodations.find(acc => acc._id === accommodationId);
      
      // Lấy customer ID - từ customerId field
      let customerId = null;
      if (selectedAccommodation?.customerId) {
        customerId = selectedAccommodation.customerId._id || selectedAccommodation.customerId;
      }
      
      // Gửi lên MongoDB thông qua API
      const payload = {
        type,
        content,
        reporterId: user?._id,
        ...(accommodationId && { accommodationId }),
        ...(customerId && { reportedUserId: customerId }),
      };
      
      await createReport(payload);

      // Refresh danh sách reports sau khi tạo thành công
      await fetchReports();
      
      setReportForm({ 
        type: "", 
        content: "",
        accommodationId: "",
      });
      setIsModalVisible(false);
      messageApi.success("Report đã được gửi tới admin!");
      
    } catch (error) {
      console.error("❌ Owner Report submission failed:", error);
      messageApi.error(error?.response?.data?.message || "Failed to submit report.");
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      title: "Type",
      dataIndex: "type",
      width: 120, // Giảm từ 150 xuống 120
    },
    {
      title: "Related Accommodation",
      dataIndex: "relatedAccommodation",
      width: 280, // Giảm từ 350 xuống 280
      render: (accommodation) => accommodation ? (
        <div style={{ fontSize: "11px" }}> {/* Giảm từ 12px xuống 11px */}
          <div style={{ fontWeight: "bold" }}>{accommodation.title}</div>
          <div style={{ color: "#666" }}>{accommodation.location}</div>
          {accommodation.customer && (
            <div style={{ color: "#1890ff", marginTop: "2px" }}>
              <UserOutlined style={{ marginRight: "4px" }} />
              {accommodation.customer}
            </div>
          )}
          <div style={{ color: "#999" }}>
            Status: {accommodation.status}
          </div>
        </div>
      ) : <span style={{ color: "#ccc" }}>General Report</span>
    },

    {
      title: "Content",
      dataIndex: "content",
      width: 200, // Giảm từ 250 xuống 200
      render: (text) => (
        <div style={{ 
          maxHeight: "60px", 
          overflow: "hidden", 
          textOverflow: "ellipsis",
          fontSize: "11px" // Giảm từ 12px xuống 11px
        }}>
          {text.length > 80 ? `${text.substring(0, 80)}...` : text} {/* Giảm từ 100 xuống 80 */}
        </div>
      )
    },
    {
      title: "Admin Feedback",
      dataIndex: "adminFeedback",
      width: 180, // Giảm từ 200 xuống 180
      render: (feedback) => feedback ? (
        <div style={{ 
          fontSize: "11px", // Giảm từ 12px xuống 11px
          color: "#666",
          maxHeight: "60px", 
          overflow: "hidden"
        }}>
          {feedback.length > 60 ? `${feedback.substring(0, 60)}...` : feedback} {/* Giảm từ 80 xuống 60 */}
        </div>
      ) : <span style={{ color: "#ccc", fontSize: "11px" }}>No feedback yet</span>
    },
    {
      title: "Status",
      dataIndex: "status",
      width: 80, // Giảm từ 100 xuống 80
      render: (status) => (
        <span className={`status-tag ${status.toLowerCase()}`}>{status}</span>
      ),
    },
    {
      title: "Submitted At",
      dataIndex: "submittedAt",
      width: 130, // Giảm từ 150 xuống 130
      render: (date) => <span style={{ fontSize: "11px" }}>{date}</span> // Giảm từ 12px xuống 11px
    },
  ];

  return (
    <>
      {contextHolder}
      <div className="report-wrapper">
        <div className="report-header">
          <h2>Report to Admin</h2>
          <div>
            <Button className="open-modal-btn" onClick={() => setIsModalVisible(true)}>
              Create Report
            </Button>
          </div>
        </div>

      <Table 
        className="report-table" 
        dataSource={reportList} 
        columns={columns} 
        pagination={false}
        loading={loading}
        scroll={{ x: 1010 }} // Giảm từ 1200 xuống 1010
        size="small"
      />

      <Modal
        title="New Report"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleSubmit}
        okText={submitting ? "Submitting..." : "Submit"}
        cancelText="Cancel"
        confirmLoading={submitting}
      >
        <div className="report-form">
          <label>Type:</label>
          <Select
            value={reportForm.type}
            onChange={(value) => handleChange("type", value)}
            placeholder="Select report type"
            style={{ width: "100%", marginBottom: "15px" }}
          >
            <Option value="Fake Booking">Fake Booking</Option>
            <Option value="Fraudulent Transaction">Fraudulent Transaction</Option>
            <Option value="Abusive Renter">Abusive Renter</Option>
            <Option value="No-show Customer">No-show Customer</Option>
            <Option value="Property Damage">Property Damage</Option>
            <Option value="Payment Issue">Payment Issue</Option>
            <Option value="Spam/Scam">Spam / Scam</Option>
            <Option value="Violation of Terms">Violation of Terms</Option>
            <Option value="System Issue">System Issue</Option>
            <Option value="Technical Error">Technical Error</Option>
            <Option value="Other">Other</Option>
          </Select>

          <label>Related Booking (Optional):</label>
          <Select
            value={reportForm.accommodationId}
            onChange={(value) => handleChange("accommodationId", value)}
            placeholder="Select an accommodation with customer to report"
            style={{ width: "100%", marginBottom: "15px" }}
            allowClear
            optionLabelProp="label"
          >
            {bookedAccommodations.map(acc => (
              <Option 
                key={acc._id} 
                value={acc._id}
                label={acc.title}
              >
                <div style={{ 
                  display: "flex", 
                  flexDirection: "column", 
                  padding: "4px 0",
                  lineHeight: "1.4"
                }}>
                  <span style={{ 
                    fontWeight: "bold", 
                    fontSize: "14px",
                    marginBottom: "2px"
                  }}>
                    {acc.title}
                  </span>
                  <span style={{ 
                    fontSize: "12px", 
                    color: "#666",
                    marginBottom: "2px"
                  }}>
                    <EnvironmentOutlined style={{ marginRight: "4px" }} />
                    {acc.location?.street}, {acc.location?.district}
                  </span>
                  {acc.customerId && (
                    <span style={{ 
                      fontSize: "12px", 
                      color: "#1890ff",
                      marginBottom: "2px",
                      fontWeight: "500"
                    }}>
                      <UserOutlined style={{ marginRight: "4px" }} />
                      Customer: {acc.customerId.name || acc.customerId.email || 'Unknown'}
                    </span>
                  )}
                  <span style={{ 
                    fontSize: "11px", 
                    color: "#999",
                    fontStyle: "italic"
                  }}>
                    Status: {acc.status}
                  </span>
                </div>
              </Option>
            ))}
          </Select>

          {reportForm.accommodationId && (
            <div style={{ 
              background: "#f0f2f5", 
              padding: "10px", 
              borderRadius: "6px", 
              marginBottom: "15px",
              fontSize: "12px",
              color: "#666"
            }}>
              {(() => {
                const selected = bookedAccommodations.find(acc => acc._id === reportForm.accommodationId);
                return selected ? (
                  <>
                    <strong>Selected Accommodation:</strong> {selected.title}<br/>
                    <strong>Location:</strong> {selected.location?.street}, {selected.location?.district}<br/>
                    <strong>Status:</strong> {selected.status}<br/>
                    <strong>Price:</strong> {selected.price?.toLocaleString()} VND<br/>
                    {selected.customerId && (
                      <><strong>Customer:</strong> {selected.customerId.name || selected.customerId.email || 'Unknown'}</>
                    )}
                  </>
                ) : null;
              })()}
            </div>
          )}

          <label>Content:</label>
          <textarea
            rows={5}
            placeholder="Describe the issue in detail. If reporting about a specific booking, please provide evidence and timeline..."
            value={reportForm.content}
            onChange={(e) => handleChange("content", e.target.value)}
            style={{ marginBottom: "10px", fontSize: "14px" }}
          />
          
          <div style={{ fontSize: "12px", color: "#999", marginTop: "5px" }}>
            <strong>Note:</strong> Reports will be reviewed by administrators. Please provide accurate information.
          </div>
        </div>
      </Modal>
    </div>
    </>
  );
};

export default Report;