const Favorite = require('../models/Favorite');
const Accommodation = require('../models/Accommodation')
const mongoose = require('mongoose');

exports.addFavorite = async (req, res) => {
  try {
    const { accommodationId } = req.body;
    const customerId = req.user.id;

    const accommodation = await Accommodation.findById(accommodationId);
    if (!accommodation) {
      return res.status(404).json({ message: "Accommodation not found" });
    }

    const favorite = await Favorite.create({
      accommodationId, customerId
    });
    res.status(200).json({ message: "Accommodation add to favorite", favorite });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }

};

exports.deleteFavorite = async (req, res) => {
  try {
    const accommodationId = req.params.id; 
    const customerId = req.user.id;


    const favorite = await Favorite.findOneAndDelete({ accommodationId, customerId });

    if (!favorite) {
      return res.status(404).json({ message: "Favorite not found" });
    }

    res.status(200).json({ message: "Delete favorite successfully" });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};


exports.getFavorite = async (req, res) => {
  try {
    const customerId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(customerId)) {
      return res.status(400).json({ message: 'Invalid customerId' });
    }

    const favorites = await Favorite.find({ customerId })
      .populate({
        path: 'accommodationId',
        model: 'Accommodation'
      })
      .exec();

    res.status(200).json({
      message: 'Favorites fetched successfully',
      favorites
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getFavoriteById = async (req, res) => {
  try {
    const customerId = req.user.id;
    const { accommodationId } = req.query; // lấy từ query string

    if (!mongoose.Types.ObjectId.isValid(customerId)) {
      return res.status(400).json({ message: 'Invalid customerId' });
    }

    const filter = { customerId };

    if (accommodationId && mongoose.Types.ObjectId.isValid(accommodationId)) {
      filter.accommodationId = accommodationId;
    }

    const favorites = await Favorite.find(filter)
      .populate({
        path: 'accommodationId',
        model: 'Accommodation'
      });

    res.status(200).json({
      message: 'Favorites fetched successfully',
      favorites
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
