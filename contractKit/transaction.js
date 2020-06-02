const contractkit = require("@celo/contractkit");
const NODE_URL = "https://alfajores-forno.celo-testnet.org"; //..TODO: CHANGE THIS TO OUR NODE ADDRESS
const axios = require("axios");
const kit = contractkit.newKit(NODE_URL);
const Helper = require("../helper/helper");
const logger = Helper.getLogger("CELO_TRANSACTION_METHODS");
const accounts = require("./account");
const TrackTrans = require("../script/TrackTransScript");

async function depositFunds(params) {
  console.log("\n================ DEPOSIT FUNDS =================\n");
  const identity = params.account;
  const amount = params.amount;
  const currency = params.currency;

  const { address } = await accounts.getAccount(identity);
  const data = {
    identity,
    account: "MAIN_ACCOUNT",
    recipient: address,
    amount: amount,
    currency: currency,
    type: "Deposit"
  };
  return transferFunds(data);
}

async function orclDepositFunds(params) {
  console.log("\n================ ORACLE DEPOSIT FUNDS =================\n");
  const phoneNumber = params.phoneNumber;
  const identity = params.account;
  //const amount = params.amount;
  const currency = params.currency;
  let kesforex = 102;
  try {
    kesforex = await axios.get(
      `http://backend.bithela.com/api/trade/forex/usd/rate/KES`
    );
    kesforex = kesforex.data.rate;
  } catch (e) {
    console.log("!!!!!!!| Forex err |!!!!!!", e);
  }
  console.log("Forex Rate:", kesforex);
  //let amount = await accounts.currencyConvertion(currency, params.amount).cUsd; //TODO: CURRENCY IN WORLD CURRENCY
  let amount = params.amount / kesforex;
  console.log("Converted amt", amount);
  try {
    const account = await accounts.getAccount(identity);
    kit.addAccount(account.privateKey);
    await kit.setFeeCurrency(contractkit.CeloContract.StableToken);
    console.log("Kit contract is set up, creating transaction");
    let kitContract = await kit.contracts.getStableToken(); //set stable token as cUSD
    const walletBalance = await kitContract.balanceOf(account.address);
    logger.info(`${identity} ACCOUNT BALANCE ${walletBalance}`);

    let abi = [
      {
        inputs: [
          { internalType: "contract Kesholabs", name: "prov", type: "address" },
          { internalType: "contract StableToken", name: "er", type: "address" }
        ],
        payable: false,
        stateMutability: "nonpayable",
        type: "constructor"
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: "string",
            name: "description",
            type: "string"
          }
        ],
        name: "LogErrorInCallback",
        type: "event"
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: "string",
            name: "_description",
            type: "string"
          }
        ],
        name: "LogNewKesholabsQuery",
        type: "event"
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: "address",
            name: "",
            type: "address"
          },
          { indexed: false, internalType: "uint256", name: "", type: "uint256" }
        ],
        name: "Received",
        type: "event"
      },
      { payable: true, stateMutability: "payable", type: "fallback" },
      {
        constant: false,
        inputs: [
          { internalType: "address", name: "_sender", type: "address" },
          { internalType: "uint48", name: "_phoneNumber", type: "uint48" },
          { internalType: "uint256", name: "_amount", type: "uint256" }
        ],
        name: "Kesholabs_query",
        outputs: [{ internalType: "bytes32", name: "_id", type: "bytes32" }],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        constant: true,
        inputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
        name: "Queuemap",
        outputs: [
          { internalType: "uint256", name: "amount", type: "uint256" },
          { internalType: "address", name: "sender", type: "address" }
        ],
        payable: false,
        stateMutability: "view",
        type: "function"
      },
      {
        constant: false,
        inputs: [
          { internalType: "bytes32", name: "_myid", type: "bytes32" },
          { internalType: "uint8", name: "_result", type: "uint8" }
        ],
        name: "_callback",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        constant: false,
        inputs: [
          { internalType: "address", name: "_to", type: "address" },
          { internalType: "uint48", name: "_phoneNumber", type: "uint48" },
          { internalType: "uint256", name: "_amount", type: "uint256" }
        ],
        name: "deposit",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        constant: false,
        inputs: [
          { internalType: "uint48", name: "_phoneNumber", type: "uint48" },
          { internalType: "uint256", name: "_amount", type: "uint256" }
        ],
        name: "deposit",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
      }
    ];
    let contract = new kit.web3.eth.Contract(
      abi,
      "0xf0e7d0f01960a1f93394c73F3179CB494AfD32Aa"
    );

    const goldAmount = kit.web3.utils.toWei(`${amount}`, "ether");
    console.log(">>>>>>>>>>Ethers", goldAmount);
    if (walletBalance.toNumber() < 0) {
      console.log("I have some gas");
      const tx = await contract.methods.deposit(phoneNumber, goldAmount).send({
        from: account.address,
        gasPrice: 10000000000
      });
      console.log(tx);
      if (!tx) {
        return "Error Processing Request";
      } else {
        return tx;
      }
    } else {
      console.log("I need some gas");
      const mainAccount = await accounts.getAccount("MAIN_ACCOUNT");
      kit.addAccount(mainAccount.privateKey);
      const tx = await contract.methods
        .deposit(account.address, phoneNumber, goldAmount)
        .send({
          from: mainAccount.address,
          gasPrice: 10000000000
        });
      console.log(tx);
      if (!tx) {
        return "Error Processing Request";
      } else {
        return tx;
      }
    }
  } catch (e) {
    console.log(e);
    return "Error Processing Request";
  }
}

async function withdrawFunds(params) {
  console.log("\n================ WITHDRAW =================\n");
  const identity = params.account;
  const amount = params.amount;
  const currency = params.currency;

  const ownWallet = await accounts.getAccount(identity);
  const walletAddress = await accounts.getAccount("MAIN_ACCOUNT");
  const data = {
    identity: "MAIN_ACCOUNT",
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
  const identity = params.account; //MAIN ACCOUNT
  const owner = params.identity; //OWNER ACCOUNT
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
      return buyIn(recipient, amount, identity, type, owner);
    case "Withdraw":
      console.log(
        `${type} payment of ${amount} from ${identity} : ${ownAdress}`
      );
      return buyOut(recipient, amount, identity, type, owner);
    case "Transfer":
      console.log(
        `${type} payment of ${amount} from ${identity} to ${recipient}`
      );
      return send(recipient, amount, identity, type);
    default:
      console.log(
        `${type} payment of ${amount} from ${identity} : ${recipient}`
      );
      return "Invalid transaction type";
  }
}

async function buyIn(recipient, amount, identity, type, owner) {
  logger.info("Buyin Method");
  return process(recipient, amount, identity, type, owner);
}

async function buyOut(recipient, amount, identity, type, owner) {
  logger.info("BuyOut Method");
  return process(recipient, amount, identity, type, owner);
}

async function send(recipient, amount, identity, type) {
  logger.info("Send Method");
  const { address } = await accounts.getAccount(recipient);
  return process(address, amount, identity, type, recipient);
}

async function process(recipient, amount, identity, type, recipientAccount) {
  logger.info("PROCESSING TRANSACTION");
  console.log(
    `${type} funds cUSD ${amount}.......from ${identity} to ${recipient} ${recipientAccount} `
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

    //LOG THIS TRANSACTION TO THE BACKUP
    const toBackUp = {
      recipient,
      amount,
      identity,
      type,
      recipientAccount
    };
    TrackTrans.isMainAccountTrans(toBackUp);

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
  depositFunds,
  orclDepositFunds
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
