const mongoose = require("mongoose");
const BookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  propertyId: { type: mongoose.Schema.Types.ObjectId, ref: "Accommodation" },
  guestInfo: {
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    purpose: String,
    startDate: Date,
    leaseDuration: String,
    guests: Number,
  },
  status: { type: String, default: "pending" }, // pending, paid, cancelled, etc.
  paymentInfo: Object,
  createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model("Booking", BookingSchema);