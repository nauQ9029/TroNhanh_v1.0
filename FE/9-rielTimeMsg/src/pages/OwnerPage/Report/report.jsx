import React, { useState } from "react";
import "./report.css";
import { Table, Button, Select, Modal, message } from "antd";
const { Option } = Select;

const Report = () => {
  const [reportList, setReportList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [reportForm, setReportForm] = useState({
    type: "",
    content: "",
  });

  const handleChange = (field, value) => {
    setReportForm({ ...reportForm, [field]: value });
  };

  const handleSubmit = () => {
    const { type, content } = reportForm;

    if (!type || content.trim().length < 10) {
    alert("Vui lòng chọn loại report và nội dung tối thiểu 10 ký tự."); // 👈 dùng alert thay vì message.error
    return;
  }


    const newReport = {
      key: reportList.length + 1,
      type,
      content,
      status: "Pending",
      submittedAt: new Date().toLocaleString(),
    };

    setReportList([...reportList, newReport]);
    setReportForm({ type: "", content: "" });
    setIsModalVisible(false);

    // ✅ Hiển thị thông báo thành công
    alert("Report đã được gửi tới admin!"); // 👈 dùng alert thành công

  };

  const columns = [
    {
      title: "Type",
      dataIndex: "type",
    },
    {
      title: "Content",
      dataIndex: "content",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => (
        <span className={`status-tag ${status.toLowerCase()}`}>{status}</span>
      ),
    },
    {
      title: "Submitted At",
      dataIndex: "submittedAt",
    },
  ];

  return (
    <div className="report-wrapper">
      <div className="report-header">
        <h2>Report to Admin</h2>
        <Button className="open-modal-btn" onClick={() => setIsModalVisible(true)}>
          Create Report
        </Button>
      </div>

      <Table className="report-table" dataSource={reportList} columns={columns} pagination={false} />

      <Modal
        title="New Report"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleSubmit}
        okText="Submit"
        cancelText="Cancel"
      >
        <div className="report-form">
          <label>Type:</label>
          <Select
            value={reportForm.type}
            onChange={(value) => handleChange("type", value)}
            placeholder="Select type"
            style={{ width: "100%" }}
          >
            <Option value="Fake Booking">Fake Booking</Option>
            <Option value="Abusive Renter">Abusive Renter</Option>
            <Option value="System Issue">System Issue</Option>
            <Option value="Spam/Scam">Spam / Scam</Option>
            <Option value="Violation of Terms">Violation of Terms</Option>
            <Option value="Technical Error">Technical Error</Option>
            <Option value="Other">Other</Option>
          </Select>

          <label>Content:</label>
          <textarea
            rows={4}
            placeholder="Enter your report content..."
            value={reportForm.content}
            onChange={(e) => handleChange("content", e.target.value)}
          />
        </div>
      </Modal>
    </div>
  );
};

export default Report;
