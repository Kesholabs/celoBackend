const web3 = require("web3");
const fs = require("fs");
const web3Instance = new web3();
const contractkit = require("@celo/contractkit");
const NODE_URL = "https://alfajores-forno.celo-testnet.org"; //..TODO: CHANGE THIS TO OUR NODE ADDRESS
const kit = contractkit.newKit(NODE_URL);

const ratesJson = require(__dirname + "./../exchangeRates.json");

/**
 * TODO: CREATE WALLET ACCOUNT ON SIGN UP
 */
function createAccount(identity) {
  console.log("Creating a new account");
  const account = web3Instance.eth.accounts.create();
  console.log(`Made new account ${account.address}`);
  fs.writeFileSync(identity, account.privateKey);
  console.log(`Account private key saved to ${identity}`);
  console.log(`Wallet Address ${account.address}`);
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

/**
 * TODO: FETCH WALLET BALANCE
 */
async function getBalances(identity, localCurrency) {
  console.log("Getting your balances");
  const address = getAccount(identity).address;
  if (!address) return "Invalid identity or no account exists";

  const balances = await kit.getTotalBalance(address);
  console.log(`Dollar balance: ${balances.usd}`);
  console.log(`Gold balance: ${balances.gold}`);
  kit.stop();

  // Read Rates File
  try {
    console.log("Currency", localCurrency);

    if (!ratesJson["rates"][localCurrency])
      return `No Currency with the following Symbol ${localCurrency}`;

    if (localCurrency === "USD")
      return { usd: balances.usd, local_Currency: `${balances.usd}` };

    console.log("Currency rate", ratesJson["rates"][localCurrency]);
    console.log(`Currency convertion from USD to ${localCurrency}`);
    console.log(
      `Currency Converted ${balances.usd * ratesJson["rates"][localCurrency]}`
    );
    return {
      usd: balances.usd,
      local_Currency: `${balances.usd * ratesJson["rates"][localCurrency]}`
    };
  } catch (err) {
    console.log("Error parsing JSON string:", err);
  }
}

// createAccount("070034567")
// getAccount("070034567")
// getBalances("070034567");

module.exports = {
  createAccount,
  getAccount,
  getBalances
};
