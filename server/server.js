require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authMiddleware = require('./middleware/auth');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
require('./config/db')();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/posts', authMiddleware, require('./routes/posts'));
app.use('/api/users', authMiddleware, require('./routes/users'));
app.use('/api/friends', authMiddleware, require('./routes/friends'));
app.use('/api/chat', authMiddleware, require('./routes/chat'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
