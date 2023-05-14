const express = require('express');
const app = express();
const server = require('http').Server(app);

const io = require('socket.io')(server, {
    cors: {
        origin: '*',
    }
});

const PeerServer = require('peer').PeerServer;
PeerServer({ port: 443, path: '/peerjs' });

app.get('/', (req, res) => res.send('seseseses'));

io.on('connection', socket => {
    socket.on('chat message', (msg) => {
        socket.emit('chat message', msg);
    })
    socket.on('join-room', (roomId, userId) => {
        console.log(roomId, userId);
        socket.join(roomId)
        socket.to(roomId).emit('user-connected', userId)
        socket.on('disconnect', () => {
            socket.to(roomId).emit('user-disconnected', userId)
        })
    })
})

server.listen(9000, () => console.log('server running'))