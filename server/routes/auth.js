const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const upload = require('../middleware/upload');

router.post('/register', 
    upload.single('avatar'), 
    authController.register
);

module.exports = router;