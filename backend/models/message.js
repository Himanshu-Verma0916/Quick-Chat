const mongoose=require('mongoose');

const messageSchema=new mongoose.Schema({
    senderId:{type:mongoose.Schema.Types.ObjectId, ref:"User", required:true},
    receiverId:{type:mongoose.Schema.Types.ObjectId, ref:"User", required:true},
    text:{type:String},
    image:{type:String},
    seen:{type:Boolean,default:false}
},{timestamps:true});
// when we add timestamp then mongoose automatically adds two fields to schema 
// createdAt: Date  (when user is registered)
// updatedAt: Date  (Detect if a profile was updated recently)
const Message=mongoose.model("Message",messageSchema);
module.exports=Message;