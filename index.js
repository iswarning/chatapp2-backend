const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { ExpressPeerServer } = require('peer');

const io = require('socket.io')(server, {
    cors: {
        origin: '*',
    }
});

const peerServer = ExpressPeerServer(server, {
    proxied: true,
    debug: true,
    path: "/",
    ssl: {},
});

app.use(peerServer);

io.on('connection', socket => {

    socket.on("send-message", (msg) => {
        io.emit("response-message", msg);
    })

    socket.on('call-video', (senderCall, recipientCall, chatId) => {
        io.emit("response-call", senderCall, recipientCall, chatId)
    });

    socket.on('reject-call', (data) => {
        io.emit("response-reject", data)
    });

    socket.on('join-room', (roomId, userId, recipientId) => {
        socket.join(roomId)
        socket.to(roomId).emit('user-connected', userId)
        socket.on('disconnect', () => {
            socket.to(roomId).emit('user-disconnected', userId)
        })
    })
})

server.listen(9000, () => console.log('server peer running on port 9000'))