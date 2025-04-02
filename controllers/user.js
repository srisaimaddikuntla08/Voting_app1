const User = require("../models/user");
const bcrypt = require("bcrypt")
const {jwtAuthentication,generateToken} = require("../jwt")
const mongoose = require("mongoose")



async function handleUserData(req,res){
    try{
        const data  =  await User.find();
        res.status(200).json(data);
       }catch(err){
        console.log(err)
     }
     
}


//creating User 
async function handleUserCreate(req, res) {
    const body = req.body;
    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(body.password, 10);
        // Create new person
        const response = await User.create({
            age: body.age,
            mobile:body.mobile,
            email: body.email,
            username: body.username,
            password: hashedPassword,
            address:body.address,
            aadharNumber:body.aadharNumber,
            role:body.role,
            isVoted:body.isVoted
        });
       
        // Respond with success message and token
        res.status(201).json({ msg: "Success", response: response,});
    }catch (err) {
        console.error("Error creating user:", err);
        // Handle MongoDB duplicate key error (E11000)
        if (err.code === 11000) {
            return res.status(400).json({ error: "Email or AadharNumber already exists" });
        }

        res.status(500).json({ error: "Error creating person" });
    }



}

async function handleUserLogin(req,res){

    try{
    const {aadharNumber,password} = req.body;

    const user = await User.findOne({aadharNumber:aadharNumber})

    if(!user||!(await bcrypt.compare(password,user.password))){
        return res.status(404).json({err:'invalid aadharNumber or password'})
    }
        const payload = {
            id:user.id,
        }

        const token = generateToken(payload)
        res.json({token})
    }catch(err){
        console.log(err);
        res.status(400).json({msg:"internal error of server"})
    }


}





async function handleUserProfile(req,res){
     try{
          const userData = req.user;
        //   console.log(userData)
          const userId = userData.id;
        //   console.log(userId)
          const user = await User.findById(userId)
        //   console.log(user)
          res.status(200).json({user})
        }catch(err){        
                console.log(err)
                res.status(400).json({msg:"internal server error"})
        }
}

async function handleUpdatePassword(req,res){

    try {
        const userId= req.user.id;  //extract the user from token
        console.log(userId)
        const {currentPassword,newpassword} = req.body

        // Ensure the userId is a valid ObjectId before querying
        const user = await User.findById({userId})

        if(!(await bcrypt.compare(currentPassword,user.password))){
            return res.status(404).json({err:'invalid password'})
        }

        const hashedNewPassword = await bcrypt.hash(newpassword,10);

        user.password = hashedNewPassword;
         
        await user.save();

        console.log("password updated")

        return res.status(200).json({message:"password Updated"})
        
    } catch (error) {
        console.log(error);
        res.status(404).json({msg:"invalid"})
    } 

}

module.exports= {handleUserData,handleUserCreate,handleUserLogin,handleUserProfile, handleUpdatePassword}

