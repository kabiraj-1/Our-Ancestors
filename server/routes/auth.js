const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const upload = require('../middleware/upload');

// Existing routes
router.post('/register', upload.single('profilePic'), authController.register);
router.post('/login', authController.login);

// New password reset routes
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);

module.exports = router;