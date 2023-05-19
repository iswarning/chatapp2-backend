const express = require('express');
const app = express();
const http = require('http');
const serverPeer = http.Server(app);
// const serverMain = http.createServer(app);

const ioPeer = require('socket.io')(serverPeer, {
    cors: {
        origin: '*',
    }
});

// const ioMain = require('socket.io')(serverMain, {
//     cors: {
//         origin: '*',
//     }
// });

const PeerServer = require('peer').PeerServer;
PeerServer({ port: 443, path: '/' });

// ioMain.on('connection', socket => {
//     console.log("New client connected" + socket.id);

//     socket.on("sendMessage", function(data) { // Handle khi có sự kiện tên là sendDataClient từ phía client
//         ioMain.emit("responseMessage", { data }); // phát sự kiện  có tên sendDataServer cùng với dữ liệu tin nhắn từ phía server
//     })

//     socket.on("disconnect", () => {
//         console.log("Client disconnected"); // Khi client disconnect thì log ra terminal.
//     });
// })

ioPeer.on('connection', socket => {
    // console.log("New client connected" + socket.id);

    socket.on("sendMessage", (msg) => { // Handle khi có sự kiện tên là sendDataClient từ phía client
        ioPeer.emit("responseMessage", msg); // phát sự kiện  có tên sendDataServer cùng với dữ liệu tin nhắn từ phía server
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
// serverMain.listen(8000, () => console.log('server peer running on port 8000'))


// var express = require('express')
// const http = require("http");
// var app = express();
// const server = http.createServer(app);

// const socketIo = require("socket.io")(server, {
//     cors: {
//         origin: "*",
//     }
// });
// nhớ thêm cái cors này để tránh bị Exception nhé :D  ở đây mình làm nhanh nên cho phép tất cả các trang đều cors được. 


// socketIo.on("connection", (socket) => { ///Handle khi có connect từ client tới
//     console.log("New client connected" + socket.id);

//     socket.on("sendMessage", function(data) { // Handle khi có sự kiện tên là sendDataClient từ phía client
//         socketIo.emit("responseMessage", { data }); // phát sự kiện  có tên sendDataServer cùng với dữ liệu tin nhắn từ phía server
//     })

//     socket.on("disconnect", () => {
//         console.log("Client disconnected"); // Khi client disconnect thì log ra terminal.
//     });
// });

// server.listen(9000, () => {
//     console.log('Server đang chay tren cong 3000');
// });