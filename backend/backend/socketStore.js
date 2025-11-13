// socketStore.js
const userSocketMap = {};

const setSocket = (userId, socketId) => {
    userSocketMap[userId] = socketId;
};

const removeSocket = (userId) => {
    delete userSocketMap[userId];
};

const getSocket = (userId) => {
    return userSocketMap[userId];
};

const getAllOnlineUsers = () => {
    return Object.keys(userSocketMap);
};

module.exports = {
    setSocket,
    removeSocket,
    getSocket,
    getAllOnlineUsers
};
