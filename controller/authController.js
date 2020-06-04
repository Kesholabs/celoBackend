const Helper = require("../helper/helper");
const logger = Helper.getLogger("ACCOUNT_CONTROLLER");
const jwt = require("jsonwebtoken");
const AuthScript = require("../script/AuthScript");

module.exports = {
  validateAccount: async (req, res, next) => {
    logger.info(
      "\n=================== VALIDATE ACCOUNT AND ISSUE JWT ====================\n"
    );
    const { account, password } = req.body;
    //ISSUE JWT
    const token = await AuthScript.getPin({ account, password });
    console.log(token);
    const msg = await Helper.getSuccessMessage({ token });
    return res.send(msg);
  },

  changePassword: async (req, res, next) => {
    logger.info("\n=================== CHANGE PASSWORD ====================\n");
    const { account, authToken } = req.body;
    const changedPwd = await AuthScript.changePin(
      account,
      authToken
    );
    const msg = await Helper.getSuccessMessage(changedPwd);
    return res.send(msg);
  },

  redirect: async (req, res) => {
    const token = req.params.token;
    const secretKey = process.env.SECRET_KEY;
    jwt.verify(token, secretKey, async (err, verify) => {
      //REDIRECT TO 401 PAGE
      if (err) {
        res.writeHead(401, { Location: "https://pesabase.com" });
        res.end();
      }

      //REDIRECT TO LOGIN PAGE
      res.writeHead(200, {
        Location: "https://pesabase.com/resetpassword/" + token
      });
      res.end();
    });
  }
};
