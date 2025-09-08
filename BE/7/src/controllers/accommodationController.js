// file TroNhanh_BE/src/controllers/accomodationController.js
const Accommodation = require("../models/Accommodation");
const User = require("../models/User");

exports.createAccommodation = async (req, res) => {
  try {
    console.log("[DEBUG] req.body:", req.body);

    const { ownerId, title, description, price, status } = req.body;
    const locationRaw = req.body.location || "{}";

    let location;
    try {
      location = JSON.parse(locationRaw);
    } catch (e) {
      return res.status(400).json({ message: "Invalid location format" });
    }

    // ✅ Để nguyên full object như FE gửi
    console.log("[DEBUG] Location parsed:", location);

    const photoPaths =
      req.files?.map((file) => `/uploads/accommodation/${file.filename}`) || [];

    const newAccommodation = new Accommodation({
      ownerId,
      title,
      description,
      price,
      status,
      location,
      photos: photoPaths,
    });

    await newAccommodation.save();

    res.status(201).json({
      message: "Accommodation created successfully",
      data: newAccommodation,
    });
  } catch (err) {
    console.error("[CREATE ERROR]", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateAccommodation = async (req, res) => {
  try {
    console.log("[DEBUG] req.files:", req.files);

    const { title, description, price, status } = req.body;
    const location = JSON.parse(req.body.location || "{}");
    const photoPaths =
      req.files?.map((file) => `/uploads/accommodation/${file.filename}`) || [];

    const updateData = {
      title,
      description,
      price,
      status,
      location,
      updatedAt: Date.now(),
    };

    if (photoPaths.length > 0) {
      updateData.photos = photoPaths;
    }

    const updated = await Accommodation.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Accommodation not found" });
    }

    res.status(200).json({
      message: "Accommodation updated successfully",
      data: updated,
    });
  } catch (err) {
    console.error("[UPDATE ERROR]", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllAccommodations = async (req, res) => {
  try {
    const { ownerId } = req.query;
    console.log("[DEBUG] Received ownerId query:", ownerId);

    const filter = ownerId ? { ownerId } : {};

    const accommodations = await Accommodation.find(filter).populate(
      "ownerId",
      "name email"
    );

    res.status(200).json(accommodations);
  } catch (err) {
    console.error("[GET ALL ERROR]", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAccommodationById = async (req, res) => {
  try {
    const acc = await Accommodation.findById(req.params.id).populate(
      "ownerId",
      "name email"
    );
    if (!acc)
      return res.status(404).json({ message: "Accommodation not found" });
    res.status(200).json(acc);
  } catch (err) {
    console.error("[GET BY ID ERROR]", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteAccommodation = async (req, res) => {
  try {
    const deleted = await Accommodation.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Accommodation not found" });

    res.status(200).json({ message: "Accommodation deleted successfully" });
  } catch (err) {
    console.error("[DELETE ERROR]", err);
    res.status(500).json({ message: "Server error" });
  }
};

// add a review to a accommodation
exports.submitReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment, purpose } = req.body;

    if (!rating || !comment || !purpose) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const accommodation = await Accommodation.findById(id);
    if (!accommodation) {
      return res.status(404).json({ message: "Accommodation not found" });
    }

    const user = await User.findById(req.user.id); // set in auth middleware

    // create review object
    const review = {
      user: {
        _id: user._id,
        name: user.name,
        avatar: user.avatar || null,
      },
      rating,
      comment,
      purpose,
      weeksAgo: 0,
    };

    accommodation.reviews.unshift(review); // add to beginning
    await accommodation.save();

    console.log("[submitReview] accommodation found:", accommodation?._id);
    console.log(
      "[submitReview] accommodation ownerId:",
      accommodation?.ownerId
    );

    const savedReview = accommodation.reviews[0]; // get saved review with _id

    res.status(201).json({ review: savedReview });
  } catch (error) {
    console.error("Error submitting review:", error);
    res.status(500).json({ message: "Som ting wong - Internal server error" });
  }
};

// edit a review
exports.editReview = async (req, res) => {
  try {
    const { id, reviewId } = req.params;
    const { rating, comment, purpose } = req.body;

    if (!rating || !comment || !purpose) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const accommodation = await Accommodation.findById(id);
    if (!accommodation) {
      return res.status(404).json({ message: "Accommodation not found" });
    }

    const review = accommodation.reviews.id(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // only allow editing by the same user who created the review
    if (!review.user._id.equals(req.user.id)) {
      return res
        .status(403)
        .json({ message: "Not authorized to edit this review" });
    }

    review.rating = rating;
    review.comment = comment;
    review.purpose = purpose;

    await accommodation.save();

    res.status(200).json({ review });
  } catch (error) {
    console.error("Error editing review:", error);
    res.status(500).json({ message: "Som ting wong - Internal server error" });
  }
};

// delete a review
exports.deleteReview = async (req, res) => {
  try {
    const { id, reviewId } = req.params;

    const accommodation = await Accommodation.findById(id);
    if (!accommodation) {
      return res.status(404).json({ message: "Accommodation not found" });
    }

    const review = accommodation.reviews.id(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // only allow deletion by the user who wrote the review
    if (!review.user._id.equals(req.user.id)) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this review" });
    }

    accommodation.reviews = accommodation.reviews.filter(
      (r) => String(r._id) !== String(reviewId)
    );
    await accommodation.save();

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ message: "Som ting wong - Internal server error" });
  }
};
