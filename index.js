const express = require('express');
const cors = require('cors');
const { ExpressPeerServer } = require("peer");
const app = express();

app.use(cors({
    origin: true
}));

app.get("/", (req, res, next) => res.send("Hello world!"));



const peerServer = ExpressPeerServer(server, {
    path: "/myapp",
});

app.use("/peerjs", peerServer);

// app.use((err, req, res, next) => {
//     console.error(err.stack)
//     res.status(500).send('Something broke!')
// })

app.listen(80);