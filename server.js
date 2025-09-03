const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');

// Initialize Express
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// In-memory message storage (optional)
const messages = {
    general: []
};

// Serve static files (HTML, CSS, JS) from the public directory
app.use(express.static(path.join(__dirname, '../public')));

// Handle socket connections
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Public message handler
    socket.on('message', (msg) => {
        const user = socket.id;
        const time = new Date().toLocaleTimeString();
        const data = { user, msg, time };

        messages.general.push(data);

        // Keep only the last 50 messages
        if (messages.general.length > 50) {
            messages.general.shift();
        }

        // Broadcast to all clients in 'general' room
        io.emit('message', data);
    });

    // Private message handler
    socket.on('private', ({ to, msg }) => {
        const time = new Date().toLocaleTimeString();
        const data = { from: socket.id, msg, time, private: true };

        // Emit to the target user
        io.to(to).emit('private', data);

        // Echo back to sender for confirmation
        socket.emit('private', data);
    });

    // Typing indicator (optional)
    socket.on('typing', () => {
        socket.broadcast.emit('typing', { user: socket.id });
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
});