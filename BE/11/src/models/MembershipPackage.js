// file: TroNhanh_BE/src/models/MembershipPackage.js
const mongoose = require('mongoose');

const membershipPackageSchema = new mongoose.Schema({
  packageName: {
    type: String,
    required: true,
    unique: true, // BR-CMP-01: Unique Package Name
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: [0.01, 'Price must be greater than 0'], // BR-CMP-02: Valid Price Range
    max: [999999, 'Price exceeds maximum limit']
  },
  duration: {
    type: Number, // Duration in days
    required: true,
    min: [1, 'Duration must be at least 1 day']
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  postsAllowed: {
    type: Number,
    required: true,
    min: [1, 'Posts allowed must be at least 1']
  },
  features: [{
    type: String,
    trim: true
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for better query performance
membershipPackageSchema.index({ packageName: 1 });
membershipPackageSchema.index({ isActive: 1 });
membershipPackageSchema.index({ isDeleted: 1 });

module.exports = mongoose.model('MembershipPackage', membershipPackageSchema);