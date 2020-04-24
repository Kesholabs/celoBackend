const Helper = require("../helper/helper");
const logger = Helper.getLogger("ACCOUNT_CONTROLLER");
const Redis = require("../middleware/redis");

module.exports = {
  validateAccount: async (req, res, next) => {
    logger.info(
      "\n=================== VALIDATE ACCOUNT AND ISSUE JWT ====================\n"
    );
    const { account, password } = req.body;
    //ISSUE JWT
    const token = await Redis.getAccount(account, password);
    console.log(token);
    const msg = await Helper.getSuccessMessage({ token: token });
    return res.send(msg);
  }
};
