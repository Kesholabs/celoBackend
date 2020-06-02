const Helper = require("../helper/helper");
const logger = Helper.getLogger("USER_WALLET_QUERY");
const UserWalletLogsModel = require("../model/UserWalletLogs");

function createUserWalletLogs(body) {
  logger.info("Create userwalletlogs");
  try {
    const newUserWalletLogsModel = new UserWalletLogsModel({
      transId: body.transId,
      transType: body.transType,
      amount: body.amount,
      balance: body.balance,
      currency: body.currency,
      account: body.account
    });
    return newUserWalletLogsModel.save();
  } catch (error) {
    logger.error(error);
  }
}

function fetchUserWalletByParams(body) {
  let param = body.param;
  try {
    switch (param) {
      case "transId":
        return UserWalletLogsModel.find(param);
      case "transType":
        return UserWalletLogsModel.find(param);
      case "account":
        return UserWalletLogsModel.find(param);
      case "username":
        return UserWalletLogsModel.find(param);
      case "accountType":
        return UserWalletLogsModel.find(param);
      default:
        return "Invalid type";
    }
  } catch (error) {
    logger.error(error);
  }
}

function fetchUserWalletByAccount(account) {
  return UserWalletLogsModel.find({ account });
}

module.exports = {
  createUserWalletLogs,
  fetchUserWalletByParams,
  fetchUserWalletByAccount
};
