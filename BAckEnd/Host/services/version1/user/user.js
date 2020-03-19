const express = require('express')
const web3 = require("web3");
const fs = require("fs");
const web3Instance = new web3();

const register = async (req,res,next) => {
   const identity = req.body.phoneNumber
    try {
        console.log("Creating a new account");
        const account = web3Instance.eth.accounts.create();
        console.log(`Made new account ${account.address}`);
        fs.writeFileSync(identity, account.privateKey);
        console.log(`Account private key saved to ${identity}`);
        
            if(!account){
                throw new error()
            }
            res.status(200).json({
                Message:"success",
                details:{
                    "message":"success",
                    "Account address":account.address
                }
            })
            
       

       
        
    } catch (error) {
        console.log(error)
        return res.status(500).json(
            { 
                "errors" : [{
                    "msg": "there was a problem registering a user."   
                }]
            }
        );
    }
}



module.exports = ({
    register:register,
    
})