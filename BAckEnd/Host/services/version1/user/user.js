const express = require('express')

const register = async (req,res,next) => {
    let errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(422).json({ errors: errors.array() });
    }
    let {name,email,password} = req.body
    let emailExists = await userModel.findOne({"Email":email})

    if(emailExists){
        return res.status(500).json({
            Message:"failed Email already exists"
        })
    }
    let hashedPassword = await bcrypt.hash(password, 8);
    try {
        let wallet = new ethers.Wallet.createRandom()
        let encryptPromise = wallet.encrypt(password)
        encryptPromise.then(function(json) {
            let user =  userModel.create({
                Name:name,
                Email:email,
                Password:hashedPassword,
                Wallet:json               
            })
            if(!user){
                throw new error()
            }
            res.status(200).json({
                Message:"success",
                details:{
                    "name":name,
                    "Email":email
                }
            })
            
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

const login = async (req,res,next) => {

    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(422).json({ errors: errors.array() });
    }

    let { email, password } = req.body

    try{
        let isUserExists = await userModel.findOne({"Email" : email});
        // console.log(isUserExists.Password)
        let isPasswordValid = await bcrypt.compare(password, isUserExists.Password);

        if(!isUserExists || !isPasswordValid){
            return res.status(401).json({
                "errors" : [{
                    "msg" : "email/password is wrong"
                }]
            })
        }

        let token = jwt.sign({ id: isUserExists._id }, config.secret, { expiresIn: 86400 });

        res.status(200).json({
            "success" : [{
                "msg" : "user login successfully",
                "email" : email,
                "token" : token
            }]
        })
    }catch(error){
        console.log(error);
        return res.status(500).json(
            { 
                "errors" : [{
                    "msg": "there was a problem login a user."   
                }]
            }
        );
    }
    
}

module.exports = ({
    register:register,
    login:login
})