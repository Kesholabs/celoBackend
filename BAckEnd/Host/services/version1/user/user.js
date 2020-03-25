// import { getAccount } from '../../../../../contractKit/account';
const express = require('express')
const Web3 = require("web3");
const fs = require("fs");
const web3Instance = new Web3();
const { newKit, CeloContract } =require('@celo/contractkit')


const kit = newKit('https://alfajores-forno.celo-testnet.org')

const web3 = kit.web3


// api/v1/user/register
const register = async (req,res,next) => {
   const identity = req.body.phoneNumber
   if (fs.existsSync(identity)) {
    console.log(" account found, cannot create another one ");
    return res.status(500).json({
        Message:"failed User already exists"
    });
  }
    try {
        console.log("Creating a new account");
        const account = web3Instance.eth.accounts.create();
        console.log(`Made new account ${account.address}`);
        fs.writeFileSync(identity, account.privateKey);
        console.log(`Account private key saved to ${identity}`);
        
        if(!account){
            throw new error()
        }
        let cc = await transfer('956')
        // console.log(cc)
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

// api/v1/user/getAddress
const getAccount = async (identity) => {
    try {
        console.log("Getting your account");
        if (!fs.existsSync(identity)) {
            console.log("No account found, create one first");
            throw new error()
            // return false;
        }
        const privateKey = fs.readFileSync(identity, "utf8");
        const account = web3Instance.eth.accounts.privateKeyToAccount(privateKey);
        console.log(`Found account ${account.address}`);
        return account;
    } catch (error) {
        console.log(error)
    }
}

// api/v1/user/transfer

const transfer =async (identity) => {
    let acc = await getAccount(identity)
    console.log(acc.address)
    kit.addAccount(acc.privateKey)
    const accounts = await kit.web3.eth.getAccounts();
    console.log(accounts)
    await kit.setFeeCurrency(CeloContract.StableToken)
    const stabletoken = await kit.contracts.getStableToken()
    const token = await kit.contracts.getGoldToken()
    const oneGold = kit.web3.utils.toWei('1', 'ether')
    // console.log(stabletoken)
    const tx = await stabletoken.transfer('0xA14da6817a9A4e25444969DFeAd9BdEDbB8408fB',oneGold).send({
        from: acc.address,
        gasPrice: 10000000000
      })
      const receipt = await tx.waitReceipt()
      console.log(tx)
      console.log(receipt)
    // const goldtoken = await kit._web3Contracts.getGoldToken()
    

    // const txo = await goldtoken.methods.transfer('0xA14da6817a9A4e25444969DFeAd9BdEDbB8408fB', oneGold)
    // const tx = await kit.sendTransactionObject(txo, { from: acc.address, gasPrice: 10000000000 })
    // const hash = await tx.getHash()
    // console.log(tx)
    // const receipt = await tx.waitReceipt()
    // console.log(receipt)
}

module.exports = ({
    register:register,
    getAccount:getAccount
})