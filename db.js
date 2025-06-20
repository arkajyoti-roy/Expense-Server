// import mongoose from "mongoose";
const mongoose = require("mongoose");
const connectDB = async () =>{
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Db Connected');
    } catch (error) {
        console.log(error);
        
    }
}
module.exports = connectDB;