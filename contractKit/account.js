const web3 = require("web3");
const fs = require("fs");
const web3Instance = new web3();
const contractkit = require("@celo/contractkit");
const NODE_URL = "https://alfajores-forno.celo-testnet.org"; //..TODO: CHANGE THIS TO OUR NODE ADDRESS
const kit = contractkit.newKit(NODE_URL);
const Helper = require("../helper/helper");
const Crypto = require("../middleware/crypto");
const Redis = require("../middleware/redis");

const ratesJson = require(__dirname + "./../exchangeRates.json");

/**
 * TODO: CREATE WALLET ACCOUNT ON SIGN UP
 */
async function createAccount(body) {
  console.log("Creating a new account");
  try {
    const { account, password } = body;
    const identity = account;
    const wallet = web3Instance.eth.accounts.create();
    console.log(`Made new account ${wallet.address}`);

    //ENCRYPT PRIVATE KEY
    const encryptedData = await Crypto.encrypt(wallet.privateKey);

    //WRITE PRIVATE KEY TO FILE
    fs.writeFileSync(
      "./public/" + identity + ".json",
      JSON.stringify(encryptedData)
    );
    console.log(`Account private key saved to ${identity}`);
    console.log(`Wallet Address ${wallet.address}`);
    return wallet.address;
  } catch (error) {
    console.error(error);
    return error;
  }
}

/**
 * TODO: FETCH WALLET ACCOUNT ON SIGN IN
 */
async function getAccount(identity) {
  console.log("Getting your account ", identity);
  try {
    if (!fs.existsSync("./public/" + identity + ".json")) {
      console.log("No account found, create one first");
      return false;
    }

    const privateKey = fs.readFileSync(
      "./public/" + identity + ".json",
      "utf8"
    );
    const decode = await Crypto.decrypt(JSON.parse(privateKey));
    const account = web3Instance.eth.accounts.privateKeyToAccount(decode);
    console.log(`Found account ${account.address}`);
    return account;
  } catch (error) {
    console.error(error);
    return error;
  }
}

/**
 * TODO: FETCH WALLET BALANCE
 */
async function getBalances(body, localCurrency) {
  console.log("Getting your balances");
  try {
    const { account } = body;
    const { address } = await getAccount(account);
    if (!address) return "Invalid account or no account exists";

    const balances = await kit.getTotalBalance(address);
    console.log("BALANCE ", balances.usd);
    var bnBalance = await web3.utils.toBN(balances.usd);
    const balanceUSD = await kit.web3.utils.fromWei(bnBalance, "ether");
    console.log("balance ", balanceUSD);
    const local = await currencyConvertion(localCurrency, balanceUSD); //TODO: CURRENCY IN DOLLARS, CONVERT TO ANY OTHER CURRENCY
    console.log(`${localCurrency} balance: ${local.local_Currency}`);
    console.log(`Dollar balance: ${balanceUSD}`);

    return {
      usd: balanceUSD,
      local: local.local_Currency,
      localCurrency
    };
  } catch (error) {
    console.error(error);
    return error;
  }
}

function currencyConvertion(localCurrency, balances) {
  console.log("Currency %s and amount %s", localCurrency, balances);
  try {
    if (!ratesJson["rates"][localCurrency])
      return {
        local_Currency: `No Currency with the following Symbol ${localCurrency}`
      };

    if (localCurrency === "USD")
      return { cUsd: `${balances}`, local_Currency: `${balances}` };

    console.log(`Currency rate, ${ratesJson["rates"][localCurrency]}`);
    console.log(`Currency convertion from USD to ${localCurrency}`);
    console.log(
      `Currency Converted ${balances * ratesJson["rates"][localCurrency]}`
    );
    return {
      cUsd: `${balances / ratesJson["rates"][localCurrency]}`,
      local_Currency: `${balances * ratesJson["rates"][localCurrency]}`
    };
  } catch (err) {
    console.error("Error parsing JSON string:", err);
    return err;
  }
}

// createAccount("070034567")
// getAccount("070034567")
// getBalances("070034567");

module.exports = {
  createAccount,
  getAccount,
  getBalances,
  currencyConvertion
};
