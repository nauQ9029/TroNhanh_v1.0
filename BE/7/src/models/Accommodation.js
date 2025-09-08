const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user: {
      _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
      name: String,
      avatar: String,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
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
  }
  // { _id: false } // avoid nested review _id
);

const accommodationSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    city: { type: String, required: true },
    title: { type: String, required: true, trim: true },
    roomDetails: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    maxGuest: { type: Number, required: true },
    description: { type: String, required: true },
    summary: { type: [String], required: true },
    galleryImages: { type: [String], default: [] },
    photos: { type: [String], default: [] },
    location: {
      district: { type: String },
      street: { type: String },
      addressDetail: { type: String },
      latitude: { type: Number },
      longitude: { type: Number },
    },
    mapPosition: {
      type: [Number],
      validate: {
        validator: (arr) => arr.length === 2,
        message: "mapPosition must be [longitude, latitude]",
      },
    },
    status: {
      type: String,
      enum: ["Available", "Unavailable"],
      default: "Available",
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    approvedStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    approvedAt: { type: Date },
    rejectedReason: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    reviews: [reviewSchema],
  },
  { strict: true }
);

accommodationSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model(
  "accommodations",
  accommodationSchema,
  "accommodations"
);
