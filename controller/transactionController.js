const Util = require("util");
const Helper = require("../helper/helper");
const logger = Helper.getLogger("TRANSACTION_CONTROLLER");
const contractKit = require("../contractKit/transaction");

module.exports = {
  deposit: async (req, res, next) => {
    logger.info("\n=================== DEPOSIT CONTROLLER ====================\n");
    const params = req.body;
    const address = await contractKit.depositFunds(params);
    const msg = await Helper.getSuccessMessage(address);
    return res.send(msg);
  },
  orclDeposit: async (req, res, next) => {
    const params = req.body;
    const address = await contractKit.orclDepositFunds(params);
    try {
      if (address.startsWith("Error")) {
        const msg = await Helper.getOtherErrorMessage(address);
        return res.send(msg);
      }
    } catch (e) {
      const msg = await Helper.getSuccessMessage(address);
      return res.send(msg);
    }
  },

  withdraw: async (req, res, next) => {
    logger.info("\n=================== WITHDRAW CONTROLLER ====================\n");
    const params = req.body;
    const address = await contractKit.withdrawFunds(params);
    const msg = await Helper.getSuccessMessage(address);
    return res.send(msg);
  },

  transfer: async (req, res, next) => {
    logger.info("\n=================== TRANSFER CONTROLLER ====================\n");
    const params = req.body;
    const addressBalance = await contractKit.transferFunds(params);
    const msg = await Helper.getSuccessMessage(addressBalance);
    return res.send(msg);
  }
};
