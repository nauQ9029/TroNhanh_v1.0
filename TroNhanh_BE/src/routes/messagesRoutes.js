const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const messageController = require("../controllers/messageController");

// OWNER
router.get("/conversations", authMiddleware, messageController.getOwnerInbox);
router.get(
  "/conversation/:conversationKey",
  authMiddleware,
  messageController.getMessagesByConversation
);

// CUSTOMER and OWNER
router.post("/send", authMiddleware, messageController.sendMessage);
router.get(
  "/:accommodationId",
  authMiddleware,
  messageController.getMessagesByAccommodation
);

module.exports = router;
