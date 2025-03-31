require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const socketio = require('socket.io');
const connectDB = require('./config/db');

// Initialize app
const app = express();

// Database connection
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../../client')));

// Routes
app.use('/api/auth', require('./routes/auth'));

// Serve client files
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client', 'auth', 'register.html'));
});

// Server setup
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => 
  console.log(`Server running on port ${PORT}`));

// WebSocket setup
const io = socketio(server);
require('./controllers/chatController')(io);
