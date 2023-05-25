import express from 'express';
import { createServer } from 'http';
import { PeerServer } from 'peer';
import { Server } from 'socket.io';
import cors from 'cors'
import EventEmitter from 'events';

const app = express();

const server = createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

let userBusy = [];

let userOnline = [];

io.on('connection', socket => {

    socket.on("online", (userId) => {
        userOnline.push(userId);
        io.emit("response-online", JSON.stringify(userOnline));
    })

    socket.on("offline", (userId) => {
        userOnline = userOnline.filter((user) => user === userId);
        io.emit("response-online", JSON.stringify(userOnline));
    })

    socket.on("send-message", (msg) => {
        io.emit("response-message", msg);
    });

    socket.on('call-video', (data) => {
        let d = JSON.parse(data);
        userBusy.push(d.sender);
        if (typeof d.recipient === "string") {
            userBusy.push(d.recipient);
        } else {
            d.recipient.forEach((re) => userBusy.push(re))
        }
        io.emit("response-call-video", data)
    });

    socket.on('reject-call', (data) => {
        let d = JSON.parse(data);
        if (!d.isGroup) {
            userBusy = userBusy.filter((user) => user === d.sender && d.recipient === user)
        } else {
            userBusy = userBusy.filter((user) => user !== d.sender)
        }
        io.emit("response-reject-call", data)
    });

    socket.on('accept-call', (data) => {
        io.emit("response-accept-call", data)
    });

    socket.on('action-call', (data) => {
        io.emit("response-action-call", data)
    });

    socket.on('disconnect-call', (data) => {
        let d = JSON.parse(data);
        if (!d.isGroup) {
            userBusy = userBusy.filter((user) => user === d.sender && d.recipient === user)
        } else {
            userBusy = userBusy.filter((user) => user !== d.sender)
        }
        io.emit("response-disconnect-call", data)
    });

    socket.on('disconnect', () => {
        userBusy = [];
        userOnline = [];
    });

    socket.on('join-room', (response) => {
        let data = JSON.parse(response);
        socket.join(data.chatRoomId)
        socket.to(data.chatRoomId).emit('user-connected', response)
        socket.on('disconnect', () => {
            socket.to(data.chatRoomId).emit('user-disconnected', response)
        })
    })

})

app.use(cors({ origin: '*' }));

app.get("/getUserBusy", (req, res) => {
    res.json(userBusy);
})

EventEmitter.setMaxListeners(50);

server.listen(9000, () => console.log('Server running on port 9000'))