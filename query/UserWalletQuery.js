const Helper = require("../helper/helper");
const logger = Helper.getLogger("USER_WALLET_QUERY");
const UserWalletModel = require("../model/UserWallet");
const UserWalletLogsQuery = require("./UserWalletLogsQuery");

function createUserWallet(body) {
  logger.debug("create userwallet");
  try {
    const newUserWalletModel = new UserWalletModel({
      account: body.account
    });
    return newUserWalletModel.save();
  } catch (error) {
    logger.error(error);
  }
}

function fetchUserWalletByUsername(username) {
  return UserWalletModel.findOne({ username });
}

function fetchUserWalletByAccount(account) {
  return UserWalletModel.findOne({ account });
}

async function deposit(account, amount, transId, transType) {
  logger.debug("deposit to userwallet");
  let userWallet = await fetchUserWalletByAccount(account);
  if (!userWallet) {
    logger.error("Userwallet doesnt exist...Creating");
    userWallet = await createUserWallet({ account });
  }
  const currentAmt = userWallet.amount;
  const balance = parseFloat(currentAmt) + parseFloat(amount);
  logger.info(
    "currentAmount %s Amount %s Balance %s",
    currentAmt,
    amount,
    balance
  );
  return updateUserWallet(account, amount, balance, transId, transType);
}

async function withdraw(account, amount, transId, transType) {
  logger.debug("withdraw to userwallet");
  let userWallet = await fetchUserWalletByAccount(account);
  if (!userWallet) {
    logger.error("Userwallet doesnt exist...Creating");
    userWallet = await createUserWallet({ account });
  }
  const currentAmt = userWallet.amount;
  if (currentAmt > amount) {
    const balance = parseFloat(currentAmt) + parseFloat(amount);
    logger.info(
      "currentAmount %s Amount %s Balance %s",
      currentAmt,
      amount,
      balance
    );
    return updateUserWallet(account, amount, balance, transId, transType);
  }
  logger.error("Insufficient Balance %s to transact %s", currentAmt, amount);
  return "Insufficient Balance";
}

async function transfer(account, amount, transId, transType, recipientAccount) {
  logger.debug("transfer to userwallet");
  const withdraw = await withdraw(account, amount, transId, transType);
  const deposit = await deposit(recipientAccount, amount, transId, transType);
  return deposit;
}

async function updateUserWallet(account, amount, balance, transId, transType) {
  logger.debug("update userwallet");
  try {
    const query = { account };
    const update = { amount: balance };
    const createdUserWalletLogs = await UserWalletLogsQuery.createUserWalletLogs(
      { account, amount, balance, transId, transType }
    );
    if (!createdUserWalletLogs) {
      logger.error("UserWalletLogs was not created");
      return;
    }
    const updateUserWallet = await UserWalletModel.findOneAndUpdate(
      query,
      update,
      { new: true }
    );
    return updateUserWallet;
  } catch (error) {
    logger.error(error);
  }
}

module.exports = {
  createUserWallet,
  fetchUserWalletByUsername,
  fetchUserWalletByAccount,
  transfer,
  withdraw,
  deposit
};
