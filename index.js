import express from 'express';
import { createServer } from 'http';
import { ExpressPeerServer } from 'peer';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

io.on('connection', socket => {
    console.log(socket.id);
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

const peerServer = ExpressPeerServer(server, {
    proxied: true,
    debug: true,
    path: "/peer",
    ssl: {},
});

app.use(peerServer);

server.listen(9000, () => console.log('server peer running on port 9000'))