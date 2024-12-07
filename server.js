/*const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { Server } = require('http');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Store users
let users = [];

app.use(express.static('public')); // Serve static files (like HTML, CSS, JS)

// Serve the index.html (or your front-end file) for the root path
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log('A user connected');

    // Handle user joining the chat
    socket.on('join', (username) => {
        if (!username) return; // Make sure the username is provided
        
        console.log(`${username} joined the chat`);  // Log to terminal
        users.push(username);

        // Notify all clients that a new user has joined
        io.emit('chatMessage', { name: 'System', message: `${username} joined the chat` });
    });

    // Handle chat message
    socket.on('chatMessage', (data) => {
        io.emit('chatMessage', data);
    });

    // Handle user disconnecting
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// Exporting the app as a function for Vercel serverless deployment
module.exports = (req, res) => {
    server(req, res);
};
*/

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Store users
let users = [];

// Serve static files
app.use(express.static('public'));

// Handle Socket.IO connections
io.on('connection', (socket) => {
    console.log('A user connected');

    // Handle user joining
    socket.on('join', (username) => {
        if (!username) return;

        console.log(`${username} joined the chat`);
        users.push(username);

        // Notify all clients
        io.emit('chatMessage', { name: 'System', message: `${username} joined the chat` });
    });

    // Handle chat messages
    socket.on('chatMessage', (data) => {
        io.emit('chatMessage', data);
    });

    // Handle disconnect
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Socket.IO server running on port ${PORT}`);
});
