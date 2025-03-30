const User = require('../models/User');
const jwt = require('jsonwebtoken');

const createToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) return res.status(400).json({ error: 'User exists' });

    const user = await User.create({ username, email, password });
    const token = createToken(user._id);

    res.status(201).json({
      status: 'success',
      token,
      user: { id: user._id, username, email }
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
exports.register = async (req, res) => {
  try {
    console.log('Registration attempt:', req.body); // Log incoming request
    
    const { username, email, password } = req.body;
    console.log('Checking existing users...');
    
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      console.log('User exists:', existingUser);
      return res.status(400).json({ error: 'User exists' });
    }

    console.log('Creating new user...');
    const user = await User.create({ username, email, password });
    
    console.log('User created:', user._id);
    const token = createToken(user._id);
    
    res.status(201).json({ /* ... */ });
    
  } catch (err) {
    console.error('Registration error:', err.stack); // Full error stack
    res.status(400).json({ error: err.message });
  }
};
