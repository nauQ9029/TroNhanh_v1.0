const Accommodation = require('../models/Accommodation');

// CREATE
exports.createAccommodation = async (req, res, next) => {
  try {
    const acc = await Accommodation.create(req.body);
    res.status(201).json(acc);
  } catch (err) {
    next(err);
  }
};

// GET ALL
exports.getAllAccommodations = async (req, res, next) => {
  try {
    const accs = await Accommodation.find();
    res.json(accs);
  } catch (err) {
    next(err);
  }
};

// GET BY ID
exports.getAccommodationById = async (req, res, next) => {
  try {
    const acc = await Accommodation.findById(req.params.id);
    if (!acc) return res.status(404).json({ message: "Not found" });
    res.json(acc);
  } catch (err) {
    next(err);
  }
};

// UPDATE
exports.updateAccommodation = async (req, res, next) => {
  try {
    const acc = await Accommodation.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!acc) return res.status(404).json({ message: "Not found" });
    res.json(acc);
  } catch (err) {
    next(err);
  }
};

// DELETE
exports.deleteAccommodation = async (req, res, next) => {
  try {
    await Accommodation.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    next(err);
  }
};
