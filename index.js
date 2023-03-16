const express = require("express");
const port = process.env.PORT || 8080;
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser") // we use this to use the req body data in middleware
const userRoutes = require("./routers/user") 
const offerRoutes = require("./routers/offer")

mongoose.connect("mongodb://localhost:27017/user").then(()=>{
    console.log("Connected to mogodb successfully....")
}).catch((err)=>{
    console.log("failed to connect with mongodb..." + err)
})
app.use(bodyParser.json());

app.listen(port, ()=>{console.log(`Searver is running on port ${port}`)})

app.use("/user" , userRoutes)
app.use("/offer", offerRoutes )