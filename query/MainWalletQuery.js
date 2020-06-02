const Helper = require("../helper/helper");
const logger = Helper.getLogger("MAIN_WALLET_QUERY");
const MainWalletLogsQuery = require("./MainWalletLogsQuery");
const MainWalletModel = require("../model/MainWallet");
const TrackTrans = require("../script/TrackTransScript");

function addFunds(body) {
  logger.info("Add funds");
  try {
    const newMainWalletModel = new MainWalletModel({
      account: body.account,
      amount: body.amount
    });
    return newMainWalletModel.save();
  } catch (error) {
    logger.error(error);
  }
}

async function updateMainWallet(
  account,
  amount,
  balance,
  transType,
  recipientAccount
) {
  logger.info("Update MainWalletLogs ", account, amount, balance, transType);
  try {
    const query = { account };
    const update = { amount: balance };
    const createdMainWalletLogs = await MainWalletLogsQuery.createMainWalletLogs(
      { account, amount, balance, transType, recipientAccount }
    );
    if (!createdMainWalletLogs) {
      logger.error("MainWalletLog was not created");
      return;
    }

    await TrackTrans.trackUserWallet(createdMainWalletLogs);

    const updateMainWallet = await MainWalletModel.findOneAndUpdate(
      query,
      update,
      { new: true }
    );
    return updateMainWallet;
  } catch (error) {
    logger.error(error);
  }
}

function fetchFunds() {
  logger.info("Fetch Funds");
  try {
    return MainWalletModel.find();
  } catch (error) {
    logger.error(error);
  }
}

async function deposit(account, amount, recipientAccount) {
  logger.info("Deposit to Main Wallet");
  const currentBal = await fetchFunds();
  const mainAccBal = currentBal[0].amount;
  let newMainAccBal = parseFloat(mainAccBal) + parseFloat(amount);
  logger.info(
    "currentAmount %s Amount %s Balance %s",
    mainAccBal,
    amount,
    newMainAccBal
  );
  return updateMainWallet(
    account,
    amount,
    newMainAccBal,
    "Withdraw",
    recipientAccount
  );
}

async function withDrawal(account, amount, recipientAccount) {
  logger.info("Withdraw to Main Wallet");
  const currentBal = await fetchFunds();
  const mainAccBal = currentBal[0].amount;
  if (mainAccBal > amount) {
    let newMainAccBal = parseFloat(mainAccBal) + parseFloat(amount);
    logger.info(
      "currentAmount %s Amount %s Balance %s",
      mainAccBal,
      amount,
      newMainAccBal
    );
    return updateMainWallet(
      account,
      amount,
      newMainAccBal,
      "Deposit",
      recipientAccount
    );
  }

  return "Insufficient Balance";
}

module.exports = {
  addFunds,
  fetchFunds,
  deposit,
  withDrawal
};
