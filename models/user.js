const mongoose = require("mongoose");

const userSchema  = new mongoose.Schema({
    age:{
        type:Number,
        required:true
    },
    mobile:{
        type:String,
    },
    email:{
        type:String,
        required:true,
    },
    username:{
        required:true,
        type:String,
    },
    password:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    aadharNumber:{
        type:Number,
        required:true,
        unique:true

    },
    role:{
        type:String,
        enum:["admin","voter"],
        default:"voter"
    },
    isVoted:{
        type:Boolean,
        default:false
    }
})

const User = mongoose.model("User",userSchema);

module.exports =  User