const mongoose = require('mongoose')

const ReportSchema = new mongoose.Schema({
    reporterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true,
    },
    reportedUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true
    },
    type: {
        type: String,
        require: true
    },
    content: {
        type: String,
        require: true
    },
    status:{
        type: String,
        enum: ['Pending', 'Reviewed', 'Approved', 'Rejected'],
        default: 'Pending'
    },
    createAt:{
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Report', ReportSchema)