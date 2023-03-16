const express = require("express");
const router = express.Router();
const {offer} = require("../schemas/offerSchema");
const jwt = require("jsonwebtoken");
const SECREAT_CODE = "adfvjakldfjll";


const getUserByToken = (token) =>{
    return new Promise((resolve, reject)=>{
        if(token){
            let userData
            try{
                userData = jwt.verify(token, SECREAT_CODE);
                resolve(userData)
            }catch(err){
                reject("Invalid Token..")
            }
        }else{
            reject("Token Not found...")
        }
    })
}

router.post("/list",async(req, resp)=>{
    const validOffers = []
    offer.find().then((offers)=>{
        console.log(offers, "offer list");
        offers.filter((offer)=>{
            const rules = offer.split("and")
            // ['age < 30', 'instead_days < 5']
            console.log(rules)
            rules.forEach((rule)=>{
                let ruleKey = {}
                if(rule.includes(">")){
                    ruleKey = {key: rule.trim().split(">")[0].trim(), value: parseInt(rule.trim().split(">")[1])}
                    if(req.body[ruleKey.key] > ruleKey.value){
                        validOffers.push(offer)
                    }
                }else{
                    ruleKey = {key: rule.trim().split("<")[0], value: rule.trim().split("<")[1]}
                    if(req.body[ruleKey.key] < ruleKey.value){
                        validOffers.push(offer)
                    }
                }

            })
            resp.status(200).send(validOffers);
            // if(rule[0].contains(">")){

            // }else{
                
            // }
            // const validAge = rule[0].split(">")
        })
    }).catch((err)=>{
        resp.status(500).send("Internal Servar Error")
    })
})

router.post("/create", async(req, resp)=>{
    // find a user
    getUserByToken(req.headers.authorization).then((user)=>{
        //create a offer based on the user
        offer.create({...req.body, username: user.username}).then((offer)=>{
            resp.status(200).send(offer)
        }).catch((err)=>{
            resp.status(400).send({message: err.message})
        })
        //resp.status(200).send(user)
    }).catch((err)=>{
        resp.status(400).send(err)
    })
})

router.put("/update", async (req, resp)=>{
    offer.updateOne({})
})

router.delete("/delete", async(req, resp)=>{
    offer.deleteOne({_id: req.body.id})
})


module.exports = router;