const Message = require("../models/Message");

// send a message (Customer & Owner)
exports.sendMessage = async (req, res) => {
  const senderId = req.user.id; // secured from token
  const { receiverId, text, accommodationId } = req.body;
  const receiverIdString =
    typeof receiverId === "object" ? receiverId._id : receiverId;

  console.log("[MESSAGE] sendMessage request:", {
    senderId,
    receiverId,
    accommodationId,
    text: text ? text.substring(0, 50) + "..." : "No text",
    userFromToken: req.user,
  });

  if (!receiverId || !text || !accommodationId) {
    console.log("[MESSAGE] Missing required fields");
    return res.status(400).json({
      error: "Missing required fields: receiverId, text, accommodationId",
    });
  }

  try {
    const messageData = {
      senderId,
      receiverId,
      text: text.trim(),
      accommodationId,
    };

    console.log("[MESSAGE] Creating message with data:", messageData);

    const msg = await Message.create(messageData);

    console.log("[MESSAGE] Message created successfully:", {
      id: msg._id,
      senderId: msg.senderId,
      receiverId: msg.receiverId,
      accommodationId: msg.accommodationId,
      createdAt: msg.createdAt,
    });

    // Populate sender info for response
    await msg.populate("senderId", "name");
    await msg.populate("receiverId", "name email");

    const messagePayload = {
      _id: msg._id,
      senderId: {
        _id: msg.senderId._id,
        name: msg.senderId.name,
        email: msg.senderId.email,
      },
      receiverId: {
        _id: msg.receiverId._id,
        name: msg.receiverId.name,
        email: msg.receiverId.email,
      },
      accommodationId: msg.accommodationId,
      text: msg.text,
      createdAt: msg.createdAt,
    };

    // Emit over socket
    const io = req.app.get("io");
    const onlineUsers = req.app.get("onlineUsers");
    const userSockets = req.app.get("userSockets");

    const roomName = `user_${receiverIdString}`;
    io.to(roomName).emit("message-receive", messagePayload);

    const receiverSocket = onlineUsers.get(receiverIdString);
    if (receiverSocket && io.sockets.sockets.get(receiverSocket)) {
      io.to(receiverSocket).emit("message-receive", messagePayload);
    }

    if (userSockets.has(receiverIdString)) {
      userSockets.get(receiverIdString).forEach((socketId) => {
        if (io.sockets.sockets.get(socketId)) {
          io.to(socketId).emit("message-receive", messagePayload);
        }
      });
    }

    res.status(201).json(msg);
  } catch (err) {
    console.error("[MESSAGE] Send message error:", err);
    res.status(500).json({
      error: "Failed to send message",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

// get messages for a specific accommodation (customer chat)
exports.getMessagesByAccommodation = async (req, res) => {
  const { accommodationId } = req.params;
  const userId = req.user.id;

  console.log("[MESSAGE] getMessagesByAccommodation:", {
    accommodationId,
    userId,
  });

  try {
    const msgs = await Message.find({
      accommodationId,
      $or: [{ senderId: userId }, { receiverId: userId }],
    })
      .sort({ createdAt: 1 }) // sort oldest -> newest
      .populate("senderId", "name")
      .populate("receiverId", "name");

    console.log(
      `[MESSAGE] Found ${msgs.length} messages for accommodation ${accommodationId}`
    );

    res.json(msgs);
  } catch (err) {
    console.error("[MESSAGE] Error fetching messages:", err);
    res.status(500).json({
      error: "Failed to fetch messages",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

// owner inbox: grouped by accommodation + customer
exports.getOwnerInbox = async (req, res) => {
  const ownerId = req.user.id;

  console.log("[MESSAGE] getOwnerInbox for owner:", ownerId);

  try {
    // Get all messages where owner is either sender or receiver
    const msgs = await Message.find({
      $or: [{ senderId: ownerId }, { receiverId: ownerId }],
    })
      .populate("senderId", "name")
      .populate("receiverId", "name")
      .populate("accommodationId", "title")
      .sort({ createdAt: -1 });

    console.log(`[MESSAGE] Found ${msgs.length} messages for owner inbox`);

    const conversationMap = {};

    msgs.forEach((msg) => {
      // Determine who is the customer (not the owner)
      const isOwnerSender = msg.senderId._id.toString() === ownerId;
      const customer = isOwnerSender ? msg.receiverId : msg.senderId;

      const key = `${msg.accommodationId._id}_${customer._id}`;

      if (
        !conversationMap[key] ||
        new Date(msg.createdAt) > new Date(conversationMap[key].lastUpdated)
      ) {
        conversationMap[key] = {
          _id: key,
          accommodation: msg.accommodationId,
          customer: customer,
          lastMessage: msg.text,
          lastUpdated: msg.createdAt,
          unreadCount: isOwnerSender ? 0 : 1, // Simplified unread logic
        };
      }
    });

    const sortedConversations = Object.values(conversationMap).sort(
      (a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated)
    );

    console.log(
      `[MESSAGE] Returning ${sortedConversations.length} conversations`
    );

    res.json(sortedConversations);
  } catch (err) {
    console.error("[MESSAGE] Owner inbox error:", err);
    res.status(500).json({
      error: "Failed to load inbox",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

exports.getMessagesByConversation = async (req, res) => {
  const userId = req.user.id;
  const { conversationKey } = req.params;

  console.log("[MESSAGE] getMessagesByConversation:", {
    conversationKey,
    userId,
  });

  try {
    const [accommodationId, customerId] = conversationKey.split("_");

    const messages = await Message.find({
      accommodationId,
      $or: [
        { senderId: userId, receiverId: customerId },
        { senderId: customerId, receiverId: userId },
      ],
    })
      .sort({ createdAt: 1 })
      .populate("senderId", "name")
      .populate("receiverId", "name");

    console.log(
      `[MESSAGE] Found ${messages.length} messages for conversation ${conversationKey}`
    );

    res.json(messages);
  } catch (err) {
    console.error("[MESSAGE] Failed to fetch conversation messages:", err);
    res.status(500).json({
      error: "Failed to fetch messages",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};
