const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const profileController = require("../controllers/profileController");
const favoriteController = require("../controllers/favoriteController");
const messageController = require("../controllers/messageController");
const reportController = require("../controllers/reportController");
router.use(authMiddleware);

// ===== Personal Info =====
router.get("/personal-info", profileController.getProfileInfo);

// ===== Favourites =====
router.get("/favorites", favoriteController.getFavorite);

// ===== Messages =====
// router.get('/messages', messageController.getUserMessages);
// router.post('/messages', messageController.sendMessage);
// router.delete('/messages/:id', messageController.deleteMessage);
// OWNER
router.get("/owner-inbox", authMiddleware, messageController.getOwnerInbox);

// CUSTOMER and OWNER
router.post("/send", authMiddleware, messageController.sendMessage);
router.get(
  "/:accommodationId",
  authMiddleware,
  messageController.getMessagesByAccommodation
);

// ===== MyReports =====

router.get("/my-reports", reportController.getMyReports);

const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: "./uploads/avatars",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

router.put(
  "/personal-info",
  upload.single("avatar"),
  profileController.updateUserInfo
);

module.exports = router;
