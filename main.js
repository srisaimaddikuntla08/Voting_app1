const dotenv = require("dotenv")
dotenv.config();
const express = require('express');
const app = express();
const PORT =process.env.PORT||5000;
const {connectDB} = require("./connectDB")
const bodyParser = require("body-parser")
const userRoutes = require("./routes/userRoutes")
const candidateRoutes = require("./routes/candidateRoutes")
const {jwtAuthentication} = require("./jwt")


//connect MongoDB
connectDB(process.env.MONGO_URL)
.then(()=>console.log("connected DB"))


app.use(bodyParser.json());
app.use(express.urlencoded({extended:false}))


app.use("/user",userRoutes);
app.use("/candidate",candidateRoutes)



app.listen(PORT,(req,res)=>{
    console.log(`server running on port: ${PORT}`)
})

