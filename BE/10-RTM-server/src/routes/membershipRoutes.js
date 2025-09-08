// file: TroNhanh_BE/src/routes/membershipRoutes.js
const express = require('express');
const router = express.Router();

const { getPublicMembershipPackages } = require('../controllers/AdminController/MembershipController');

// route to get public membership packages
router.get('/', (req, res) => {
    // console.log("🔥 Route /api/membership-packages hit");
    getPublicMembershipPackages(req, res);
});

module.exports = router;