const Booking = require("../models/Booking");
const Accommodation = require("../models/Accommodation");

exports.createBooking = async (req, res) => {
  try {
    const { userId, propertyId, guestInfo, startDate, leaseDuration, guests } =
      req.body;

    // Check if the accommodation is approved
    const property = await Accommodation.findOne({
      _id: propertyId,
      approvedStatus: "approved",
    });
    if (!property) {
      return res
        .status(400)
        .json({ message: "Accommodation is not available for booking." });
    }

    const booking = await Booking.create({
      userId,
      propertyId,
      guestInfo,
      status: "pending",
    });
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
