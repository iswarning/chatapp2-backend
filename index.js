import express from 'express';
import { createServer } from 'http';
import { PeerServer } from 'peer';
import { Server } from 'socket.io';

const app = express();
app.use(function(req, res, next) {
    // res.header("Access-Control-Allow-Origin", "*");
    const allowedOrigins = ['http://localhost:3000', 'http://gamebrag.onrender.com', 'https://gamebrag.onrender.com'];
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-credentials", true);
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, UPDATE");
    next();
});
const server = createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

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

PeerServer({
    path: "/peer",
    port: 443
});

server.listen(9000, () => console.log('server peer running on port 9000'))