import express from 'express';
import dotenv from 'dotenv';
import authRoute from './route/auth.route.js';
import connectDB from './lib/db.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import friendRoute from './route/friend.route.js';
const portNum=process.env.PORT;


dotenv.config();
const app=express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());


app.use('/api/auth',authRoute);
app.use('/api/friends',friendRoute);







                             

app.listen(portNum,()=>{

    console.log("Server is running at : http://localhost:"+portNum);
    connectDB();

});































// import express from 'express';
// import dotenv from 'dotenv';
// import authRoute from './route/auth.route.js';
// import connectDB from './lib/db.js';

// dotenv.config();

// const app=express();

// const PORT=process.env.PORT;

// app.use("/api/auth",authRoute);


// connectDB();


// app.listen(PORT,()=>{
//     console.log("Server is running at: http://localhost:"+PORT);


// })



///to run Server
//to access env file