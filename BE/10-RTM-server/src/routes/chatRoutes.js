const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");

router.post("/get-or-create", chatController.getOrCreateChat);
router.get("/:chatId/messages", chatController.getMessages);
router.post("/send", chatController.sendMessage);

module.exports = router;
