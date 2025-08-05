const mongoose=require('mongoose');

const userSchema=new mongoose.Schema({
    fullName:{type:String, required:true},
    email:{type:String ,required:true, unique:true},
    password:{type:String , required:true, minlength:6},
    profilePic:{type:String, default:""},
    bio:{type:String}
},{timestamps:true});
// when we add timestamp then mongoose automatically adds two fields to schema 
// createdAt: Date  (when user is registered)
// updatedAt: Date  (Detect if a profile was updated recently)
const User=mongoose.model("User",userSchema);
module.exports=User;