// file TroNhanh_BE/src/routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const { createPaymentUrl, vnpayReturn, testUpdateAccommodation } = require('../controllers/vnpayController');
const { getCurrentMembershipOfUser } = require('../controllers/paymentController');

router.post('/create', createPaymentUrl); // POST /api/payment/create
router.get('/vnpay_return', vnpayReturn);
router.post('/test-update', testUpdateAccommodation); // Test route
router.get('/current/:userId', getCurrentMembershipOfUser);

module.exports = router;