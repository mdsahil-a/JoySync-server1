import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
const dbs=async  ()=>{


    try{
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("MongoDB connected successfully");

    }
    catch(error){
        console.log("Failed to connect : ",error.message);
    }
}


dbs();