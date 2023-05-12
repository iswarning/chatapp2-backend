const express = require('express');
const app = express();
const http = require('node:http');
const server = http.createServer(app);
// const cors = require('cors');
// const { ExpressPeerServer } = require('peer')

// app.use(cors());

// const peerServer = ExpressPeerServer(server, {
//     path: '/'
// });

// app.use('/peerjs', peerServer);

app.get('/', (req, res) => res.send('seseseses'));

server.listen(3000, () => console.log('server running'))