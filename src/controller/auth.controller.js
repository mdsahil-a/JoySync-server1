import User from '../models/user.model.js';
import Friend  from '../models/friend.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cloudinary from '../lib/cloudinary.js';
import Post from '../models/post.model.js';


const generateToken=(userId,res)=>{
const token=jwt.sign({userId},process.env.JWT_SECRET,{
    expiresIn:"7d"
});

res.cookie("jwt",token,{
    maxAge:7*24*60*60*1000,
    httpOnly:true,
    secure:false,
    sameSite: "none"

});

return token;
}

export const signup=async (req,res)=>{
     const {fullName,email,password}=req.body;


try{

    if(!fullName || !email || !password){
        return res.status(400).json({message:"All fields are required"});
    }

    if(password.length<6){
        return res.status(400).json({message:"password must be at least 6 char long"});
    }
    const user=await User.findOne({email});
    if(user){
        return res.status(400).json({message:"User already exists"});

    }

    const salt=await bcrypt.genSalt(10);
const hashedPassword=await bcrypt.hash(password,salt);

    const jsUser=new User({

        fullName:fullName,
        email:email,
        password:hashedPassword,
        profilePic:""

    })

    if(jsUser){
        generateToken(jsUser._id,res);
        await jsUser.save();
        
        return res.status(201).json({message:"User created successfully"});


    }
    else {
        return res.status(400).json({message:"Something went wrong"});
    }

}

catch(error){
    console.log("Error in controller",error.message);
    res.status(500).json({message:"Internal server error"});

}

}

export const login= async (req,res)=>{
   const {fullName,email,password}=req.body
    try {

if(!email || !password){
    return res.status(400).json({message:"All fields are required"});
}

if(password.length<6){
    return res.status(400).json({message:"Password length must be at least 6 character"})
}

const currentUser=await User.findOne({email});

if(!currentUser){
    return res.status(401).json({message:"Incorrect email or password"});
}

const isSame=await bcrypt.compare(password,currentUser.password);

if(!isSame){
    return res.status(401).json({message:"Incorrect email or password"});
}
 const token=generateToken(currentUser._id,res);


    res.status(200).json({
        message:"Logined successfully",
        token,
        user:{id:currentUser._id,fullName:currentUser.fullName}
    
    })

   
}
catch(error){
    console.log("Error in login controller: ",error.message);
   res.status(500).json({message:"Internal server error"})
}
}

export const logout=(req,res)=>{

try{
    res.cookie("jwt","",{maxAge:0});
    res.status(200).json({message:"Logged out successfully"});
    
}
  catch(error){
    console.log("Error in logout controller: ",error.message);
    res.status(500).json({message:"Internal server error"});
  }
}

export const updateProfile=async (req,res)=>{
    
    const fileBuffer = req.file.buffer.toString("base64");
    
    try{
  
    const authHeader = req.headers.authorization;

    const token = authHeader.split(" ")[1];

if(!fileBuffer){
    return res.status(400).json({message:"Profile picture is required"});
}
   const uploadResult = await cloudinary.uploader.upload(
      `data:${req.file.mimetype};base64,${fileBuffer}`,{

        folder:"profile_pics"
      }

    );
   const isValid=jwt.verify(token,process.env.JWT_SECRET);
const updateUser=await User.findByIdAndUpdate(isValid.userId,{profilePic:uploadResult.secure_url},{new:true});
return res.status(200).json({link:uploadResult.secure_url,success:true});
   
}
catch(error){

console.log("Error in upload profile: ",error.message);
  return res.status(500).json({ success: false, message: "Upload failed" });
}

}

export const checkAuth=async (req,res)=>{
try{
return res.status(200).json(req.user);

}
catch(error){
console.log("Error in check auth controller: ",error.message);
res.status(500).json({message:"Internal server error"});

}


}

export const uploadPost=async(req,res)=>{
     
    const fileBuffer = req.file.buffer.toString("base64");
    
    try{
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];

if(!fileBuffer){
    return res.status(400).json({message:"Profile picture is required"});
}
if(!token){
    return res.status(400).json({message:"No token"});
}
   const uploadResult = await cloudinary.uploader.upload(
      `data:${req.file.mimetype};base64,${fileBuffer}`,{
        folder:"posts"
      }
    );
   const isValid=jwt.verify(token,process.env.JWT_SECRET);
const user =await User.findById(isValid.userId)

   const post=new Post({
    post_owner:isValid.userId,
    img:uploadResult.secure_url,
fullName:user.fullName,
profilePic:user.profilePic
   })

post.save();
  res.status(201).json({ success: true, message: "Uploaded successfully" });
   
}
catch(error){

    console.log("Error in upload post: ",error.message);
    res.status(500).json({ success: false, message: "Upload failed" });


}

}

export const getPosts=async(req,res)=>{

const { userId }=req.params;

try{

const posts=await Post.find({post_owner:userId});

return res.status(200).json(posts);
}

catch(error){
console.log("Error in get post: ",error.mesage);
res.status(500).json({message:"Internal server error"})
}


}

export const likePost=async(req,res)=>{
const {postId,userId}=req.body;


try{

    const post=await Post.findById(postId);
    const liked= post.likes.includes(userId);
    if(liked){
           post.likes.pull(userId);
   
            post.save();
        return res.status(200).json({success:false});
    }
else{
    
    post.likes.push(userId);
    post.save();
     
    return res.status(200).json({success:true});
}


}catch(error){

    console.log(error.message);
}



}

export const writeComment=async(req,res)=>{
    const {userId,postId,text}=req.body;

    try{

        const post =await Post.findById(postId);
        if(!post){
            res.status(404).json({message:"No post found!"})
        }
   post.comments.push({user:userId,postId,comment:text});
        post.save();

        return res.status(200).json({success:true,message:"Comment done successfully",post});



    }
    catch(error){
        console.log("Error in write comment :",error.message);
        res.status(500).json({message:"Internal server error"});
    }
}

export const loadComments=async(req,res)=>{
    const {postId}=req.body;

    try{

      
        const post=await Post.findById(postId);

        if(!post){
            return res.status(404).json({message:"Post not found!"});

        }

        return res.status(200).json(post.comments);





    }catch(error){
        console.log("Error in load comments: ",error.message);
        return res.status(500).json({message:"Internal server error"});
    }
}
export const findUser=async(req,res)=>{
    const {userId}=req.body;

    try{
        const user=await User.findById(userId);

        if(!user){
            return res.status(404).json({message:"User not found!"});
        }
        res.status(200).json(user);

    }
    catch(error){
        console.log("Error in find user: ",error.message);
        res.status(500).json({message:"Internal server error"});
    }
}