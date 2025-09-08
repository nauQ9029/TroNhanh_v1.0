const mongoose = require('mongoose')

const PaymentSchema = new mongoose.Schema({
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
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
    createAt:{
        type: Date, 
        default: Date.now
    }
})