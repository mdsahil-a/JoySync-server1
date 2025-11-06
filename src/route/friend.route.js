import express from 'express';
import {acceptFriendRequest, getPendingRequest ,sendFriendRequest,searchUsers, rejectFriendRequest, getFriendList,deleteFriend} from '../controller/friend.controller.js';

const friendRoute=express.Router();



friendRoute.post("/sendRequest",sendFriendRequest);

friendRoute.post("/requests/:userId",getPendingRequest);

friendRoute.post("/accept",acceptFriendRequest);

friendRoute.post("/reject",rejectFriendRequest);

friendRoute.post("/search",searchUsers);

friendRoute.post("/list/:userId",getFriendList);

friendRoute.post("/deleteFriend",deleteFriend);

export  default friendRoute;