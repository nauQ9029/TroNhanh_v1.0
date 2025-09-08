import React, { useState } from 'react';
import './cancellation.css';

const mockRequests = [
  {
    id: 1,
    customerName: 'Nguyễn Văn A',
    bookingCode: 'PT123456',
    roomName: 'Phòng trọ khép kín - Tầng 1',
    reason: 'Chuyển công tác đột xuất',
    status: 'Pending'
  },
  {
    id: 2,
    customerName: 'Trần Thị B',
    bookingCode: 'PT789012',
    roomName: 'Phòng trọ có gác - Tầng 2',
    reason: 'Tìm được chỗ gần hơn',
    status: 'Pending'
  },
  {
    id: 3,
    customerName: 'Lê Thị C',
    bookingCode: 'PT345678',
    roomName: 'Phòng trọ giá rẻ - Tầng 3',
    reason: 'Thay đổi kế hoạch học tập',
    status: 'Pending'
  },
  {
    id: 4,
    customerName: 'Phạm Văn D',
    bookingCode: 'PT456789',
    roomName: 'Phòng trọ gần chợ - Tầng trệt',
    reason: 'Đặt nhầm ngày dọn vào',
    status: 'Pending'
  },
  {
    id: 5,
    customerName: 'Đặng Thị E',
    bookingCode: 'PT567890',
    roomName: 'Phòng trọ cho sinh viên - Tầng 2',
    reason: 'Không đủ tài chính thuê phòng',
    status: 'Pending'
  },
  {
    id: 6,
    customerName: 'Hoàng Văn F',
    bookingCode: 'PT678901',
    roomName: 'Phòng trọ có máy lạnh - Tầng 1',
    reason: 'Thấy phòng xa trường học',
    status: 'Pending'
  },
  {
    id: 7,
    customerName: 'Võ Thị G',
    bookingCode: 'PT789013',
    roomName: 'Phòng trọ full nội thất - Tầng 3',
    reason: 'Bạn cùng thuê huỷ',
    status: 'Pending'
  },
];


const Cancellation = () => {
  const [requests, setRequests] = useState(mockRequests);

  const handleDecision = (id, action) => {
    const updated = requests.map((req) =>
      req.id === id
        ? { ...req, status: action === 'approve' ? 'Approved' : 'Rejected' }
        : req
    );
    setRequests(updated);
    alert(`Request ${id} has been ${action === 'approve' ? 'approved' : 'rejected'}.`);
  };

  return (
    <div className="cancellation-container">
      <h2>Cancellation Requests</h2>
      {requests.length === 0 ? (
        <p>No pending requests.</p>
      ) : (
         <div className="table-responsive-wrapper"> 
        <table className="cancellation-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Booking Code</th>
              <th>Room</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req.id}>
                <td>{req.id}</td>
                <td>{req.customerName}</td>
                <td>{req.bookingCode}</td>
                <td>{req.roomName}</td>
                <td>{req.reason}</td>
                <td>
                  <span className={`status ${req.status.toLowerCase()}`}>
                    {req.status}
                  </span>
                </td>
                <td>
  {req.status === 'Pending' ? (
    <div className="action-buttons">
      <button className="approve-btn" onClick={() => handleDecision(req.id, 'approve')}>
        Approve
      </button>
      <button className="reject-btn" onClick={() => handleDecision(req.id, 'reject')}>
        Reject
      </button>
    </div>
  ) : (
    <span className="no-action">—</span>
  )}
</td>

              </tr>
            ))}
          </tbody>
        </table>
         </div>
      )}
    </div>
  );
};

export default Cancellation;
