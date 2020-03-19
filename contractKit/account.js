
//const Web3= require('web3');
//import Web3 from 'web3';

const contractkit  = require('@celo/contractkit') 
// const web3 = require('web3')
// define localUrl and port with the ones of your node
const localUrl = "52.10.248.99"
const port = "8545"
// const kit = newKit(`${localUrl}:${port}`)
const kit = contractkit.newKit('https://alfajores-forno.celo-testnet.org')
const web3 = kit.web3
// const web3 = new Web3('https://alfajores-forno.celo-testnet.org')

//  let ll = web3.eth.getBalance(someAddress)
// console.log(ll)
// const web3 = require("web3");
// const fs = require("fs");
// const web3Instance = new web3();

const SECRET_PATH = ".secret";

/*
 * ACCOUNTING SCRIPT
 * DEPOSIT -> WE CREATE A CELO_USER_WALLET
 * STORES INFO OF THE USER.
 *
 * USERNAME      | AMOUNT    | CREATEDDATE   | ACCOUNT
 * Account_owner    1000        12-09-2020      "username"    {username / phone / wallet_address}
 *
 *
 * DEPOSIT -> WE CREATE A CELO_USER_WALLET_LOGS
 * STORES INFO OF THE TRANSACTION.
 *
 * TRANSID | ACCOUNT TYPE | TRANSTYPE | AMOUNT | BALANCE  | TIMESTAMP    | USERNAME       |    ACCOUNT
 * 0001        MPESA        Deposit      1000      1000      12-09-2020     Account_owner          "username"    {username / phone / wallet_address}
 *
 *
 *TRANSFER -> CELO_USER_WALLET_LOGS
 *
 * TRANSID |  ACCOUNT TYPE | TRANSTYPE | AMOUNT | BALANCE |TIMESTAMP    | USERNAME        | ACCOUNT
 * 0001         cUSD          Transfer    1000       0      12-09-2020    Account_owner          "wallet_address"
 *
 *WITHDRAWAL -> CELO_USER_WALLET_LOGS
 *
 * TRANSID |  ACCOUNT TYPE | TRANSTYPE  | AMOUNT | BALANCE |TIMESTAMP    | USERNAME        | ACCOUNT
 * 0001         MPESA         Withdrwal    1000       0      12-09-2020    Account_owner          "phone"
 */

/**
 * TODO: CREATE WALLET ACCOUNT ON SIGN UP
 */
async function createAccount() {
  //console.log("Creating a new account");
  // const account = web3.eth.personal.newAccount('!@superpassword');
  // console.log(`Made new account ${account}`);
  // personal = web3.eth.personal
  // console.log(await web3.eth.getBalance('0xb51124ef4e3495a4063601027cd629bf6493ee7e'))
  console.log(await web3.web3.rpc.getModules())
  // web3.eth.personal.importRawKey("cd3376bb711cb332ee3fb2ca04c6a8b9f70c316fcdf7a1f44ef4c7999483295e", "password1234")
  // .then(console.log);
  //.then(console.log);
  //fs.writeFileSync(identity, account.privateKey);
  //console.log(`Account private key saved to ${}`);
  // return account;
}

/**
 * TODO: FETCH WALLET ACCOUNT ON SIGN IN
 */
function getAccount(identity) {
  console.log("Getting your account");
  if (!fs.existsSync(identity)) {
    console.log("No account found, create one first");
    return false;
  }

  const privateKey = fs.readFileSync(identity, "utf8");
  const account = web3Instance.eth.accounts.privateKeyToAccount(privateKey);
  console.log(`Found account ${account.address}`);
  return account;
}

async function getBalances(identity) {
  console.log("Getting your balances");
  const address = getAccount(identity).address;
  if (!address) return "Invalid identity or no account exists";

  const balances = await kit.getTotalBalance(address);
  console.log(`Dollar balance: ${balances.usd}`);
  console.log(`Gold balance: ${balances.gold}`);
  kit.stop();
  return balances.usd;
}
createAccount()

module.exports = {
  createAccount,
  getAccount,
  getBalances
};
