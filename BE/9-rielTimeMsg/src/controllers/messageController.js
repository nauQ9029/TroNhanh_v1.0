const Message = require("../models/Message");

// GET /api/profile/messages
// exports.getUserMessages = async (req, res, next) => {
//   try {
//     const messages = await Message.find({ senderId: req.user.id }).sort({
//       time: -1,
//     });
//     res.json(messages);
//   } catch (err) {
//     next(err);
//   }
// };

// // POST /api/profile/messages
// exports.sendMessage = async (req, res, next) => {
//   try {
//     const newMessage = new Message({
//       senderId: req.user.id,
//       chatId: req.body.chatId,
//       content: req.body.content,
//       time: new Date(),
//     });
//     const saved = await newMessage.save();
//     res.status(201).json(saved);
//   } catch (err) {
//     next(err);
//   }
// };

// // DELETE /api/profile/messages/:id
// exports.deleteMessage = async (req, res, next) => {
//   try {
//     const deleted = await Message.findOneAndDelete({
//       _id: req.params.id,
//       senderId: req.user.id,
//     });
//     if (!deleted) return res.status(404).json({ message: "Message not found" });
//     res.json({ message: "Deleted successfully" });
//   } catch (err) {
//     next(err);
//   }
// };

// send a message (Customer & Owner)
exports.sendMessage = async (req, res) => {
  const senderId = req.user.id; // secured from token
  const { receiverId, text, accommodationId } = req.body;

  console.log(" >>>[DEBUG] sendMessage body:", req.body);
  console.log(" >>>[DEBUG] senderId:", senderId);
  console.log(" >>>[DEBUG] receiverId:", receiverId);
  console.log(" >>>[DEBUG] accommodationId:", accommodationId);

  try {
    const msg = await Message.create({
      senderId,
      receiverId,
      text,
      accommodationId,
    });
    res.status(201).json(msg);
  } catch (err) {
    console.error("Send message error:", err);
    res.status(500).json({ error: "Failed to send message" });
  }
};

// get messages for a specific accommodation (customer chat)
exports.getMessagesByAccommodation = async (req, res) => {
  const { accommodationId } = req.params;
  console.log("[DEBUG] Fetch messages for accommodationId:", accommodationId);

  try {
    const msgs = await Message.find({
      accommodationId,
    })
      .sort({ createdAt: 1 }) // sort oldest -> newest
      .populate("senderId", "name")
      .populate("receiverId", "name");

    res.json(msgs);
  } catch (err) {
    console.error(" >>>[ERROR] Fetching messages:", err);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};

// owner inbox: grouped by accommodation + customer
exports.getOwnerInbox = async (req, res) => {
  const ownerId = req.user.id;
  try {
    const msgs = await Message.find({ receiverId: ownerId })
      .populate("senderId", "name")
      .populate("accommodationId", "title createdAt");

    const conversationMap = {};

    msgs.forEach((msg) => {
      const key = `${msg.accommodationId._id}_${msg.senderId._id}`;
      if (!conversationMap[key]) {
        conversationMap[key] = {
          _id: key,
          accommodation: msg.accommodationId,
          customer: msg.senderId,
          lastMessage: msg.text,
          lastUpdated: msg.createdAt,
          unreadCount: 1,
        };
      } else {
        conversationMap[key].unreadCount += 1;
      }
    });

    const sortedConversations = Object.values(conversationMap).sort(
      (a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated)
    );

    res.json(sortedConversations);
  } catch (err) {
    console.error("Owner inbox error:", err);
    res.status(500).json({ error: "Failed to load inbox" });
  }
};

exports.getMessagesByConversation = async (req, res) => {
  const userId = req.user.id;
  const [accommodationId, customerId] = req.params.conversationKey.split("_");

  try {
    const messages = await Message.find({
      accommodationId,
      $or: [
        { senderId: userId, receiverId: customerId },
        { senderId: customerId, receiverId: userId },
      ],
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    console.error("Failed to fetch conversation messages:", err);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};
