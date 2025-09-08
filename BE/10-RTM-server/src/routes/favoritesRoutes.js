
const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');
const authMiddleware = require('../middleware/authMiddleWare');
// POST /favorites
router.post('/',authMiddleware, favoriteController.addFavorite);

// DELETE /favorites
router.delete('/',authMiddleware, favoriteController.deleteFavorite);

module.exports = router;