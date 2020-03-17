const contractkit = require("@celo/contractkit");
const NODE_URL = "https://alfajores-forno.celo-testnet.org"; //..TODO: CHANGE THIS TO OUR NODE ADDRESS
const kit = contractkit.newKit(NODE_URL);
const Helper = require("../helper/helper");
const WalletQueries = require("../scripts/walletQueries");
const accounts = require("./account");

async function depositFunds(params) {
  console.log("\n================ DEPOSIT =================\n");
  const celoUserWallet = await WalletQueries.fetchUserWallet(params.account);
  const transID = Helper.setTranstype("Deposit");
  const newBalance = celoUserWallet.balance + params.amount;
  const data = {
    transID: transID,
    username: params.username,
    account: params.account,
    amount: params.amount,
    balance: newBalance,
    transType: "Deposit",
    accountType: "MPESA"
  };
  return WalletQueries.updateUserWalletLogs(data);
}

async function withdrawFunds(params) {
  console.log("\n================ WITHDRAW =================\n");
  const celoUserWallet = await WalletQueries.fetchUserWallet(params.account);
  const balance = celoUserWallet.balance;
  if (balance < params.amount) return "Account has Insufficient balance";

  const newBalance = celoUserWallet.balance - params.amount;
  const transID = Helper.setTranstype(body.transType);
  const data = {
    transID: transID,
    username: params.username,
    account: params.account,
    amount: params.amount,
    balance: newBalance,
    transType: "Withdraw",
    accountType: "MPESA"
  };
  return WalletQueries.updateUserWalletLogs(data);
}

async function transferFunds(params) {
  const recipient = params.to;
  const amount = params.amount;
  const token = params.token;
  const account = params.phoneNumber;
  console.log(`Sending payment of ${amount} ${token} to ${recipient}`);

  //check if user Account has enough funds
  const celoUserWallet = await WalletQueries.fetchUserWallet(account);
  const balance = celoUserWallet.balance;
  if (balance < amount) return "Account has Insufficient balance";

  // Set up your account in contract kit
  const account = accounts.getAccount(identity);
  const mainAccount = accounts.getAccount("_MainAccount");
  kit.addAccount(account.privateKey);
  kit.addAccount(mainAccount.privateKey);
  kit.defaultAccount = mainAccount.address;
  console.log("Kit account is set up");

  // Get the right token contract
  let contract;
  if (token.toLowerCase() === "cusd") {
    contract = await kit.contracts.getStableToken();
  } else if (token.toLowerCase() === "cgld") {
    contract = await kit.contracts.getGoldToken();
  } else {
    console.error(`Invalid token ${token}, use cGLD or cUSD`);
    return false;
  }
  console.log("Kit contract is set up, creating transaction");

  //check if main account has enough funds
  const organizationBalance = accounts.getBalances("_MainAccount");
  if (amount > organizationBalance)
    return `Main Account has insufficient Funds ${organizationBalance} to send amount ${amount}`;

  // Create the payment transaction
  const tx = await contract
    .transfer(recipient, amount)
    .send({ from: MAIN_ACCOUNT_ADDRESS });

  const hash = await tx.getHash();
  console.log("Hash receipt recieved", hash);
  const receipt = await tx.waitReceipt();
  console.log("Tx receipt recieved", receipt);
  const newOrganizationBalance = await contract.balanceOf(mainAccount.address);
  const newBalance = await contract.balanceOf(account.address);
  console.log(`New balance is ${newBalance.toString()}`);
  kit.stop();

  const newBalance = celoUserWallet.balance - params.amount;
  const transID = Helper.setTranstype("Transfer");
  const data = {
    transID: transID,
    username: params.username,
    account: recipient,
    amount: params.amount,
    balance: newBalance,
    transType: "Transfer",
    accountType: "cUSD"
  };
  WalletQueries.updateUserWalletLogs(data);

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
