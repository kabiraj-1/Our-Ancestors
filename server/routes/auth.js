const router = require('express').Router();
const authController = require('../controllers/authController');
const { registerValidator } = require('../middleware/validators');

router.post('/register', registerValidator, authController.register);
// ... rest of the routes
