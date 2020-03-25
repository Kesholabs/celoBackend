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

  const web33 = kit.web3;
  // const balances = await web3.eth.getBalance(address)

  const balances = await kit.getTotalBalance(address);
  console.log(typeof balances.usd);
  console.log(web33.utils.fromWei(balances.usd, "ether"));
  const local = await currencyConvertion(localCurrency, balances.total);
  console.log(`${localCurrency} balance: ${local.local_Currency}`);
  console.log(`Dollar balance: ${balances.usd}`);
  console.log(`Gold balance: ${balances.gold}`);
  // kit.stop();
  return {
    usd: balances.usd,
    local: local.local_Currency
  };
}

function currencyConvertion(localCurrency, balances) {
  console.log("Currency %s and amount %s", localCurrency, balances);
  try {
    if (!ratesJson["rates"][localCurrency])
      return {
        local_Currency: `No Currency with the following Symbol ${localCurrency}`
      };

    if (localCurrency === "USD") return { local_Currency: `${balances}` };

    console.log(`Currency rate, ${ratesJson["rates"][localCurrency]}`);
    console.log(`Currency convertion from USD to ${localCurrency}`);
    console.log(
      `Currency Converted ${balances * ratesJson["rates"][localCurrency]}`
    );
    return {
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
