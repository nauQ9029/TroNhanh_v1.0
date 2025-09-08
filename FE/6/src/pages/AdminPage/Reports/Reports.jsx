import React, { useState } from "react";
import { message, Form } from "antd";
import dayjs from "dayjs";
import ReportsFilterBar from "./ReportsFilterBar";
import ReportsTable from "./ReportsTable";
import ReportsDetailModal from "./ReportsDetailModal";
import ReportsResolveModal from "./ReportsResolveModal";

const mockComplaints = [
  {
    id: 1,
    user: "Nguyen Van A",
    userId: "U001",
    date: "2025-06-15",
    type: "Payment",
    status: "Pending",
    content: "Payment not received.",
    evidence: "Screenshot attached.",
  },
  {
    id: 2,
    user: "Tran Thi B",
    userId: "U002",
    date: "2025-06-14",
    type: "Rental",
    status: "Resolved",
    content: "Landlord did not return deposit.",
    evidence: "Chat log attached.",
  },
  // ... thêm dữ liệu mẫu
];

const statusColors = {
  Pending: "orange",
  Resolved: "green",
  Rejected: "red",
  Forwarded: "blue",
};
const Reports = () => {
  const [filters, setFilters] = useState({
    search: "",
    type: undefined,
    status: undefined,
    dateRange: [],
  });
  const [modal, setModal] = useState({ open: false, record: null });
  const [resolveModal, setResolveModal] = useState({ open: false, record: null });
  const [form] = Form.useForm();

  // Lọc và sắp xếp
  const filtered = mockComplaints
    .filter(c =>
      (!filters.search ||
        c.user.toLowerCase().includes(filters.search.toLowerCase()) ||
        c.userId.toLowerCase().includes(filters.search.toLowerCase())) &&
      (!filters.type || c.type === filters.type) &&
      (!filters.status || c.status === filters.status) &&
      (filters.dateRange.length !== 2 ||
        (dayjs(c.date).isAfter(filters.dateRange[0].startOf("day").subtract(1, "day")) &&
          dayjs(c.date).isBefore(filters.dateRange[1].endOf("day").add(1, "day"))))
    )
    .sort((a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf());

  const handleResolve = () => {
    form.validateFields().then(values => {
      message.success("Complaint resolved!");
      setResolveModal({ open: false, record: null });
      form.resetFields();
    });
  };

  return (
    <div className="page-container">
      <h1>Complaints Management</h1>
      <ReportsFilterBar filters={filters} setFilters={setFilters} />
      <ReportsTable
        data={filtered}
        onView={record => setModal({ open: true, record })}
        onResolve={record => { setResolveModal({ open: true, record }); form.resetFields(); }}
      />
      <ReportsDetailModal
        open={modal.open}
        onCancel={() => setModal({ open: false, record: null })}
        record={modal.record}
      />
      <ReportsResolveModal
        open={resolveModal.open}
        onCancel={() => setResolveModal({ open: false, record: null })}
        onOk={handleResolve}
        form={form}
      />
    </div>
  );
};

export default Reports;