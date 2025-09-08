// file TroNhanh_BE/src/models/Payment.js
const mongoose = require('mongoose')

const PaymentSchema = new mongoose.Schema({
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    membershipPackageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MembershipPackage',
        require: true
    },
    vnpayTransactionId: {
        type: String,
        require: true
    },
    title: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    amount: {
        type: Number,
        min: 0
    },
    status: {
        type: String,
        enum: ['Pending', 'Paid', 'Failed', 'Cancelled', 'Refunded'],
        default: 'Pending'
    },
    createAt: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('Payment', PaymentSchema);