const web3 = require("web3");
const fs = require("fs");
const web3Instance = new web3();
const contractkit = require("@celo/contractkit");
const NODE_URL = "https://alfajores-forno.celo-testnet.org"; //..TODO: CHANGE THIS TO OUR NODE ADDRESS
const kit = contractkit.newKit(NODE_URL);

const ratesJson = require(__dirname + "./../exchangeRates.json");
// const publicPath = require(__dirname + "./../public/");

/**
 * TODO: CREATE WALLET ACCOUNT ON SIGN UP
 */
function createAccount(identity) {
  console.log("Creating a new account");
  try {
    const account = web3Instance.eth.accounts.create();
    console.log(`Made new account ${account.address}`);
    fs.writeFileSync("./public/" + identity, account.privateKey, error => {
      if (error) return console.error(error);
      console.log(`Account private key saved to ${identity}`);
      console.log(`Wallet Address ${account.address}`);
    });

    return account;
  } catch (error) {
    console.error(error);
  }
}

/**
 * TODO: FETCH WALLET ACCOUNT ON SIGN IN
 */
function getAccount(identity) {
  console.log("Getting your account");
  try {
    if (!fs.existsSync(identity)) {
      console.log("No account found, create one first");
      return false;
    }

    const privateKey = fs.readFileSync("./public/" + identity, "utf8");
    const account = web3Instance.eth.accounts.privateKeyToAccount(privateKey);
    console.log(`Found account ${account.address}`);
    return account;
  } catch (error) {
    console.error(error);
  }
}

/**
 * TODO: FETCH WALLET BALANCE
 */
async function getBalances(identity, localCurrency) {
  console.log("Getting your balances");
  try {
    const address = getAccount(identity).address;
    if (!address) return "Invalid identity or no account exists";

    const balances = await kit.getTotalBalance(address);
    const balanceUSD = await kit.web3.utils.fromWei(
      balances.usd.toString(),
      "ether"
    );
    console.log("balance ", balanceUSD);
    const local = await currencyConvertion(localCurrency, balanceUSD); //TODO: CURRENCY IN DOLLARS, CONVERT TO ANY OTHER CURRENCY
    console.log(`${localCurrency} balance: ${local.local_Currency}`);
    console.log(`Dollar balance: ${balanceUSD}`);
    // console.log(`Gold balance: ${balances.gold}`);
    // kit.stop();
    return {
      usd: balanceUSD,
      local: local.local_Currency
    };
  } catch (error) {
    console.error(error);
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
