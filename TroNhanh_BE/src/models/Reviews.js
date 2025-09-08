const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema(
  {
    accommodationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Accommodation',
      required: true
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    user: {
      _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
      name: String,
      avatar: String,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5, // Đổi từ 10 thành 5
    },
    comment: {
      type: String,
      required: true,
    },
    purpose: {
      type: String,
    },
    weeksAgo: {
      type: Number,
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }
  // { _id: false } // avoid nested review _id
);

module.exports = mongoose.model('Review', reviewSchema);
