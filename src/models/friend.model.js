import mongoose from 'mongoose';

const friendSchema=new mongoose.Schema(
{
sender:{
    type:String,
    required:true,
    ref:"User"
},
receiver:{
type:String,
required:true,
ref:"User"
},
status:{
    type:String,
    enum:["pending","accepted","rejected"],
    default:"pending"
}

})

const Friend=mongoose.model("Friend",friendSchema);

export default Friend;