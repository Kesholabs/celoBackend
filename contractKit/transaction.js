const contractkit = require("@celo/contractkit");
const NODE_URL = "https://alfajores-forno.celo-testnet.org"; //..TODO: CHANGE THIS TO OUR NODE ADDRESS
const kit = contractkit.newKit(NODE_URL);
const Helper = require("../helper/helper");
const accounts = require("./account");
// const WalletQueries = require("../scripts/walletQueries");

async function depositFunds(params) {
  console.log("\n================ DEPOSIT =================\n");
  const identity = params.account;
  const amount = params.amount;

  const walletAddress = await accounts.getAccount(identity).address;
  const data = {
    recipient: walletAddress,
    amount: amount,
    type: "Deposit"
  };
  return transferFunds(data);
}

async function withdrawFunds(params) {
  console.log("\n================ WITHDRAW =================\n");
  if (balance < params.amount) return "Account has Insufficient balance";
}

async function transferFunds(params) {
  console.log("\n================ TRANSFER =================\n");
  const identity = params.account;
  const amount = params.amount;
  const recipient = params.recipient;
  const type = params.type;

  switch (type) {
    case "Deposit":
      console.log(`${type} payment of ${amount} to ${recipient}`);
      return buyIn(recipient, amount);
    case "Withdraw":
      return buyOut(recipient, amount);
    default:
      return;
  }
}

async function buyIn(recipient, amount) {
  // Set up your account in contract kit
  const mainAccount = await accounts.getAccount("_MainAccount").address;

  //check if main account has enough funds
  const organizationBalance = await accounts.getBalances("_MainAccount");
  if (amount > organizationBalance)
    return `Main Account has insufficient Funds ${organizationBalance} to send amount ${amount}`;

  // Get the right token contract
  let contract = await kit.contracts.getStableToken();
  console.log("Kit contract is set up, creating transaction");
  return process(recipient, amount, mainAccount);
}

async function buyOut() {}

async function process(recipient, amount, from) {
  // Create the payment transaction
  const tx = await contract.transfer(recipient, amount).send({ from: from });

  const hash = await tx.getHash();
  console.log("Hash receipt recieved", hash);
  const receipt = await tx.waitReceipt();
  console.log("Tx receipt recieved", receipt);

  const newOrganizationBalance = await contract.balanceOf(from);
  const newBalance = await contract.balanceOf(recipient);
  console.log(`New Receipt balance is ${newBalance.toString()}`);
  console.log(
    `New Oganization balance is ${newOrganizationBalance.toString()}`
  );
  kit.stop();

  return {
    hash: hash,
    receipt: receipt,
    organizationBalance: newOrganizationBalance,
    wallet: recipient,
    walletBalance: newBalance
  };
}

module.exports = {
  transferFunds,
  withdrawFunds,
  depositFunds
};

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
