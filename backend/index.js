const express = require('express');
require('dotenv').config();
const cors = require('cors');
const http = require('http');
require('./lib/db')

const userRoute = require('./routes/route');
const messageRouter = require('./routes/messageRoute');
const { Server } = require('socket.io');


//creating express and http server 
const app = express()
const server = http.createServer(app);

// Inialize Socket.io Server
const io = new Server(server, {
    cors: { origins: "*" }
});
// store online users
// const userSocketMap={};
const { setSocket, removeSocket, getAllOnlineUsers } = require('./socketStore');


// socket.io connection handler

io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    console.log("User Connected", userId);

    if (userId) {
        setSocket(userId, socket.id);
        io.emit("getOnlineUsers", getAllOnlineUsers());

        socket.on("disconnect", () => {
            console.log("User Disconnected", userId);
            removeSocket(userId);
            io.emit("getOnlineUsers", getAllOnlineUsers());
        });
    }

});



// middleware
app.use(express.json({ limit: "4mb" }))
app.use(cors()); // help to import all urls from backend

// routes setup
app.use("/api/status", (req, res) => res.send("Server is live"));
app.use('/api/auth', userRoute);
app.use('/api/messages', messageRouter);

if (process.env.NODE_ENV !== "production") {
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, (err) => {
        if (!err) {
            console.warn("server is running on port: ", PORT)
        }
    })
}

// export server for vercel

module.exports = { io ,server}; // export io and userSocketMap for use in other files(.. messageController)