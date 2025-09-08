const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const{registerValidator,loginValidator} = require('../middleware/authValidator')
router.post('/register',registerValidator, authController.register);
router.post('/login',loginValidator, authController.login);
router.post('/refresh-token', authController.refreshToken);
module.exports = router;
