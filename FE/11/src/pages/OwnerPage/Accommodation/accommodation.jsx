// file TroNhanh_FE/src/pages/OwnerPage/Accommodation/accommodation.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Tag, Modal, Carousel, message } from "antd";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import { UserOutlined } from "@ant-design/icons";
import { geocodeWithOpenCage } from "../../../services/OpenCage";
import "./accommodation.css";
import { getValidAccessToken } from "../../../services/authService";
import { getOwnerMembershipInfo } from "../../../services/accommodationAPI";
import useUser from "../../../contexts/UserContext";

const Accommodation = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const districtOptions = [
    "Hải Châu",
    "Thanh Khê",
    "Sơn Trà",
    "Ngũ Hành Sơn",
    "Liên Chiểu",
    "Cẩm Lệ",
    "Hoà Vang",
  ];

  const { user } = useUser();
  const [data, setData] = useState([]);
  const [membershipInfo, setMembershipInfo] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [newAccommodation, setNewAccommodation] = useState({
    title: "",
    location: {
      street: "",
      district: "",
      addressDetail: "",
      latitude: null,
      longitude: null
    },
    price: "",
    description: "",
    photos: [],
    status: "Available",
    files: [],
  });


  useEffect(() => {
    fetchAccommodations();
    fetchMembershipInfo();
  }, []);

  const fetchMembershipInfo = async () => {
    try {
      const response = await getOwnerMembershipInfo();
      setMembershipInfo(response.data);
    } catch (error) {
      console.error("Error fetching membership info:", error);
    }
  };

  const fetchAccommodations = async () => {
    try {
      
      if (!user || !user._id) return;

      const res = await axios.get(`http://localhost:5000/api/accommodation?ownerId=${user._id}`);
      const fetchedData = res.data.map((item) => ({
        ...item,
        key: item._id,
      }));
      setData(fetchedData);
    } catch (error) {
      console.error("Error fetching accommodations:", error);
    }
  };


  const handleView = (record) => {
    setSelectedRow(record);
    setIsModalVisible(true);
  };

  const handleRemove = async (id) => {
    try {
      // Tìm accommodation trong data để kiểm tra status
      const accommodationToDelete = data.find(item => item._id === id);
      
      if (accommodationToDelete && accommodationToDelete.status === "Booked") {
        messageApi.error("Không thể xóa accommodation này vì đang có khách hàng đặt phòng!");
        return;
      }

      if (window.confirm("Bạn có chắc chắn muốn xóa chỗ ở này?")) {
        await axios.delete(`http://localhost:5000/api/accommodation/${id}`);
        setData(data.filter((item) => item._id !== id));
        
        // Refresh membership info to update current post count
        fetchMembershipInfo();
        
        messageApi.success("Xóa accommodation thành công!");
      }
    } catch (error) {
      console.error("Error deleting accommodation:", error);
      
      // Xử lý lỗi từ backend
      if (error.response && error.response.status === 400) {
        messageApi.error(error.response.data.message);
      } else {
        messageApi.error("Có lỗi xảy ra khi xóa accommodation!");
      }
    }
  };

  const handleUpdate = (record) => {
    setEditingRow({ ...record, files: [] });
    setIsUpdateModalVisible(true);
  };

  const columns = [
    { title: "Title", dataIndex: "title" },
    {
      title: "Street",
      dataIndex: "location",
      render: (loc) => loc?.street || "N/A",
    },
    {
      title: "District",
      dataIndex: "location",
      render: (loc) => loc?.district || "N/A",
    },
    {
      title: "Price (VND)",
      dataIndex: "price",
      render: (text) => text.toLocaleString(),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => {
        let color = "default";
        
        switch(status) {
          case "Available":
            color = "green";
            break;
          case "Booked":
            color = "blue";
            break;
          case "Unavailable":
            color = "volcano";
            break;
          default:
            color = "default";
        }
        
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Actions",
      render: (_, record) => (
        <div className="action-buttons">
          <Button onClick={() => handleView(record)} className="view-btn">
            View
          </Button>
          <Button className="update-btn" onClick={() => handleUpdate(record)}>
            Update
          </Button>
          <Button
            className="remove-btn"
            onClick={() => handleRemove(record._id)}
          >
            Remove
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      {contextHolder}
      <div className="accommodation-wrapper">
        <div className="header-row">
          <h2>Manage Accommodation</h2>
          <Button
            className="add-btn"
            onClick={async () => {
              
              if (!user || !user._id) {
                messageApi.warning("Vui lòng đăng nhập lại.");
                return;
              }

              try {
                const res = await axios.get(`http://localhost:5000/api/payment/current/${user._id}`);
                const pkg = res.data.package;

                if (!pkg) {
                  messageApi.error("Bạn chưa mua gói membership nào. Vui lòng mua để sử dụng tính năng này.");
                  return;
                }

                const expiredAt = new Date(res.data.expiredAt);
                const now = new Date();

                if (now > expiredAt) {
                  messageApi.error("Gói membership của bạn đã hết hạn. Vui lòng gia hạn để tiếp tục.");
                  return;
                }

                // ✅ Nếu membership còn hạn → mở modal
                setIsAddModalVisible(true);
              } catch (err) {
                console.error("❌ Lỗi khi kiểm tra membership:", err);
                messageApi.error("Không thể kiểm tra trạng thái membership. Vui lòng thử lại.");
              }
            }}
          >
            ADD
          </Button>

        </div>

        {/* Membership Info Display */}
        {membershipInfo && (
          <div className="membership-info-card">
            <div className="membership-info-content">
              <h3>Membership Information</h3>
              <div className="membership-details">
                <div className="membership-item">
                  <span className="label">Plan:</span>
                  <span className="value">{membershipInfo.membership?.name || 'Free'}</span>
                </div>
                <div className="membership-item">
                  <span className="label">Posts Usage:</span>
                  <span className="value">
                    {membershipInfo.currentPosts} / {membershipInfo.maxPosts} Active Posts
                  </span>
                </div>
                <div className="membership-progress">
                  <div 
                    className="progress-bar"
                    style={{
                      width: `${(membershipInfo.currentPosts / membershipInfo.maxPosts) * 100}%`,
                      backgroundColor: membershipInfo.currentPosts >= membershipInfo.maxPosts ? '#ff4d4f' : '#52c41a'
                    }}
                  ></div>
                </div>
                {membershipInfo.currentPosts >= membershipInfo.maxPosts && (
                  <div className="membership-warning">
                    ⚠️ You have reached the maximum number of posts for your current plan.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      <Table
        className="accommodation-table"
        columns={columns}
        dataSource={data}
        pagination={false}
      />

      {/* ADD MODAL */}
      <Modal
        title="Add New Accommodation"
        open={isAddModalVisible}
        onCancel={() => setIsAddModalVisible(false)}
        onOk={async () => {
          try {
            
            const token = await getValidAccessToken();
            if (!user || !user._id || !token) {
              return messageApi.error("Bạn chưa đăng nhập. Hãy đăng nhập lại!");
            }

            const coords = await geocodeWithOpenCage(
              `${newAccommodation.location.street}, ${newAccommodation.location.district}, Đà Nẵng, Việt Nam`
            );

            if (!coords) {
              return messageApi.error("Không thể lấy tọa độ từ địa chỉ đã nhập.");
            }

            const locationFull = {
              ...newAccommodation.location,
              latitude: coords.latitude,
              longitude: coords.longitude,
            };

            const formData = new FormData();
            formData.append("title", newAccommodation.title);
            formData.append("description", newAccommodation.description);
            formData.append("price", newAccommodation.price);
            formData.append("status", newAccommodation.status);
            formData.append("ownerId", user._id);
            formData.append("location", JSON.stringify(locationFull));

            newAccommodation.files.forEach((file) => {
              formData.append("photos", file);
            });

            const res = await axios.post("http://localhost:5000/api/accommodation", formData, {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
              },
            });

            setData([...data, { ...res.data.data, key: res.data.data._id }]);
            setIsAddModalVisible(false);
            
            // Refresh membership info to update current post count
            fetchMembershipInfo();

            // 👇 Đừng quên reset lại full location có latitude + longitude
            setNewAccommodation({
              title: "",
              location: {
                street: "",
                district: "",
                addressDetail: "",
                latitude: null,
                longitude: null,
              },
              price: "",
              description: "",
              photos: [],
              status: "Available",
              files: [],
            });

            messageApi.success("Accommodation added successfully!");
          } catch (error) {
            console.error("Error adding accommodation:", error);
            
            // Xử lý các loại lỗi khác nhau
            if (error.response && error.response.status === 403) {
              const errorData = error.response.data;
              
              if (errorData.currentCount !== undefined && errorData.allowedCount !== undefined) {
                // Lỗi về giới hạn số lượng accommodations
                messageApi.error(
                  `${errorData.message}\n\nHiện tại: ${errorData.currentCount}/${errorData.allowedCount} accommodations`,
                  5 // Hiển thị lâu hơn để user đọc được
                );
              } else {
                // Lỗi membership khác (hết hạn, chưa mua)
                messageApi.error(errorData.message || "Bạn cần có membership hợp lệ để đăng accommodation!");
              }
            } else {
              // Lỗi khác
              messageApi.error("Có lỗi xảy ra khi thêm accommodation!");
            }
          }
        }}

        okText="Add"
        cancelText="Cancel"
      >
        <div className="modal-form">
          <label>Upload Images:</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) =>
              setNewAccommodation({
                ...newAccommodation,
                files: Array.from(e.target.files),
              })
            }
          />

          <label>Title:</label>
          <input
            type="text"
            value={newAccommodation.title}
            onChange={(e) =>
              setNewAccommodation({ ...newAccommodation, title: e.target.value })
            }
          />

          <label>District:</label>
          <select
            value={newAccommodation.location.district}
            onChange={(e) =>
              setNewAccommodation({
                ...newAccommodation,
                location: {
                  ...newAccommodation.location,
                  district: e.target.value,
                },
              })
            }
          >
            <option value="">-- Select District --</option>
            <option value="Hải Châu">Hải Châu</option>
            <option value="Thanh Khê">Thanh Khê</option>
            <option value="Ngũ Hành Sơn">Ngũ Hành Sơn</option>
            <option value="Sơn Trà">Sơn Trà</option>
            <option value="Liên Chiểu">Liên Chiểu</option>
            <option value="Cẩm Lệ">Cẩm Lệ</option>
            <option value="Hòa Vang">Hòa Vang</option>
          </select>

          <label>Street:</label>
          <input
            type="text"
            value={newAccommodation.location.street}
            onChange={(e) =>
              setNewAccommodation({
                ...newAccommodation,
                location: {
                  ...newAccommodation.location,
                  street: e.target.value,
                },
              })
            }
          />

          <label>Address Detail:</label>
          <input
            type="text"
            value={newAccommodation.location.addressDetail}
            onChange={(e) =>
              setNewAccommodation({
                ...newAccommodation,
                location: {
                  ...newAccommodation.location,
                  addressDetail: e.target.value,
                },
              })
            }
          />

          <label>Price (VND):</label>
          <input
            type="number"
            value={newAccommodation.price}
            onChange={(e) =>
              setNewAccommodation({
                ...newAccommodation,
                price: e.target.value,
              })
            }
          />

          <label>Description:</label>
          <textarea
            value={newAccommodation.description}
            onChange={(e) =>
              setNewAccommodation({
                ...newAccommodation,
                description: e.target.value,
              })
            }
          />

          <label>Status:</label>
          <select
            value={newAccommodation.status}
            onChange={(e) =>
              setNewAccommodation({ ...newAccommodation, status: e.target.value })
            }
          >
            <option value="Available">Available</option>
            <option value="Unavailable">Unavailable</option>
          </select>
        </div>
      </Modal>



      {/* VIEW MODAL */}
      <Modal
        title="Accommodation Details"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        {selectedRow && (
          <div>
            {selectedRow.photos && selectedRow.photos.length > 0 && (
              <Carousel
                autoplay
                arrows
                prevArrow={<AiOutlineLeft className="custom-arrow arrow-left" />}
                nextArrow={<AiOutlineRight className="custom-arrow arrow-right" />}
              >
                {selectedRow.photos.map((photo, index) => (
                  <div key={index}>
                    <img
                      src={`http://localhost:5000${photo}`}
                      alt={`photo-${index}`}
                      style={{
                        width: "100%",
                        maxHeight: "300px",
                        objectFit: "cover",
                        borderRadius: "8px"
                      }}
                    />
                  </div>
                ))}
              </Carousel>
            )}
            <p><strong>Title:</strong> {selectedRow.title}</p>
            <p><strong>Street:</strong> {selectedRow.location?.street}</p>
            <p><strong>District:</strong> {selectedRow.location?.district}</p>
            <p><strong>Address Detail:</strong> {selectedRow.location?.addressDetail}</p>
            <p><strong>Latitude:</strong> {selectedRow.location?.latitude}</p>
            <p><strong>Longitude:</strong> {selectedRow.location?.longitude}</p>
            <p><strong>Price:</strong> {selectedRow.price.toLocaleString()} VND</p>
            <p><strong>Status:</strong> {selectedRow.status}</p>
            {selectedRow.status === "Booked" && selectedRow.customerId && (
              <div style={{ 
                backgroundColor: "#f0f0f0", 
                padding: "10px", 
                borderRadius: "8px", 
                marginTop: "10px",
                border: "1px solid #d9d9d9"
              }}>
                <p style={{ margin: "5px 0", fontWeight: "bold", color: "#004d40" }}>
                  <UserOutlined style={{ marginRight: "8px", fontSize: "16px" }} />
                  Thông tin khách hàng đã đặt:
                </p>
                <p style={{ margin: "5px 0" }}>
                  <strong>Tên:</strong> {selectedRow.customerId.name}
                </p>
                <p style={{ margin: "5px 0" }}>
                  <strong>Email:</strong> {selectedRow.customerId.email}
                </p>
                {selectedRow.customerId.phone && (
                  <p style={{ margin: "5px 0" }}>
                    <strong>Số điện thoại:</strong> {selectedRow.customerId.phone}
                  </p>
                )}
              </div>
            )}
            <p><strong>Description:</strong> {selectedRow.description}</p>
          </div>
        )}
      </Modal>



      {/* UPDATE MODAL */}
      <Modal
        title="Update Accommodation"
        open={isUpdateModalVisible}
        onCancel={() => setIsUpdateModalVisible(false)}
        onOk={async () => {
          try {
            const token = await getValidAccessToken();

            // 📍 Gọi OpenCage để cập nhật lại tọa độ nếu user sửa địa chỉ
            const fullAddress = `${editingRow.location.street}, ${editingRow.location.district}, Đà Nẵng, Việt Nam`;
            const coords = await geocodeWithOpenCage(fullAddress);

            if (!coords) {
              return messageApi.error("Không thể lấy tọa độ từ địa chỉ đã nhập.");
            }

            const updatedLocation = {
              ...editingRow.location,
              latitude: coords.latitude,
              longitude: coords.longitude,
            };

            const formData = new FormData();
            formData.append("title", editingRow.title);
            formData.append("description", editingRow.description);
            formData.append("price", editingRow.price);
            formData.append("status", editingRow.status);
            formData.append("location", JSON.stringify(updatedLocation));

            editingRow.files.forEach((file) => {
              formData.append("photos", file);
            });

            const res = await axios.put(
              `http://localhost:5000/api/accommodation/${editingRow._id}`,
              formData,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "multipart/form-data",
                },
              }
            );

            const updatedItem = res.data.data;
            const updatedList = data.map((item) =>
              item._id === updatedItem._id ? { ...updatedItem, key: updatedItem._id } : item
            );
            setData(updatedList);
            setIsUpdateModalVisible(false);
            // thông báo thành công bằng message
            messageApi.success("Accommodation updated successfully!");
          } catch (error) {
            console.error("Error updating accommodation:", error);
            messageApi.error("Có lỗi xảy ra khi cập nhật accommodation!");
          }
        }}
        okText="Save"
        cancelText="Cancel"
      >
        {editingRow && (
          <div className="modal-form">
            <label>Upload New Images:</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) =>
                setEditingRow({
                  ...editingRow,
                  files: Array.from(e.target.files),
                })
              }
            />

            <label>Title:</label>
            <input
              type="text"
              value={editingRow.title}
              onChange={(e) =>
                setEditingRow({ ...editingRow, title: e.target.value })
              }
            />

            <label>District:</label>
            <select
              value={editingRow.location?.district}
              onChange={(e) =>
                setEditingRow((prev) => ({
                  ...prev,
                  location: {
                    ...prev.location,
                    district: e.target.value,
                  },
                }))
              }
            >
              <option value="">-- Select District --</option>
              {districtOptions.map((district) => (
                <option key={district} value={district}>{district}</option>
              ))}
            </select>

            <label>Street:</label>
            <input
              type="text"
              value={editingRow.location?.street}
              onChange={(e) =>
                setEditingRow((prev) => ({
                  ...prev,
                  location: {
                    ...prev.location,
                    street: e.target.value,
                  },
                }))
              }
            />

            <label>Address Detail:</label>
            <input
              type="text"
              value={editingRow.location?.addressDetail}
              onChange={(e) =>
                setEditingRow((prev) => ({
                  ...prev,
                  location: {
                    ...prev.location,
                    addressDetail: e.target.value,
                  },
                }))
              }
            />

            <label>Price (VND):</label>
            <input
              type="number"
              value={editingRow.price}
              onChange={(e) =>
                setEditingRow({ ...editingRow, price: Number(e.target.value) })
              }
            />

            <label>Description:</label>
            <textarea
              value={editingRow.description}
              onChange={(e) =>
                setEditingRow({ ...editingRow, description: e.target.value })
              }
            />

            <label>Status:</label>
            <select
              value={editingRow.status}
              onChange={(e) =>
                setEditingRow({ ...editingRow, status: e.target.value })
              }
            >
              <option value="Available">Available</option>
              <option value="Unavailable">Unavailable</option>
            </select>
          </div>
        )}
      </Modal>


      </div>
    </>
  );
};

export default Accommodation;