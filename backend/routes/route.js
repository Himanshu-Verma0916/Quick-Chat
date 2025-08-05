const express=require('express');
const userRouter=express.Router();
const {signUp, login,updateProfile, checkAuth}=require('../controllers/userController');

const protectRoute= require('../middleware/auth');


// api endpoints
userRouter.post('/signUp',signUp);
userRouter.post('/login',login);
userRouter.put('/updateProfile',protectRoute,updateProfile);
userRouter.get('/check', protectRoute,checkAuth);   // after updating profile we have to check auth 
module.exports=userRouter;