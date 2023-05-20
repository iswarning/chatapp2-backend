import express from 'express';
import { createServer } from 'http';
import { ExpressPeerServer } from 'peer';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

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