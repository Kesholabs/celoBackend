const express = require('express')
const BufferList = require('bl/BufferList')
const ethers = require('ethers')
const {contract,provider} = require('../../../config/env_config/contract_config')
const ipfs = require('ipfs-http-client')
// http://localhost:5001
const ipfsClient =ipfs('https://ipfs.infura.io:5001')


const uploadContent = async(req,res,next) => {
    const ww = req.user.Wallet 
    const wallet = await ethers.Wallet.fromEncryptedJson(ww,req.body.password)
    
   console.log(wallet.privateKey)

    if(!wallet){
        res.status(500).json({
            message:{
                error:"failed to load wallet"
                
            }
        })
    }
    try {
        let Wallet1 = new ethers.Wallet(wallet.privateKey, provider);

        let contractSigner = contract.connect(Wallet1)
        let  resultw = null
        for await (const result of ipfsClient.add(Buffer.from(JSON.stringify(req.body)))) {
            resultw= result.path
            //await tx.wait()
            console.log(tx)
            
        }
        let tx = await contractSigner.update(33309139,resultw)
        res.status(200).json({
            message:"success",
            txHash :tx.hash,
            // contentHash:result.path
        })
    } catch (error) {
       console.log(error) 
       res.status(401).json({
           message:"failed",
           Error:error.responseText

       })
    }
    
    
};
const fetch_data = async (req,res,next) =>{
    try {
        let data = await contract.data(33309139)
        //console.log(data[0])
        let Data_Array = []
       
        for (var i=0; i< data.length;i++){
            //console.log(data[i])
            for await (const file of ipfsClient.get(data[i])) {
                //console.log(file.path)
              
                const content = new BufferList()
                for await (const chunk of file.content) {
                  content.append(chunk)
                }
              
                let d = content.toString()
                let dd = {}
                dd =JSON.parse(d)
                dd['contentHash'] = data[i]
                Data_Array.push(dd)
                
            }  

        }
        res.status(200).json({
            data : Data_Array
        })
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    uploadContent:uploadContent,
    fetch_data:fetch_data
}
