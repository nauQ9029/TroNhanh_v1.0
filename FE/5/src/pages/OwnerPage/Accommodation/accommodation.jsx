// file OwnerPage/Accommodation/accommodation.jsx
import React, { useState } from "react";
import { Table, Button, Tag, Modal } from "antd";
import "./accommodation.css";
import roomImage0 from "../../../assets/images/Accommodation/room0.png"; // Đường dẫn chính xác
import roomImage1 from "../../../assets/images/Accommodation/room1.png";
import roomImage2 from "../../../assets/images/Accommodation/room2.png";
import roomImage3 from "../../../assets/images/Accommodation/room3.png";

const photoOptions = [
  { label: "Ảnh 1", value: roomImage1 },
  { label: "Ảnh 2", value: roomImage2 },
  { label: "Ảnh 3", value: roomImage3 },
];

const dummyData = [
  {
    key: "1",
    title: "Phòng trọ Quận 1",
    location: "123 Lê Lợi, Quận 1",
    price: 3000000,
    description: "Phòng rộng rãi, có máy lạnh",
    photos: roomImage0,
    status: "Available",
  },
  {
    key: "2",
    title: "Phòng trọ Thủ Đức",
    location: "456 Võ Văn Ngân, Thủ Đức",
    price: 2500000,
    description: "Gần đại học, tiện đi lại",
    photos: roomImage0,
    status: "Unavailable",
  },
  {
    key: "3",
    title: "Phòng trọ Gò Vấp",
    location: "789 Nguyễn Văn Lượng, Gò Vấp",
    price: 2000000,
    description: "Phòng mới, yên tĩnh, gần chợ",
    photos: roomImage0,
    status: "Available",
  },
  {
    key: "4",
    title: "Phòng trọ Bình Thạnh",
    location: "321 Ung Văn Khiêm, Bình Thạnh",
    price: 2800000,
    description: "Phòng đẹp, có bếp riêng",
    photos: roomImage0,
    status: "Unavailable",
  },
  {
    key: "5",
    title: "Phòng trọ Quận 3",
    location: "456 Trường Sa, Quận 3",
    price: 3500000,
    description: "Phòng đầy đủ tiện nghi, gần trung tâm",
    photos: roomImage0,
    status: "Available",
  },
  {
    key: "6",
    title: "Phòng trọ Tân Bình",
    location: "789 Hoàng Văn Thụ, Tân Bình",
    price: 2400000,
    description: "Phòng sạch sẽ, thoáng mát",
    photos: roomImage0,
    status: "Available",
  },
  {
    key: "7",
    title: "Phòng trọ Nhà Bè",
    location: "123 Nguyễn Hữu Thọ, Nhà Bè",
    price: 2200000,
    description: "Phòng giá rẻ, gần khu công nghiệp",
    photos: roomImage0,
    status: "Unavailable",
  },
  {
    key: "8",
    title: "Phòng trọ Củ Chi",
    location: "456 Quốc Lộ 22, Củ Chi",
    price: 1800000,
    description: "Phòng rộng, có sân vườn",
    photos: roomImage0,
    status: "Available",
  },
  {
    key: "9",
    title: "Phòng trọ Phú Nhuận",
    location: "789 Phan Đăng Lưu, Phú Nhuận",
    price: 2600000,
    description: "Phòng hiện đại, gần trường học",
    photos: roomImage0,
    status: "Available",
  },
];

