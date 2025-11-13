// // socketStore.js
// const userSocketMap = {};

// const setSocket = (userId, socketId) => {
//     userSocketMap[userId] = socketId;
// };

// const removeSocket = (userId) => {
//     delete userSocketMap[userId];
// };

// const getSocket = (userId) => {
//     return userSocketMap[userId];
// };

// const getAllOnlineUsers = () => {
//     return Object.keys(userSocketMap);
// };

// module.exports = {
//     setSocket,
//     removeSocket,
//     getSocket,
//     getAllOnlineUsers
// };


let ioInstance = null;
const userSocketMap = new Map();

function setSocket(userId, socketId) {
  userSocketMap.set(userId, socketId);
}

function removeSocket(userId) {
  userSocketMap.delete(userId);
}

function getSocket(userId) {
  return userSocketMap.get(userId);
}

function getAllOnlineUsers() {
  return Array.from(userSocketMap.keys());
}

function setIo(io) {
  ioInstance = io;
}

function getIo() {
  return ioInstance;
}

module.exports = {
  setSocket,
  removeSocket,
  getSocket,
  getAllOnlineUsers,
  setIo,
  getIo,
};
