const mongoose = require('mongoose');
require('dotenv').config() ;

const connectDb = async()=>{
    try {
        console.log(process.env.MONGODB_URI)
        await mongoose.connect(process.env.MONGODB_URI, {
        });
        console.log("Database connected successfully");
    } catch (error) {
        console.log("Error while connecting to the database : ", error.message);
    }
}

module.exports = { connectDb };  