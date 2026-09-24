const mongoose = require('mongoose');

const connectDB = async () =>{
    try {
        await  mongoose.connect("mongodb://127.0.0.1:27017/file_upload")
        console.log("Mongodb connected successfully")
    } catch (error) {
        console.log("Connection Error", error.message);
        process.exit(1);
    }
};

module.exports = connectDB;