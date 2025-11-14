import { createContext, useEffect, useState } from "react";
import {toast} from "react-toastify";
import {io} from "socket.io-client";
const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
export const AuthContext=createContext();
export const AuthProvider = ({children})=>{
    const [token,setToken]=useState(localStorage.getItem("token"));
    const [authUser,setAuthUser]=useState(null);
    const[onlineUsers,setOnlineUsers]=useState([]);
    const [socket,setSocket]=useState(null);
    
    // check if user is authenticated  and if so, set the user data and connect the socket
    const checkAuth=async()=>{
        try{
            const result=await fetch(backendUrl +"/api/auth/check",{
                 headers: {
                'Content-Type': 'application/json',
                'token': token 
                }
            });
            let data = await result.json();
            if(data.success){
                setAuthUser(data.user);  
                connectSocket(data.user);
            }
        }catch(error){
            toast.error("Failed to authenticate user. Please login again.");
            setAuthUser(null);

        }
    }

    // function to handle user login and and socket connection

    const login=async(state,credentials)=>{
        try{
            const result=await fetch(backendUrl +`/api/auth/${state}`,{
                method:"POST",
                headers: {
                    'Content-Type': 'application/json',
                    'token': token
                },
                body:JSON.stringify(credentials)
            });
            let data = await result.json();
            if(data.success){
                setAuthUser(data.user);
                setToken(data.token);
                localStorage.setItem("token",data.token);
                toast.success(data.message);
            }else{
                toast.error(data.message || "Login failed");
            }
        }catch(error){
            toast.error(error.message);
        }
    }

    // function to handle user logout and disconnect socket
    const logout=async()=>{
        localStorage.removeItem("token");
        setToken(null);
        setAuthUser(null);
        toast.success("Logged out successfully");
         if(socket){
            socket.disconnect();
            setSocket(null);
        }
    }
    // function to update user profile

    const updateProfile=async(body)=>{
        try{
            const result=await fetch(backendUrl +"/api/auth/updateProfile",{
                method:"PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'token': token
                },
                body:JSON.stringify(body)
            });
            let data = await result.json();
            if(data.success){
                setAuthUser(data.user);
                toast.success(data.message || "Profile updated successfully");
            }else{
                toast.error(data.message || "Failed to update profile");
            }
        }catch(error){
            toast.error(error.message);
        }
    }

    // connect to socket function to handle socket connection and  online users updates
    const connectSocket=(userData)=>{
        if(!userData || socket?.connected){
            return;
        }
        const newSocket=io(backendUrl,{
            query:{
                userId: userData._id,
            }
        });
        newSocket.connect();
        setSocket(newSocket);

        newSocket.on("getOnlineUsers",(userIds)=>{
            setOnlineUsers(userIds);
        });

    }
    useEffect(()=>{
        if(token){
            checkAuth();
        }
    },[token])
    
    const value={
        token,
        authUser,
        onlineUsers,
        socket,
        login,
        logout,
        updateProfile,
        connectSocket
    }
    return(
        <AuthContext.Provider value={value}>
            {children}  
        </AuthContext.Provider>
    )
}