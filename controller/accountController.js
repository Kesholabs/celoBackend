const Util = require("util");
const Helper = require("../helper/helper");
const logger = Helper.getLogger("ACCOUNT_CONTROLLER");
const contractKit = require("../contractKit/account");
const qrCode = require("../middleware/qrcode");

module.exports = {
  createAddressAccount: async (req, res, next) => {
    logger.info(
      "\n=================== CREATE WALLET ACCOUNT ====================\n"
    );
    const account = req.body;
    const address = await contractKit.createAccount(account);
    // const address = await qrCode.typeOfQRCode(account);
    const msg = await Helper.getSuccessMessage(address);
    return res.send(msg);
  },

  getWalletAddress: async (req, res, next) => {
    logger.info(
      "\n=================== GET WALLET ADDRESS ====================\n"
    );
    const account = req.body.account;
    const { address } = await contractKit.getAccount(account);
    const msg = await Helper.getSuccessMessage(address);
    return res.send(msg);
  },

  getAddressBalance: async (req, res, next) => {
    logger.info(
      "\n=================== GET WALLET BALANCE ====================\n"
    );
    const account = req.body;
    const localCurrency = req.body.currency;
    const addressBalance = await contractKit.getBalances(
      account,
      localCurrency
    );
    const msg = await Helper.getSuccessMessage(addressBalance);
    return res.send(msg);
  }
};
