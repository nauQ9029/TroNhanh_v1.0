// models/RoommatePost.js
const mongoose = require('mongoose');

const roommatePostSchema = new mongoose.Schema({
  accommodationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Accommodation',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  intro: String, // giới thiệu bản thân
  genderPreference: { type: String, enum: ['male', 'female', 'other'], default: 'Any' },
  habits: [String], // ví dụ: ["Clean", "Quiet", "Smoker"]
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('RoommatePost', roommatePostSchema);
