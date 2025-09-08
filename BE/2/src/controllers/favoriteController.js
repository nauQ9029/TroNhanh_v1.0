const Favourite = require('../models/Favorite');

// GET /api/profile/favourites
exports.getUserFavourites = async (req, res, next) => {
  try {
    const favourites = await Favourite.find({ customerId: req.user.id }).populate('accommodationId');
    res.json(favourites);
  } catch (err) {
    next(err);
  }
};

// POST /api/profile/favourites
exports.addFavourite = async (req, res, next) => {
  try {
    const favourite = new Favourite({
      customerId: req.user.id,
      accommodationId: req.body.accommodationId
    });
    const saved = await favourite.save();
    res.status(201).json(saved);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/profile/favourites/:id
exports.removeFavourite = async (req, res, next) => {
  try {
    const deleted = await Favourite.findOneAndDelete({
      _id: req.params.id,
      customerId: req.user.id
    });
    if (!deleted) return res.status(404).json({ message: 'Favorite not found' });
    res.json({ message: 'Removed successfully' });
  } catch (err) {
    next(err);
  }
};
