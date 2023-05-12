const express = require('express');
const app = express();
const { ExpressPeerServer } = require("peer");
const http = require('http').createServer(app)
const cors = require('cors');

app.use(cors());

const io = require("socket.io")(http);

const PORT = 3000;

const peerServer = ExpressPeerServer({
    debug: true,
    path: "/myapp",
    port: 9000
});

app.use("/peerjs", peerServer);

peerServer.on('connection', (client) => {
    {
        console.log(client)
        console.log('connected')
    }
});

app.get('/hello', (req, res) => {
        res.json('Hello');
    })
    // peerServer.on('disconnect', (client) => { ... });

io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId);
        socket.to(roomId).emit('user-connected', userId);
        socket.on('disconnect', () => {
            socket.to(roomId).emit('user-disconnected', userId)
        })
    })
});

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`)
});