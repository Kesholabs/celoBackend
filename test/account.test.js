const Accounts = require("../contractKit/account");

describe("Accounts",()=>{

    it("Should create private keys",()=>{
        const username = "0712345678"
        expect(Accounts.createAccount(username)).not.toBeNull()
    })

    it("Should return wallet address",()=>{
        const username = "0712345678"
        expect(Accounts.getAccount(username)).not.toBeNull()
    })

    it("Should return wallet address",()=>{
        const username = "0712345678"
        expect(Accounts.getBalances(username)).not.toBeNull()
    })
})