const Accommodation = () => {
  const [data, setData] = useState(dummyData);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [newAccommodation, setNewAccommodation] = useState({
    title: "",
    location: "",
    price: "",
    description: "",
    photos: roomImage1,
    status: "Available",
  });

  const handleView = (record) => {
    setSelectedRow(record);
    setIsModalVisible(true);
  };

  const handleRemove = (key) => {
    const newData = data.filter((item) => item.key !== key);
    setData(newData);
  };

  const handleUpdate = (record) => {
    setEditingRow({ ...record }); // clone record để sửa
    setIsUpdateModalVisible(true);
  };


  const columns = [
    {
      title: "Title",
      dataIndex: "title",
    },
    {
      title: "Location",
      dataIndex: "location",
    },
    {
      title: "Price (VND)",
      dataIndex: "price",
      render: (text) => text.toLocaleString(),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => (
        <Tag color={status === "Available" ? "green" : "volcano"}>{status}</Tag>
      ),
    },
    {
      title: "Actions",
      render: (_, record) => (
        <div className="action-buttons">
          <Button onClick={() => handleView(record)} className="view-btn">View</Button>
          <Button className="update-btn" onClick={() => handleUpdate(record)}>Update</Button>
          <Button className="remove-btn" onClick={() => handleRemove(record.key)}>Remove</Button>
        </div>
      ),
    },
  ];

  return (
    <div className="accommodation-wrapper">
      <div className="header-row">
        <h2>Manage Accommodation</h2>
        <Button className="add-btn" onClick={() => setIsAddModalVisible(true)}>ADD</Button>

      </div>

      <Table className="accommodation-table" columns={columns} dataSource={data} pagination={false} />

      <Modal
        
        title="Add New Accommodation"
        open={isAddModalVisible}
        onCancel={() => setIsAddModalVisible(false)}
        onOk={() => {
          const newEntry = {
            ...newAccommodation,
            key: (data.length + 1).toString(),
            price: Number(newAccommodation.price),
          };
          setData([...data, newEntry]);
          setIsAddModalVisible(false);
          setNewAccommodation({
            title: "",
            location: "",
            price: "",
            description: "",
            photos: roomImage1,
            status: "Available",
          });
        }}
        okText="Add"
        cancelText="Cancel"
      >
        <div className="modal-form">
          <label>Choose photos option:</label>
          <div className="photo-options">
            {photoOptions.map((photo, index) => (
              <img
                key={index}
                src={photo.value}
                alt={`photo-${index}`}
                className={`photo-thumb ${newAccommodation.photos === photo.value ? "selected" : ""}`}
                onClick={() => setNewAccommodation({ ...newAccommodation, photos: photo.value })}
              />
            ))}
          </div>

          <label>Title:</label>
          <input
            type="text"
            value={newAccommodation.title}
            onChange={(e) => setNewAccommodation({ ...newAccommodation, title: e.target.value })}
          />

          <label>Location:</label>
          <input
            type="text"
            value={newAccommodation.location}
            onChange={(e) => setNewAccommodation({ ...newAccommodation, location: e.target.value })}
          />

          <label>Price (VND):</label>
          <input
            type="number"
            value={newAccommodation.price}
            onChange={(e) => setNewAccommodation({ ...newAccommodation, price: e.target.value })}
          />

          <label>Description:</label>
          <textarea
            value={newAccommodation.description}
            onChange={(e) => setNewAccommodation({ ...newAccommodation, description: e.target.value })}
          />

          <label>Status:</label>
          <select
            value={newAccommodation.status}
            onChange={(e) => setNewAccommodation({ ...newAccommodation, status: e.target.value })}
          >
            <option value="Available">Available</option>
            <option value="Unavailable">Unavailable</option>
          </select>
        </div>
      </Modal>



      <Modal
        title="Accommodation Details"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        {selectedRow && (
          <div>
            <img src={selectedRow.photos} alt="room" style={{ width: "100%", borderRadius: 8 }} />
            <p><strong>Title:</strong> {selectedRow.title}</p>
            <p><strong>Location:</strong> {selectedRow.location}</p>
            <p><strong>Price:</strong> {selectedRow.price.toLocaleString()} VND</p>
            <p><strong>Status:</strong> {selectedRow.status}</p>
            <p><strong>Description:</strong> {selectedRow.description}</p>
          </div>
        )}
      </Modal>

      <Modal
        title="Update Accommodation"
        open={isUpdateModalVisible}
        onCancel={() => setIsUpdateModalVisible(false)}
        onOk={() => {
          const updatedData = data.map((item) =>
            item.key === editingRow.key ? editingRow : item
          );
          setData(updatedData);
          setIsUpdateModalVisible(false);
        }}
        okText="Save"
        cancelText="Cancel"
      >
        {editingRow && (
          <div className="modal-form">
            <label>Choose photos option:</label>
            <div className="photo-options">
              {photoOptions.map((photo, index) => (
                <img
                  key={index}
                  src={photo.value}
                  alt={`photo-${index}`}
                  className={`photo-thumb ${editingRow.photos === photo.value ? "selected" : ""
                    }`}
                  onClick={() =>
                    setEditingRow({ ...editingRow, photos: photo.value })
                  }
                />
              ))}
            </div>

            <label>Title:</label>
            <input
              type="text"
              value={editingRow.title}
              onChange={(e) =>
                setEditingRow({ ...editingRow, title: e.target.value })
              }
            />

            <label>Location:</label>
            <input
              type="text"
              value={editingRow.location}
              onChange={(e) =>
                setEditingRow({ ...editingRow, location: e.target.value })
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
  );
};

export default Accommodation;