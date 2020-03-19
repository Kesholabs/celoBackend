
const express = require('express');
const jwt = require('jsonwebtoken');
const config = require('../config/env_config/config');
const User = require('../models/users.model')


const authClientToken = async (req,res,next) => {

   // let token = req.headers['x-access-token'];
    const token = req.header('Authorization').replace('Bearer', '').trim()
    if (!token){
        return res.status(401).json({
            "errors" : [{
                "msg" : " No token provided"
            }]
        });
    } 
    
    try {
       
        const decoded  = jwt.verify(token, config.secret)
       
        const user  = await User.findOne({ _id:decoded.id})
        //console.log(user)
        if(!user){
            throw new Error()
        }
        req.token = token
        req.user = user
        next()
    } catch (error) {
        console.log(error)
        res.status(401).send({error:'Please authenticate!'})
    }
}
module.exports = {
    authClientToken:authClientToken
}
