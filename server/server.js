require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const socketio = require('socket.io');
const authRoutes = require('./server/routes/auth');
const postRoutes = require('./server/routes/posts');

const app = express();

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('client'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

// Socket.io setup
const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on port ${process.env.PORT || 3000}`);
});

const io = socketio(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"]
  }
});

// WebSocket connections
io.on('connection', (socket) => {
  console.log('New WebSocket connection');
  require('./server/controllers/chatController')(socket, io);
});
