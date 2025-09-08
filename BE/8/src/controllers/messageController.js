const Message = require('../models/Message');

// GET /api/profile/messages
exports.getUserMessages = async (req, res, next) => {
  try {
    const messages = await Message.find({ senderId: req.user.id }).sort({ time: -1 });
    res.json(messages);
  } catch (err) {
    next(err);
  }
};

// POST /api/profile/messages
exports.sendMessage = async (req, res, next) => {
  try {
    const newMessage = new Message({
      senderId: req.user.id,
      chatId: req.body.chatId,
      content: req.body.content,
      time: new Date()
    });
    const saved = await newMessage.save();
    res.status(201).json(saved);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/profile/messages/:id
exports.deleteMessage = async (req, res, next) => {
  try {
    const deleted = await Message.findOneAndDelete({
      _id: req.params.id,
      senderId: req.user.id
    });
    if (!deleted) return res.status(404).json({ message: 'Message not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    next(err);
  }
};
