import mongoose from 'mongoose';

const postSchema=new mongoose.Schema(
{
post_owner:{
    type:String,
    required:true,

},
img:{
type:String,
required:true,

},
fullName:{
    type:String,
    required:true
},
profilePic:{
    type:String,
    required:false
},
likes:[String],
comments:[
{
    user:{
        type:String
    },
    comment:{
        type:String,
    }
}

]


})

const Post=mongoose.model("Post",postSchema);

export default Post;