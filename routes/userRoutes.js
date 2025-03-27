const express = require("express");
const router = express.Router();
const{handleUserData,handleUserCreate,handleUserProfile,handleUserLogin,handleUpdatePassword} =require("../controllers/user");
const { generateToken,jwtAuthentication} = require("../jwt");

//UserRoutes
router.get("/",handleUserData)
router.post("/signup",handleUserCreate)
router.post("/login",handleUserLogin)
router.get("/profile",[jwtAuthentication],handleUserProfile)
router.patch("/profile/password",[jwtAuthentication],handleUpdatePassword)




   

  

module.exports = router;

