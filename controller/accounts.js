const Util = require("util");
const Helper = require("../helper/helper");
const logger = Helper.getLogger("ACCOUNT_CONTROLLER");
const contractKit = require("../contractKit/account");

module.exports = {
  createAddressAccount: async (req, res, next) => {
    logger.info(
      "\n=================== CREATE WALLET ACCOUNT ====================\n"
    );
    const account = req.body.account;
    const address = await contractKit.createAccount(account).address;
    const msg = await Helper.getSuccessMessage(address);
    return res.send(msg);
  },

  getWalletAddress: async (req, res, next) => {
    logger.info(
      "\n=================== GET WALLET ADDRESS ====================\n"
    );
    const account = req.body.account;
    const address = await contractKit.getAccount(account).address;
    const msg = await Helper.getSuccessMessage(address);
    return res.send(msg);
  },

  getAddressBalance: async (req, res, next) => {
    logger.info(
      "\n=================== GET WALLET BALANCE ====================\n"
    );
    const account = req.body.account;
    const addressBalance = await contractKit.getBalances(account);
    const msg = await Helper.getSuccessMessage(addressBalance);
    return res.send(msg);
  }
};
