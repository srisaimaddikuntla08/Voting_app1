require('dotenv').config();
const jwt = require("jsonwebtoken");

function jwtAuthentication( req,res,next) {
    const authHeader = req.headers.authorization;
    console.log("Auth Header: ", authHeader); // Debugging purpose

    if (!authHeader || !authHeader.startsWith("Bearer")) {
        return res.status(401).json({ error: "Access Denied: No token provided" });
    }

    const token = authHeader.split(" ")[1];
    try {

        const decoded=  jwt.verify(token,process.env.JWT_SECRET);
 
        req.user = decoded;
        next();
        
    } catch (error) {
        console.log(error)
        res.status(404).json({msg:"Inavlid token"})
        
    }
    
}
function generateToken(userData) {
    return jwt.sign(userData,process.env.JWT_SECRET,{expiresIn:30000});
}


module.exports = {jwtAuthentication,generateToken}