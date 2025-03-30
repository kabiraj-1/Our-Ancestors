const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));

// Database connection
mongoose.connect(process.env.DB_URI)
  .then(() => console.log('🗄️ MongoDB connected'))
  .catch(err => console.error('💥 Connection error:', err));

// Start server
app.listen(PORT, () => {
  console.log(`🖥️ Server running on port ${PORT}`);
});
