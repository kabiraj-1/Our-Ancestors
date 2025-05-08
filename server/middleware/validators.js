const { check } = require('express-validator');

exports.registerValidator = [
  check('username')
    .notEmpty().withMessage('Username is required')
    .isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
  
  check('email')
    .isEmail().withMessage('Invalid email address'),
  
  check('password')
    .notEmpty().withMessage('Password is required')
];
