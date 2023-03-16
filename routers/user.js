const express = require("express");  // it makes it easier to work our application
const router = express.Router()   // we can run our objects on diff. routers
const {user} = require("../schemas/userScheama")
const bcrypt = require("bcrypt")
const salt = 10;
const jwt = require("jsonwebtoken");
const SECREAT_CODE = "alsjdfadsfdfskl"

router.post("/signup", async (req, resp)=>{
    // create a user in db
    // to create a use we need a schemas
    // on FE we require username password email mobile
    // when user going to enter password it is good to encrypt it then store in BE -> bycrypt
    bcrypt.genSalt(salt, (saltErr, saltVal)=>{
        if(saltErr){
            resp.status(401).send("Unable to process..Salt")
        }else{
            bcrypt.hash(req.body.password, saltVal, (hashErr, hasVal)=>{ // success & catch
                if(hashErr){
                    resp.status(401).send("Unable to process..passHashVal")
                }else{
                    user.create({
                        username:req.body.username,
                        password: hasVal,
                        email:req.body.email | "",
                        mobile:req.body.mobile | ''
                    }).then((user)=>{
                        resp.status(200).send(user)
                    }).catch((err)=>{
                        resp.status(400).send(err.message)
                    })
                }
            })
        }
    });
})

router.post("/signin", async (req, resp)=>{
    // read a user from db
    // usrname and password
    // user exit or not 
    // verify the password and genreate token
    user.findOne({username:req.body.username}).then((user)=>{
        if(!user){
            resp.status(401).send("User not exist !..")
        }else{
            if(!bcrypt.compareSync(req.body.password, user.password)){ // comparing password
                resp.status(401).send("Invalid password")
            }else{
                const token = jwt.sign({id: user._id, username: user.username}, SECREAT_CODE)
                resp.status(200).send({message:"Use Logged in successfully ",token:token})
            }
        }
    }).catch(()=>{

    })
})

module.exports = router