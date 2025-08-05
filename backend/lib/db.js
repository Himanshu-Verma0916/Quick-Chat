const mongoose=require('mongoose');
const connectDb=async()=>{
    try{
        mongoose.connection.on('connected',()=>console.log("connected to database"));
        await mongoose.connect(`${process.env.MONGODB_URI}/chat-app`)
    }catch(error){
        console.log("failed to connect db :",error)
    }
}
module.exports=connectDb();