const api = artifacts.require('Restv1')

const Web3 = require('web3')

web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:9545"))

contract("api",async accounts =>{
    // let Api = await api.deployed()
    it("allows users to post request", async () =>{
        let Api = await api.deployed()

        let tx = await Api.deposit(254724341383,10 ,{from:accounts[1]})
        console.log(tx.receipt.rawLogs)
        // let tx = await Api.withdraw({from:accounts[1],value:1000000000000000})
    //    console.log(tx)

    })
    it("allow withdrawal ", async ()=>{
        let Api = await api.deployed()
       let tx = await Api.withdraw()
       console.log(tx)
    })
})
