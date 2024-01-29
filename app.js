const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// Serve static files
app.use(express.static(__dirname + '/public'));

// Array to store messages
let messages = [];

// Handle socket.io connections
io.on('connection', (socket) => {
    console.log('A user connected');

    // Send stored messages to the newly connected client
    messages.forEach(message => socket.emit('message', message));

    // Handle incoming messages
    socket.on('message', (data) => {
        console.log('Received message:', data);

        // Save the message
        messages.push(data);

        // Broadcast the message to all connected clients
        io.emit('message', data);
    });

    // Handle disconnections
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// Start the server
const port = 8080;
http.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
