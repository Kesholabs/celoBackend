const Helper = require("../helper/helper");
const logger = Helper.getLogger("MAIN_WALLET_QUERY");
const MainWalletLogsModel = require("../model/MainWalletLogs");

async function createMainWalletLogs(body) {
  const transId = await Helper.transTypeID(body.transType);
  logger.debug("MainWalletLogs ", body);
  try {
    const newMainWalletLogsModel = new MainWalletLogsModel({
      transId: transId,
      transType: body.transType,
      account: body.account,
      amount: body.amount,
      balance: body.balance,
      recipientAccount:body.recipientAccount
    });
    return newMainWalletLogsModel.save();
  } catch (error) {
    logger.error(error);
  }
}

function fetchMainWalletLogsByParams(body) {
  let param = body.param;
  try {
    switch (param) {
      case "transId":
        return MainWalletLogsModel.find(param);
      case "transType":
        return MainWalletLogsModel.find(param);
      case "account":
        return MainWalletLogsModel.find(param);
      default:
        return "Invalid type";
    }
  } catch (error) {
    logger.error(error);
  }
}

function fetchAllMainWalletLogs() {
  try {
    return MainWalletLogsModel.find();
  } catch (error) {
    logger.error(error);
  }
}

module.exports = {
  createMainWalletLogs,
  fetchMainWalletLogsByParams,
  fetchAllMainWalletLogs
};
