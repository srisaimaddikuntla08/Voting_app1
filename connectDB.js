const dotenv = require("dotenv")
dotenv.config();
const mongoose = require("mongoose");

async function connectDB(uri) {

await mongoose.connect(uri);
    
};


module.exports = {connectDB}