const rest = artifacts.require('Restv1')

contract ('mpesa rest api test',async (accounts)=>{
    it('should store queue ', async () =>{
       let restc =  await rest.deployed()
       await restc._push("00","88")
       await restc._push("00","88",{from:accounts[9]})
       let y = await restc.Queuemap(accounts[0])
       let x = await restc.queueArray(0)
       console.log(x)
       await restc._callback(accounts[0],"6")
       let p = await restc.Queuemap(accounts[0])
       //console.log(p)
        let z = await restc.queueArray(0)
        console.log(z)
    })
})