const Message = require("../models/message");
const User = require("../models/user");

const cloudinary = require('cloudinary').v2;
// const { io, userSocketMap } = require('../index'); // import io and userSocketMap from index.js
const { getSocket } = require('../socketStore');
const { io } = require('../index');


//  get all user except the logged in user
const getUsersForSidebar = async (req, res) => {
    try {
        const userId = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: userId } }).select("-password");   //ne => not equal to  :: userIds which which not equals to logged in id 
        // count no. of messages not seen
        const unseenMessages = {}; // we have to show no. of unseen message from perticular user infront of their profile in side bar
        // for this we set all the no(unseen message) for perticular id( notlogged in ids: senders)  
        const promises = filteredUsers.map(async (user) => {
            const messages = await Message.find({ senderId: user._id, receiverId: userId, seen: false });
            if (messages.length > 0) {
                unseenMessages[user._id] = messages.length;
            }
        });
        await Promise.all(promises);
        res.json({ success: true, users: filteredUsers, unseenMessages });
        console.log("✅ getUsersForSidebar called by:", req.user._id);

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

// Get messages for selected user
const getMessages = async (req, res) => {
    try {
        const myId = req.user._id; // sender 
        const { id: selectedUserId } = req.params;   // userId whom i select for chatting  (reciever) 

        const messages = await Message.find({
            // or is used to findout out messages of both sides (sender<--> reciever)
            $or: [
                { senderId: myId, receiverId: selectedUserId },
                { senderId: selectedUserId, receiverId: myId }
            ]
        });
        await Message.updateMany({ senderId: selectedUserId, receiverId: myId }, { seen: true });
        res.json({ success: true, messages });

    } catch (error) {
        console.log("error", error.message);
        res.json({ success: false, message: error.message });
    }
}

// set message  marked as seen by message id 
const markMessageAsSeen = async (req, res) => {
    try {
        const { id } = req.params;
        await Message.findByIdAndUpdate(id, { seen: true });
        res.json({ success: true });

    } catch (error) {
        console.log("error", error.message);
        res.json({ success: false, message: error.message });
    }

}

// send message to selected user
const sendMessages = async (req, res) => {
    try {
        const { text, image } = req.body;
        const receiverId = req.params.id;
        const senderId = req.user._id;  //loggedin user(myId);

        let imageUrl;   // if images available then we have to securely upload it to database via cloudinary and add new Message to database
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = await Message.create({
            senderId, receiverId, text, image: imageUrl
        });
        //  emit the new message to the reciever to the reciever's socket in real time
        console.log("Looking for receiverId:", receiverId?.toString());
        const socketId = getSocket(receiverId?.toString());
        if (socketId) {
            io.to(socketId).emit("newMessage", newMessage);
        }
        else {
            console.warn("User is offline :", receiverId);
        }

        return res.json({ success: true, newMessage });

    } catch (error) {
        console.log("error1", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
}

// we want this message is showing on reciever side also in real time 
// hence we have to use socket.io

module.exports = { getUsersForSidebar, getMessages, markMessageAsSeen, sendMessages };


