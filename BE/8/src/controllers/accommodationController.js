// file TroNhanh_BE/src/controllers/accomodationController.js
const Accommodation = require('../models/Accommodation');


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

    const photoPaths = req.files?.map(file => `/uploads/accommodation/${file.filename}`) || [];

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
    const photoPaths = req.files?.map(file => `/uploads/accommodation/${file.filename}`) || [];

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
    console.error('[UPDATE ERROR]', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllAccommodations = async (req, res) => {
  try {
    const { ownerId } = req.query;
    console.log("[DEBUG] Received ownerId query:", ownerId);

    const filter = ownerId ? { ownerId } : {};

    const accommodations = await Accommodation.find(filter)
      .populate('ownerId', 'name email');

    res.status(200).json(accommodations);
  } catch (err) {
    console.error('[GET ALL ERROR]', err);
    res.status(500).json({ message: 'Server error' });
  }
};



exports.getAccommodationById = async (req, res) => {
  try {
    const acc = await Accommodation.findById(req.params.id).populate('ownerId', 'name email');
    if (!acc) return res.status(404).json({ message: 'Accommodation not found' });
    res.status(200).json(acc);
  } catch (err) {
    console.error('[GET BY ID ERROR]', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteAccommodation = async (req, res) => {
  try {
    const deleted = await Accommodation.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Accommodation not found' });

    res.status(200).json({ message: 'Accommodation deleted successfully' });
  } catch (err) {
    console.error('[DELETE ERROR]', err);
    res.status(500).json({ message: 'Server error' });
  }
};