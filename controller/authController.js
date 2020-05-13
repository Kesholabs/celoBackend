const Helper = require("../helper/helper");
const logger = Helper.getLogger("ACCOUNT_CONTROLLER");
const Redis = require("../middleware/redis");

module.exports = {
  validateAccount: async (req, res, next) => {
    logger.info(
      "\n=================== VALIDATE ACCOUNT AND ISSUE JWT ====================\n"
    );
    const { account, password } = req.body;
    //SAVE USER PASSWORD
    // const token = await Redis.setAccounts(account, password);
    //ISSUE JWT
    const token = await Redis.getAccount(account, password);
    console.log(token);
    const msg = await Helper.getSuccessMessage({ token });
    return res.send(msg);
  },
  changePassword: async (req, res, next) => {
    logger.info("\n=================== CHANGE PASSWORD ====================\n");
    const { account, password, newpassword } = req.body;
    const changedPwd = await Redis.changeAccount(
      account,
      password,
      newpassword
    );
    const msg = await Helper.getSuccessMessage(changedPwd);
    return res.send(msg);
  }
};
