const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: String,
    rating: { type: Number, required: true },
    comment: { type: String },
    weeksAgo: Number,
    purpose: String,
  },
  { timestamps: true }
);

const propertySchema = new mongoose.Schema(
  {
    city: String,
    title: String,
    image: String,
    roomDetails: String,
    available: String,
    price: Number,
    maxGuest: Number,
    description: String,
    summary: [String],
    galleryImages: [String],
    // amenities: [
    //   {
    //     name: String,
    //     icon: String,
    //     note: String,
    //   },
    // ],
    mapPosition: [Number], // [kinh do, vi do]
    createdAt: {
      type: Date,
      default: Date.now,
    },
    reviews: [
      {
        name: String,
        rating: Number,
        comment: String,
        purpose: String,
        weeksAgo: Number,
      },
    ],
  },
  { strict: true }
);

module.exports = mongoose.model("Property", propertySchema, "Property");
