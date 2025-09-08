const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleWare');
const profileController = require('../controllers/profileController');
const favoriteController = require('../controllers/favoriteController');
const messageController = require('../controllers/messageController');
router.use(authMiddleware);

// ===== Personal Info =====
router.get('/personal-info', profileController.getProfileInfo);

// ===== Favourites =====
router.get('/favorites',favoriteController.getFavorite);


// ===== Messages =====
router.get('/messages', messageController.getUserMessages);
router.post('/messages', messageController.sendMessage);
router.delete('/messages/:id', messageController.deleteMessage);

const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: './uploads/avatars',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

router.put('/personal-info', upload.single('avatar'), profileController.updateUserInfo);

module.exports = router;