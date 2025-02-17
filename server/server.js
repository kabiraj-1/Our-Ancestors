require('dotenv').config();
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const connectDB = require('./config/db');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Connect Database
connectDB();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/users', require('./routes/users'));
app.use('/api/friends', require('./routes/friends'));
app.use('/api/chat', require('./routes/chat'));

// WebSocket
io.on('connection', (socket) => {
    socket.on('join', (userId) => {
        socket.join(userId);
    });

    socket.on('sendMessage', async ({ sender, receiver, content }) => {
        const message = new Message({ sender, receiver, content });
        await message.save();
        io.to(receiver).emit('newMessage', message);
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));