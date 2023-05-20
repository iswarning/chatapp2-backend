const express = require('express');
const app = express();
const http = require('http');
const serverPeer = http.Server(app);

const ioPeer = require('socket.io')(serverPeer, {
    cors: {
        origin: '*',
    }
});

const PeerServer = require('peer').PeerServer;
PeerServer({ port: 443, path: '/' });

ioPeer.on('connection', socket => {

    socket.on("sendMessage", (msg) => {
        ioPeer.emit("responseMessage", msg);
    })

    // socket.on("disconnect", () => {
    //     console.log("Client disconnected"); // Khi client disconnect thì log ra terminal.
    // });

    socket.on('call-video', (senderCall, recipientCall, chatId) => {
        ioPeer.emit("response-call", senderCall, recipientCall, chatId)
    })

    socket.on('join-room', (roomId, userId, recipientId) => {
        console.log(roomId, userId, recipientId);
        socket.join(roomId)
        socket.to(roomId).emit('user-connected', userId)
        socket.on('disconnect', () => {
            socket.to(roomId).emit('user-disconnected', userId)
        })
    })
})

serverPeer.listen(9000, () => console.log('server peer running on port 9000'))