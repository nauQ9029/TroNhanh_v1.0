// file TroNhanh_BE/src/controllers/paymentController.js
const Payment = require('../models/Payment');
const MembershipPackage = require('../models/MembershipPackage');

exports.getCurrentMembershipOfUser = async (req, res) => {
    try {
        const userId = req.params.userId;

        const latestPayment = await Payment.findOne({
            ownerId: userId,
            status: 'Paid'
        }).sort({ createAt: -1 }).populate('membershipPackageId');

        if (!latestPayment) {
            return res.status(200).json({ package: null });
        }

        const duration = latestPayment.membershipPackageId?.duration || 0;
        const createdAt = latestPayment.createAt;
        const expiredAt = new Date(createdAt.getTime() + duration * 24 * 60 * 60 * 1000);

        return res.status(200).json({
            package: latestPayment.membershipPackageId,
            expiredAt
        });
    } catch (err) {
        console.error('❌ Lỗi khi lấy membership hiện tại:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};