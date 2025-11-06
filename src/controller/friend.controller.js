import Friend from "../models/friend.model.js";
import User from "../models/user.model.js";

export const sendFriendRequest=async (req,res)=>{

    try{
        const {senderId,receiverId}=req.body;
        if(senderId===receiverId){
            return res.status(400).json({message:"Cannot send request to yourself"});
        }

const existing = await Friend.findOne({
  sender: senderId,
  receiver: receiverId,
  status:"pending"
});

const alreadyFriend= await Friend.findOne({
  sender: senderId,
  receiver: receiverId,
  status:"accepted"
});
        // const existing=await Friend.findOne({senderId,recieverId});

if(existing){
    return res.status(400).json({message:"Friend request already sent"});
}



const newRequest=new Friend({
    sender:senderId,
    receiver:receiverId,
    status:"pending"
});


await newRequest.save();
res.status(200).json({message:"Friend request sent successfully"});
    }
    catch(error){
        console.log("Error in send friend request controller: ",error.message);
return res.status(500).json({message:"Internal server error"});

    }
}

export const acceptFriendRequest=async (req,res)=>{
    const {requestId}=req.body;


    try{
        console.log(requestId)
        
 const request=await Friend.findById(requestId);
 request.status="accepted";
 request.save();
 console.log(request);

    if(!request){
        return res.status(404).json({message:"Friend request not found"});
    }
    res.json({message:"Friend request accepted",request});
    }
    catch(error){
        console.log("Error in accept friend request controller: ",error.message);
        return res.status(500).json({message:"Internal server error"});
    }
}

export const rejectFriendRequest=async(req,res)=>{
const {requestId}=req.body;
try{
console.log(requestId)
const request=await Friend.findByIdAndUpdate(
    requestId,
    {status:"rejected"},
    {new:true}
);

if(!request){
    return res.status(404).json({message:"Friend request not found"});
}

res.json({message:"Friend request rejected"});
}
catch(error){
return res.status(500).json({message:"Internal server error"});
console.log("Error in reject friend request controller: ",error.message);
}


}

export const getFriendList=async (req,res)=>{

    const userId=req.params.userId;


    try{

        
const friends=await Friend.find({
    $or:[
        {sender:userId,status:"accepted"},
        {receiver:userId,status:"accepted"}
    ]
}).populate("sender receiver","fullName email profilePic");


res.json(friends);

    }

    catch(error){
console.log("Error in get friend list controller: ",error.message);
return res.status(500).json({message:"Internal server error"});

    }
}
 
export const getPendingRequest=async (req,res)=>{
    const userId=req.params.userId;

    try{
const requests=await Friend.find({
    receiver:userId,
    status:"pending",

}).populate("sender","fullName");

res.json(requests);
    }
    catch(error){

        console.log("Error in get pending request controller: ",error.message);
        return res.status(500).json({message:"Internal server error"});
        

    }
}

export const searchUsers=async (req,res)=>{
const name=req.body.name;

try{
    if(!name){
        return res.status(400).json({message:"Name is required"});
    }
    const users=await User.find({
        fullName:{$regex:name,$options:"i"}
    });
    if(!users){
        return res.status(404).json({message:"User not found"});
    }
res.json(users);
}
catch(error){
    console.log("Error in search users controller: ",error.message);
    return res.status(500).json({message:"Internal server error"});
    
}

}

export const deleteFriend=async(req,res)=>{
const {userId,friendsId}=req.body;


try{
    
    const deletedFriend = await Friend.findOneAndDelete({
      $or: [
        { sender: userId, receiver: friendsId, status: 'accepted' },
        { sender: friendsId, receiver: userId, status: 'accepted' }
      ]
    });

    if (!deletedFriend) {
      return res.status(404).json({ message: 'Friendship not found' });
    }

    res.status(200).json({ message: 'Friend removed successfully' });

}catch(error){
console.log("Error in deletefriends: ",error.message);
    return res.status(500).json({message:"Internal server error"});
}


}