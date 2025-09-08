const Property = require("../models/Property");

// POST /properties/:id/reviews
const addReviewToProperty = async (req, res) => {
  const userId = req.user.id;
  const propertyId = req.params.id;
  const { rating, comment } = req.body;

  console.log("[DEBUG] Incoming review submission");
  console.log("User ID:", userId);
  console.log("Property ID:", propertyId);
  console.log("Rating:", rating);
  console.log("Comment:", comment);

  try {
    // find the property
    const property = await Property.findById(propertyId);
    if (!property) {
      console.log("[DEBUG] Property not found");
      return res.status(404).json({ message: "Property not found." });
    }

    // check if the user already reviewed
    const alreadyReviewed = property.reviews.find(
      (rev) => rev.user.toString() === userId.toString()
    );
    if (alreadyReviewed) {
      console.log("[DEBUG] User already reviewed this property");
      return res
        .status(400)
        .json({ message: "You already reviewed this property." });
    }

    // add review
    const review = {
      user: userId,
      name: req.user.name,
      rating: Number(rating),
      comment,
      weeksAgo: 0,
      purpose: "Business trip", // Optional: allow input or logic
    };

    console.log("[DEBUG] Adding new review:", review);

    property.reviews.push(review);
    await property.save();

    console.log("[DEBUG] Review saved successfully");

    res.status(201).json({ message: "Review added successfully!" });
  } catch (err) {
    console.error("[ERROR] Failed to add review:", err);
    res.status(500).json({ message: "Review failed to add." });
  }
};

module.exports = { addReviewToProperty };
