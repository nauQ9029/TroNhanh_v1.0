// file TroNhanh_BE/src/routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const { createPaymentUrl, vnpayReturn } = require('../controllers/vnpayController');
const { getCurrentMembershipOfUser } = require('../controllers/paymentController');

router.post('/create', createPaymentUrl); // POST /api/payment/create
router.get('/vnpay_return', vnpayReturn);
router.get('/current/:userId', getCurrentMembershipOfUser); // ✅ Thêm dòng này

module.exports = router;