// const express = require('express');
// const app = express();
// const server = require('http').Server(app);

// const io = require('socket.io')(server, {
//     cors: {
//         origin: '*',
//     }
// });

// const PeerServer = require('peer').PeerServer;
// PeerServer({ port: 443, path: '/' });

// io.on('connection', socket => {
//     socket.on('message', msg => {
//         socket.emit('message', msg);
//         console.log(msg)
//     })
//     socket.on('join-room', (roomId, userId) => {
//         console.log(roomId, userId);
//         socket.join(roomId)
//         socket.to(roomId).emit('user-connected', userId)
//         socket.on('disconnect', () => {
//             socket.to(roomId).emit('user-disconnected', userId)
//         })
//     })
// })

// server.listen(9000, () => console.log('server running'))

var express = require('express')
const http = require("http");
var app = express();
const server = http.createServer(app);

const socketIo = require("socket.io")(server, {
    cors: {
        origin: "*",
    }
});
// nhớ thêm cái cors này để tránh bị Exception nhé :D  ở đây mình làm nhanh nên cho phép tất cả các trang đều cors được. 


socketIo.on("connection", (socket) => { ///Handle khi có connect từ client tới
    console.log("New client connected" + socket.id);

    socket.on("sendDataClient", function(data) { // Handle khi có sự kiện tên là sendDataClient từ phía client
        socketIo.emit("sendDataServer", { data }); // phát sự kiện  có tên sendDataServer cùng với dữ liệu tin nhắn từ phía server
    })

    socket.on("disconnect", () => {
        console.log("Client disconnected"); // Khi client disconnect thì log ra terminal.
    });
});

server.listen(9000, () => {
    console.log('Server đang chay tren cong 3000');
});