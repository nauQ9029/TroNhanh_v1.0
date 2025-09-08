const express = require("express");
const router = express.Router();
const accommodationController = require("../controllers/accommodationController");
const uploadAccommodation = require("../middleware/accommodationUpload");
const searchAc = require("../controllers/searchAccomodation");
const authMiddleware = require('../middleware/authMiddleWare');



router.get("/", accommodationController.getAllAccommodations);
router.get("/searchAccomodation", searchAc.SearchAccomodationNoUsingAI);
router.get("/:id", accommodationController.getAccommodationById);



router.post(
  "/:id/reviews",
  authMiddleware,
  accommodationController.submitReview
);

router.put(
  "/:id/reviews/:reviewId",
  authMiddleware,
  accommodationController.editReview
);

router.delete(
  "/:id/reviews/:reviewId",
  authMiddleware,
  accommodationController.deleteReview
);
router.delete("/:id", accommodationController.deleteAccommodation);


router.post("/", uploadAccommodation.array("photos", 10), accommodationController.createAccommodation);
router.put("/:id", uploadAccommodation.array("photos", 10), accommodationController.updateAccommodation);

// Owner rating routes
router.get("/owner/ratings", authMiddleware, accommodationController.getOwnerAccommodationsWithRatings);
router.get("/owner/:id/ratings", authMiddleware, accommodationController.getAccommodationRatingsForOwner);

// Owner statistics routes
router.get("/owner/statistics", authMiddleware, accommodationController.getOwnerStatistics);
router.get("/owner/monthly-revenue", authMiddleware, accommodationController.getOwnerMonthlyRevenue);
router.get("/owner/recent-bookings", authMiddleware, accommodationController.getOwnerRecentBookings);
router.get("/owner/top-accommodations", authMiddleware, accommodationController.getOwnerTopAccommodations);
router.get("/owner/current-membership", authMiddleware, accommodationController.getOwnerCurrentMembership);
router.get("/owner/membership-info", authMiddleware, accommodationController.getOwnerMembershipInfo);

module.exports = router;