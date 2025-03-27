const Candidate = require("../models/candidate");
const bcrypt = require("bcrypt")
const {jwtAuthentication,generateToken} = require("../jwt")
const mongoose = require("mongoose")
const User = require("../models/user")


async function checkAdminRole(userId){
    try {

        const user = await User.findById(userId)
        return user.role === 'admin'
        
    } catch (error) {
        console.log(error);

        return false
        
    }
}





async function handleCreateNewCandidate(req, res) {
    try {
        // User exists check & Admin role check
        if (!req.user || !await checkAdminRole(req.user.id)) {
            return res.status(403).json({ message: "User does not have admin role" });
        }

        // Get request body data
        const data = req.body;
        const newCandidate = new Candidate(data);

        // Save new candidate data
        const response = await newCandidate.save();
        // console.log("New data saved successfully");

        // Generate token
        const payload = { id: response.id };
        console.log("Payload:", JSON.stringify(payload));

        const token = await generateToken(payload);
        console.log("Generated token:", token);

        // Success response
        return res.status(200).json({ message:"cadidate data saved sucessfully",response});

    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
}



async function handleUpdateCandidate(req,res){

    try {

        if(! await checkAdminRole(req.user.id)){
            return res.status(403).json({message:"user has not adimin role"})
        }
    
        const candidateId= req.params.candidateID;
        const updatedCandidateData = req.body;


        const response = await Candidate.findByIdAndUpdate(candidateId, updatedCandidateData,{
            new:true,
            runValidators:true
        });


        if(!response){
            return res.status(404).json({message:"candidate not found"});
        }

        return res.sta
    
       
        
    } catch (error) {
        console.log(error);
        res.status(404).json({msg:"invalid"})
    } 

}


async function handleDeleteCadidate(req,res) {

    try {

        if(!await checkAdminRole(req.user.id)){
            return res.status(403).json({message:"user has not adimin role"})
        }
      

        const candidateId= req.params.candidateID;
        

        const response = await Candidate.findByIdAndUpdate(candidateId);


        if(!response){
            return res.status(404).json({message:"candidate not found"});
        }

        return res.status(200).json({message:"Deleted sucessfully",deletedData:response})
    
       
        
    } catch (error) {
        console.log(error);
        res.status(404).json({msg:"invalid"})
    } 
    
    
}


module.exports = {handleCreateNewCandidate,handleDeleteCadidate,handleUpdateCandidate}



