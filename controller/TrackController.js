const Helper = require("../helper/helper");
const logger = Helper.getLogger("ACCOUNT_CONTROLLER");
const Track = require("../query/MainWalletQuery");

module.exports = {
  addFunds: async (req, res, next) => {
    logger.info("\n=================== Add Funds ====================\n");
    const funds = await Track.addFunds(req.body);
    const msg = await Helper.getSuccessMessage(funds);
    return res.send(msg);
  }
};
