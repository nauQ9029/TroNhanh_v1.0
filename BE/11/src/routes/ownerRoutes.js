// file: TroNhanh_BE/src/routes/membershipRoutes.js
const express = require('express');
const router = express.Router();
const { createPaymentUrl, vnpayReturn } = require('../controllers/vnpayController');
const { getPublicMembershipPackages } = require('../controllers/AdminController/MembershipController');
const { getCurrentMembershipOfUser } = require('../controllers/paymentController');

// route to get public membership packages
router.get('/membership-packages', (req, res) => {
    // console.log("🔥 Route /api/membership-packages hit");
    getPublicMembershipPackages(req, res);
});

router.post('/create', createPaymentUrl);
router.get('/vnpay_return', vnpayReturn);
router.get('/current/:userId', getCurrentMembershipOfUser); 

module.exports = router;