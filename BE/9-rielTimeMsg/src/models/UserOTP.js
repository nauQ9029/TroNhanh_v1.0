const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserOTPSchema = new Schema ({
    userId:String,
    otp:String,
    createdAt: Date,
    expiredAt: Date
});

const UserOTP = mongoose.model("UserOTP",UserOTPSchema);

module.exports = UserOTP;