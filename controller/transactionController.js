const Util = require("util");
const Helper = require("../helper/helper");
const logger = Helper.getLogger("TRANSACTION_CONTROLLER");
const contractKit = require("../contractKit/transaction");

module.exports = {
  deposit: async (req, res, next) => {
    logger.info("\n=================== DEPOSIT ====================\n");
    const params = req.body;
    const address = await contractKit.depositFunds(params);
    const msg = await Helper.getSuccessMessage(address);
    return res.send(msg);
  },

  withdraw: async (req, res, next) => {
    logger.info("\n=================== WITHDRAW ====================\n");
    const params = req.body;
    const address = await contractKit.withdrawFunds(params);
    const msg = await Helper.getSuccessMessage(address);
    return res.send(msg);
  },

  transfer: async (req, res, next) => {
    logger.info("\n=================== TRANSFER ====================\n");
    const params = req.body;
    const addressBalance = await contractKit.transferFunds(params);
    const msg = await Helper.getSuccessMessage(addressBalance);
    return res.send(msg);
  }
};
