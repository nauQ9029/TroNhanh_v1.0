const mongoose = require("mongoose");

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
    amenities: [
      {
        name: String,
        icon: String,
        note: String,
      },
    ],
    mapPosition: [Number], // [kinh do, vi do]
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { strict: true }
);

module.exports = mongoose.model("Property", propertySchema, "Property");
