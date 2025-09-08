// file: TroNhanh_FE/src/pages/OwnerPage/MemberShip/PaymentResult.jsx
import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import './paymentResult.css';

const PaymentResult = () => {
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const success = query.get("success");
    const packageId = query.get("packageId");

    const [status, setStatus] = useState(null);

    useEffect(() => {
        if (success === "true") {
            setStatus("success");
        } else {
            setStatus("fail");
        }
    }, [success]);

    return (
        <main className="ticket-system">
            <div className="top">
                <h1 className="title">
                    {status === "success" ? "Mua gói thành công, hóa đơn của bạn đang được in..." : "Mua gói thất bại, kiểm tra lại đơn hàng."}
                </h1>
                <div className="printer" />
            </div>

            <div className="receipts-wrapper">
                <div className="receipts">
                    <div className={`receipt ${status === "success" ? '' : 'fail'}`}>
                        <h2 className="receipt-title">
                            {status === "success" ? "🧾 HÓA ĐƠN THANH TOÁN" : "❌ THANH TOÁN THẤT BẠI"}
                        </h2>

                        <div className="details">
                            <div className="item">
                                <span>Trạng thái</span>
                                <h3>{status === "success" ? "Thành công " : "Thất bại "}</h3>
                            </div>
                            <div className="item">
                                <span>Mã gói</span>
                                <h3>{packageId || 'Không xác định'}</h3>
                            </div>
                            <div className="item">
                                <span>Thời gian</span>
                                <h3>{new Date().toLocaleString('vi-VN')}</h3>
                            </div>
                            <div className="item">
                                <span>Thành viên</span>
                                <h3>{JSON.parse(localStorage.getItem("user"))?.name || 'Người dùng'}</h3>
                            </div>
                        </div>

                        <div className="footer-btn">
                            <Link to="/owner/membership" className="btn-back">
                                {status === "success" ? " Quay lại Membership" : "Thử lại"}
                            </Link>
                        </div>
                    </div>

                    <div className="receipt qr-code">
                        <img src={`${process.env.PUBLIC_URL}/Logo_TrọNhanh.png`} alt="Logo TrọNhanh" className="qr" />
                        <div className="description">
                            <h2>TroNhanh.vn</h2>
                            <p>Cảm ơn bạn đã nâng cấp gói thành viên TroNhanh</p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default PaymentResult;