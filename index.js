const express = require('express');
const app = express();
const https = require('https');
const server = https.createServer(app);
const { ExpressPeerServer } = require("peer");

const io = require("socket.io")(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"]
    }
});

const peerServer = ExpressPeerServer(server, {
	debug: true,
	path: "/myapp",
  port: 443
});

app.use("/peerjs", peerServer);

peerServer.on('connection', (client) => { {
  console.log(client)
  console.log('connected')
} });

https.get('/hello', () => {
  return 'Hello';
})
// peerServer.on('disconnect', (client) => { ... });

io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
      io.emit('chat message', msg);
    });
    socket.on('join-room', (roomId, userId) => {
      socket.join(roomId);
      socket.to(roomId).emit('user-connected', userId);
      socket.on('disconnect', () => {
        socket.to(roomId).emit('user-disconnected', userId)
      })
    })
});

server.listen(3000);