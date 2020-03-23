const contractkit = require("@celo/contractkit");
const NODE_URL = "https://alfajores-forno.celo-testnet.org"; //..TODO: CHANGE THIS TO OUR NODE ADDRESS
const kit = contractkit.newKit(NODE_URL);
const Helper = require("../helper/helper");
const logger = Helper.getLogger("CELO_TRANSACTION_METHODS");
const accounts = require("./account");
// const WalletQueries = require("../scripts/walletQueries");

const MAIN_ACCOUNT = "process.env.MAIN_ACCOUNT";

async function depositFunds(params) {
  console.log("\n================ DEPOSIT FUNDS=================\n");
  const identity = params.account;
  const amount = params.amount;

  const walletAddress = await accounts.getAccount(identity).address;
  const data = {
    account: "MAIN_ACCOUNT",
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
  console.log("\n================ TRANSFER FUNDS=================\n");
  const identity = params.account;
  const amount = params.amount;
  const recipient = params.recipient;
  const type = params.type;

  switch (type) {
    case "Deposit":
      console.log(`${type} payment of ${amount} to ${identity} : ${recipient}`);
      return buyIn(recipient, amount, identity);
    case "Withdraw":
      console.log(`${type} payment of ${amount} to ${identity} : ${recipient}`);
      return buyOut(recipient, amount);
    default:
      console.log(`${type} payment of ${amount} to ${identity} : ${recipient}`);
      return "Invalid transaction type";
  }
}

async function buyIn(recipient, amount, identity) {
  logger.info("Buyin Method");
  // Set up your account in contract kit
  const MainAccountAddress = await accounts.getAccount(identity).address;
  if (!MainAccountAddress) return "Error no account found";

  //check if main account has enough funds
  // const organizationBalance = await accounts.getBalances(identity);
  // if (amount > organizationBalance)
  //   return `Main Account has insufficient Funds ${organizationBalance} to send amount ${amount}`;

  // Get the right token contract
  let contract = await kit.contracts.getStableToken(); //set stable token as cUSD
  const organizationBalance = await contract.balanceOf(MainAccountAddress);

  logger.info(`MAIN ACCOUNT BALANCE ${organizationBalance}`);

  if (amount > organizationBalance)
    return `Main Account has insufficient Funds ${organizationBalance} to send amount ${amount}`;

  console.log("Kit contract is set up, creating transaction");
  return process(recipient, amount, MainAccountAddress, contract);
}

async function buyOut(recipient, amount, identity) {
  // Set up your account in contract kit
  const AccountOwnerWallet = await accounts.getAccount(identity).address;

  //check if main account has enough funds
  // const AccountOwnerWalletBalance = await accounts.getBalances(
  //   AccountOwnerWallet
  // );
  // if (amount > AccountOwnerWalletBalance)
  //   return `User Account has insufficient Funds ${AccountOwnerWalletBalance} to send amount ${amount}`;


  // Get the right token contract
  let contract = await kit.contracts.getStableToken(); //set stable token as cUSD
  const AccountOwnerWalletBalance = await contract.balanceOf(AccountOwnerWallet);

  logger.info(`WALLET ACCOUNT BALANCE ${AccountOwnerWalletBalance}`);

  if (amount > AccountOwnerWalletBalance)
    return `Main Account has insufficient Funds ${AccountOwnerWalletBalance} to send amount ${amount}`;

  console.log("Kit contract is set up, creating transaction");
  return process(recipient, amount, AccountOwnerWallet, contract);
}

async function process(recipient, amount, from, contract) {
  logger.info("PROCESSING ");
  // paid gas in cUSD
  await kit.setFeeCurrency(contractkit.StableToken);
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
