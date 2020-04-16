const contractkit = require("@celo/contractkit");
const NODE_URL = "https://alfajores-forno.celo-testnet.org"; //..TODO: CHANGE THIS TO OUR NODE ADDRESS
const kit = contractkit.newKit(NODE_URL);
const Helper = require("../helper/helper");
const logger = Helper.getLogger("CELO_TRANSACTION_METHODS");
const accounts = require("./account");

async function depositFunds(params) {
  console.log("\n================ DEPOSIT FUNDS=================\n");
  const identity = params.account;
  const amount = params.amount;
  const currency = params.currency;

  const { address } = await accounts.getAccount(identity);
  const data = {
    account: "MAIN_ACCOUNT",
    recipient: address,
    amount: amount,
    currency: currency,
    type: "Deposit"
  };
  return transferFunds(data);
}

async function withdrawFunds(params) {
  console.log("\n================ WITHDRAW =================\n");
  const identity = params.account;
  const amount = params.amount;
  const currency = params.currency;

  const ownWallet = await accounts.getAccount(identity);
  const walletAddress = await accounts.getAccount("MAIN_ACCOUNT");
  const data = {
    account: identity,
    ownAdress: ownWallet.address,
    recipient: walletAddress.address,
    amount: amount,
    currency: currency,
    type: "Withdraw"
  };
  return transferFunds(data);
}

async function transferFunds(params) {
  console.log("\n================ TRANSFER FUNDS=================\n");
  console.log("Body \n ", params);
  const identity = params.account;
  const ownAdress = params.ownAdress;
  const currency = params.currency;
  const amount = await accounts.currencyConvertion(currency, params.amount)
    .cUsd; //TODO: CURRENCY IN WORLD CURRENCY
  const recipient = params.recipient;
  const type = params.type || "Transfer";

  switch (type) {
    case "Deposit":
      console.log(
        `${type} payment of ${amount} from ${identity} : ${recipient}`
      );
      return buyIn(recipient, amount, identity);
    case "Withdraw":
      console.log(
        `${type} payment of ${amount} from ${identity} : ${ownAdress}`
      );
      return buyOut(recipient, amount, identity);
    case "Transfer":
      console.log(
        `${type} payment of ${amount} from ${identity} to ${recipient}`
      );
      return send(recipient, amount, identity);
    default:
      console.log(
        `${type} payment of ${amount} from ${identity} : ${recipient}`
      );
      return "Invalid transaction type";
  }
}

async function buyIn(recipient, amount, identity) {
  logger.info("Buyin Method");
  return process(recipient, amount, identity);
}

async function buyOut(recipient, amount, identity) {
  logger.info("BuyOut Method");
  return process(recipient, amount, identity);
}

async function send(recipient, amount, identity) {
  logger.info("Send Method");
  const { address } = await accounts.getAccount(recipient);
  return process(address, amount, identity);
}
async function process(recipient, amount, identity) {
  logger.info("PROCESSING TRANSACTION");
  console.log(
    "transer funds cUSD %s.......from %s to %s ",
    amount,
    identity,
    recipient
  );

  try {
    // Set up your account in contract kit
    const account = await accounts.getAccount(identity);
    kit.addAccount(account.privateKey);
    // kit.defaultAccount = account.address;
    await kit.setFeeCurrency(contractkit.CeloContract.StableToken);
    console.log("Kit contract is set up, creating transaction");

    // Get the right token contract
    let contract = await kit.contracts.getStableToken(); //set stable token as cUSD

    //check if account has enough funds
    const walletBalance = await contract.balanceOf(account.address);
    logger.info(`${identity} ACCOUNT BALANCE ${walletBalance}`);

    if (parseFloat(amount) > parseFloat(walletBalance))
      return `${identity} Account has insufficient Funds ${walletBalance} to send amount ${amount}`;

    // Create the payment transaction
    // method:1
    // const tx = await contract.transfer(recipient, amount).send();

    // method:2
    // const tx = await kit.sendTransaction({
    //   from: account.address,
    //   to: recipient,
    //   value: amount,
    // });

    // method:3
    const amountInWei = await kit.web3.utils.toWei(amount.toString(), "ether"); //TODO: CONVERT TO USEABLE CURRENCY WEI
    const tx = await contract.transfer(recipient, amountInWei).send({
      from: account.address,
      gasPrice: 10000000000
    });

    const hash = await tx.getHash();
    console.log("Hash receipt recieved", hash);
    const receipt = await tx.waitReceipt();
    console.log("Tx receipt recieved", receipt);

    const newOrganizationBalance = await contract.balanceOf(account.address);
    const newBalance = await contract.balanceOf(recipient);
    console.log(`New Receipt balance is ${newBalance.toString()}`);
    console.log(
      `New Oganization balance is ${newOrganizationBalance.toString()}`
    );
    // kit.stop();

    //TODO: CONVERT ALL AMOUNT BACK TO USD newOrganizationBalance, newBalance

    return {
      hash: hash,
      receipt: receipt,
      organizationBalance: newOrganizationBalance,
      wallet: recipient,
      walletBalance: newBalance
    };
  } catch (error) {
    console.error(error);
    const msg = await Helper.getErrorMessage(error);
    return msg;
  }
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
