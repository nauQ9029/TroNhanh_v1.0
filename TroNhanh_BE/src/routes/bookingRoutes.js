const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");

router.post("/", bookingController.createBooking);
router.put("/checkout/:bookingId", bookingController.checkoutBooking);
router.post("/update-accommodation", bookingController.updateAccommodationAfterPayment);
router.get("/user/:userId/accommodation/:accommodationId", bookingController.getUserBookingForAccommodation);
router.get("/user/:userId", bookingController.getUserBookingHistory);
router.get("/accommodation/:accommodationId", bookingController.getBookingsByAccommodation);

module.exports = router;