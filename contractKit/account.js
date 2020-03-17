const web3 = require("web3");
const fs = require("fs");
const web3Instance = new web3();

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
function createAccount(identity) {
  console.log("Creating a new account");
  const account = web3Instance.eth.accounts.create();
  console.log(`Made new account ${account.address}`);
  fs.writeFileSync(identity, account.privateKey);
  console.log(`Account private key saved to ${identity}`);
  return account;
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

module.exports = {
  createAccount,
  getAccount,
  getBalances
};
