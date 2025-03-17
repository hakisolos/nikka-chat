const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require("path")

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let users = [];

app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('join', (username) => {
        if (!username) return;
        console.log(`${username} joined the chat`);
        users.push(username);
        io.emit('chatMessage', { name: 'System', message: `${username} joined the chat` });
    });

    socket.on('chatMessage', (data) => {
        io.emit('chatMessage', data);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

server.listen(process.env.PORT || 3000, '0.0.0.0', () => {
    console.log('Server running on port:', process.env.PORT || 3000);
});