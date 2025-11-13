import { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { AuthContext } from './AuthContext';
export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [messages, setMessages] = useState([]);  // Array to hold chat messages
    const [users, setUsers] = useState([]);  // Array to hold users for left sidebar 
    const [selectedUser, setSelectedUser] = useState(null); // user selected for chat in chat box
    const [unseenMessages, setUnseenMessages] = useState({});  // object to hold count of unseen messages per user

    const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
    const { socket } = useContext(AuthContext);
    // Function to fetch users for the sidebar
    const fetchUsers = async () => {
        try {
            const response = await fetch(`${backendUrl}/api/messages/users`, {
                headers: {
                    'Content-Type': 'application/json',
                    'token': localStorage.getItem('token'),
                },
            });
            const data = await response.json();
            if (data.success) {
                setUsers(data.users);
                setUnseenMessages(data.unseenMessages);
            }
        } catch (error) {
            console.log('Error to fetching users for sidebar:', error);
        }
    }

    // Function to fetch messages for the selected user
    const fetchMessages = async (userId) => {
        try {
            const response = await fetch(`${backendUrl}/api/messages/${userId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'token': localStorage.getItem('token'),  // ✅ this was missing
                },
            });
            const data = await response.json();
            if (data.success) {
                setMessages(data.messages);
            } else {
                toast.error(data.message || "Failed to fetch messages");
            }
        } catch (error) {
            console.log('Error fetching messages:', error);
            toast.error(error.message);
        }
    }
    //  Function to send message to selected user
    const sendMessages = async (messageData) => {
        try {
            const response = await fetch(`${backendUrl}/api/messages/send/${selectedUser._id}`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'token': localStorage.getItem('token')
                },
                body: JSON.stringify(messageData)
            });
            const data = await response.json();
            // console.log("selectedUser", selectedUser);
            // console.log("selectedUser?._id", selectedUser?._id);


            if (data.success) {
                setMessages((prevMessages) => [...prevMessages, data.newMessage]);
                socket.emit('newMessage', data.newMessage); // Emit new message event to socket
            }
        } catch (error) {
            console.log('Error sending message:', error.message);
            toast.error(error.message);
        }
    }

    // Function to subscribe to messages for selected user from sockets(live)
    const subscribeToMessages = async () => {
        if (!socket) return;
        socket.on("newMessage", async (newMessage) => {
            if (
                selectedUser &&
                (newMessage.senderId === selectedUser._id ||
                    newMessage.receiverId === selectedUser._id)
            ) {
                newMessage.seen = true;
                setMessages((prevMessages) => [...prevMessages, newMessage]);

                // Mark message as seen
                await fetch(`${backendUrl}/api/messages/markMessageAsSeen/${newMessage._id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'token': localStorage.getItem('token')
                    }
                });
            } else {
                // Update unseen count
                setUnseenMessages((prevUnseenMessages) => ({
                    ...prevUnseenMessages,
                    [newMessage.senderId]: (prevUnseenMessages[newMessage.senderId] || 0) + 1
                }));
            }
        });

    }

    // Function to unsubscribe from messages
    const unsubscribeFromMessages = () => {
        if (!socket) return;
        socket.off("newMessage");
    }

    useEffect(() => {
        const init = () => {
            subscribeToMessages();
        };
        init();
        return () => unsubscribeFromMessages();
    }, [socket, selectedUser]);

    const value = {
        messages,
        users,
        selectedUser,
        unseenMessages,
        setMessages,
        setSelectedUser,
        setUnseenMessages,
        fetchUsers,
        fetchMessages,
        sendMessages,
    }
    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    )
}
