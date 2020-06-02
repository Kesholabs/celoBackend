const Helper = require("../helper/helper");
const logger = Helper.getLogger("TRACKTRANS_QUERY");
const MainWalletQuery = require("../query/MainWalletQuery");
const UserWalletQuery = require("../query/UserWalletQuery");

function isMainAccountTrans({
  recipient,
  recipientAccount,
  amount,
  identity,
  type
}) {
  logger.info("Backup transaction detail ", type);
  if (identity === "MAIN_ACCOUNT" || recipientAccount === "MAIN_ACCOUNT") {
    return trackMainWallet(identity, amount, type, recipientAccount);
  }
  return trackUserWalletTransfer(identity, amount, type, recipientAccount);
}

function trackMainWallet(identity, amount, type, recipientAccount) {
  logger.info("Track Main Wallet");
  try {
    switch (type) {
      case "Deposit":
        return MainWalletQuery.withDrawal(identity, amount, recipientAccount);
      case "Withdraw":
        return MainWalletQuery.deposit(identity, amount, recipientAccount);
      default:
        return "Invalid Transaction";
    }
  } catch (error) {}
}

function trackUserWallet({ transId, transType, recipientAccount, account, amount }) {
  logger.info("Track User Wallet transtype ", transType);
  try {
    switch (transType) {
      case "Deposit":
        return UserWalletQuery.deposit(
          recipientAccount,
          amount,
          transId,
          "Deposit"
        );
      case "Withdraw":
        return UserWalletQuery.withdraw(
          account,
          amount,
          transId,
          "Withdraw"
        );
      default:
        return "Invalid Transaction";
    }
  } catch (error) {}
}

async function trackUserWalletTransfer(
  account,
  amount,
  transType,
  recipientAccount
) {
  logger.info("Track Transfer fund");
  const transId = await Helper.transTypeID("Transfer");
  return UserWalletQuery.transfer(
    account,
    amount,
    transId,
    transType,
    recipientAccount
  );
}

exports.isMainAccountTrans = isMainAccountTrans;
exports.trackUserWallet = trackUserWallet;
exports.trackUserWalletTransfer = trackUserWalletTransfer;
