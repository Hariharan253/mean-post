const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

router.post("/signup", (req, res, next) => {

    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        const user = new User({
            email: req.body.email,
            password: hash
        });

        user.save()
        .then(result => {
            console.log("result: ", result);
          return res.status(201).json({
            "message": result
          })  
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({
                error: err
            });
        })
    })
});

router.post("/login", (req, res, next) => {
    
    let userData = {
        "email": "",
        "_id": ""
    };
    User.findOne({email: req.body.email})
    .then(user => {
        
        if(!user)
            return res.status(401).json({"message": "Auth Failed"});
        userData = user;
        return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
        
        if(!result) {
            return res.status(401).json({"message": "Auth Failed"});
        }

        const token = jwt.sign
        (
            {email: userData.email, userId: userData._id},
            "secret_this_should_be_longer",
            {
                expiresIn: "1h"
            }
        );
        
        return res.status(200).json({
            token: token, 
            expiresIn: 3600,
            userId: userData._id //passing the userId to the front end so that we can persist the userData like token and expiresIn and make UI changes
        })
    })
    .catch(err => {
        console.log("Auth Error", err);
        return res.status(500).json({"message": "Auth Failed"})
    })
});

module.exports = router;