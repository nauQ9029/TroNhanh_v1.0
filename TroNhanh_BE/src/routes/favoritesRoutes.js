
const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');
const authMiddleware = require('../middleware/authMiddleWare');


router.get('/',authMiddleware, favoriteController.getFavorite);
// router.get('/:id',authMiddleware, favoriteController.getFavoriteById);
router.post('/',authMiddleware, favoriteController.addFavorite);
router.delete('/:id',authMiddleware, favoriteController.deleteFavorite);

module.exports = router;