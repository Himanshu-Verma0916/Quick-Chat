const User= require('../models/user');
const jwt = require('jsonwebtoken'); 

// middleware toprotect routes so that only authorised user can access it
const protectRoute=async(req,res,next)=>{
    try{
        const token=req.headers.token;
        const decoded= jwt.verify(token,process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select("-password"); // ✅ correct

        if(!user){
            return res.json({success:false ,message:"User not found"});
        }

        req.user=user;
        next();
    }catch(error){
        res.json({success:false, message:error.message});
    }
}

module.exports=protectRoute;