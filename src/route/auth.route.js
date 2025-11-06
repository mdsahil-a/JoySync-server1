import express from 'express';
import User from '../models/user.model.js';
import {login, signup, logout, updateProfile,checkAuth,uploadPost,getPosts,likePost,writeComment,loadComments,findUser} from '../controller/auth.controller.js';
 import multer from "multer";
import {protectRoute} from  '../middleware/auth.middleware.js';
import Friend from '../models/friend.model.js';

const storage = multer.memoryStorage();
const upload = multer({storage});

const authRoute=express.Router();


 

authRoute.post("/login",login);

authRoute.post("/signup",signup);

authRoute.post("/logout",logout);

 authRoute.post("/profile-update",upload.single("image"),updateProfile);

 authRoute.post("/upload-post",upload.single("image"),uploadPost);

 authRoute.post("/checkAuth",protectRoute,checkAuth);

 authRoute.get("/getPosts/:userId",getPosts);
 authRoute.post("/likePost",likePost)
 authRoute.post("/writeComment",writeComment);
 authRoute.post("/loadComments",loadComments);
authRoute.post("/findUser",findUser);



export default authRoute;

