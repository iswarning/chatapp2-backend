import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import EventEmitter from "events";

const app = express();

const server = createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

let userBusy = [];

let userOnline = {};

io.on("connection", (socket) => {
    socket.on("send-notify", (msg) => {
        io.emit("response-notify", msg);
    });

    socket.on("login", function(data) {
        userOnline[socket.id] = data.userId;
        socket.to(socket.id)
        io.emit("get-user-online", Object.values(userOnline));
    });

    socket.on("disconnect", function() {
        delete userOnline[socket.id];
        io.emit("get-user-online", Object.values(userOnline));
    });

    socket.on("call-video-one-to-one", (data) => {
        let d = JSON.parse(data);
        userBusy.push(d.recipient);
        io.emit("response-call-video-one-to-one", data);
    });

    socket.on("call-video-one-to-many", (data) => {
        let d = JSON.parse(data);
        d.recipient.forEach((re) => userBusy.push(re));
        io.emit("response-call-video-one-to-many", data);
    });

    socket.on("reject-call-one-to-one", (data) => {
        let d = JSON.parse(data);
        userBusy = userBusy.filter(
            (user) => user === d.sender && d.recipient === user
        );
        io.emit("response-reject-call-one-to-one", data);
    });

    socket.on("reject-call-one-to-many", (data) => {
        let d = JSON.parse(data);
        userBusy = userBusy.filter((user) => user !== d.sender);
        io.emit("response-reject-call-one-to-many", data);
    });

    socket.on("accept-call-one-to-one", (data) => {
        io.emit("response-accept-call-one-to-one", data);
    });

    socket.on("action-call", (data) => {
        io.emit("response-action-call", data);
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

    socket.on("disconnect", () => {
        userBusy = []
    })

    socket.on("join-room", (response) => {
        let data = JSON.parse(response);
        socket.join(data.chatRoomId);
        socket.to(data.chatRoomId).emit("user-connected", response);
        socket.on("action-change", (res) => {
            socket.to(data.chatRoomId).emit(res)
        })
        socket.on("disconnect", () => {
            socket.to(data.chatRoomId).emit("user-disconnected", response);
        });
    });
});

app.use(cors({ origin: "*" }));

app.get("/getUserBusy", (req, res) => {
    res.json(userBusy);
});

app.get("/getUserOnline", (req, res) => {
    res.json(userOnline);
});

EventEmitter.setMaxListeners(50);

server.listen(9000, () => console.log("Server running on port 9000"));