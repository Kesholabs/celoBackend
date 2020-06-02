const Helper = require("../helper/helper");
const logger = Helper.getLogger("AUTH_SCRIPT");
const UserAccountModel = require("../model/UserAccount");
const JWT = require("../middleware/jwt");

function createUserAccount(body) {
  logger.info("Create new user account");
  try {
    const newUserAccountModel = new UserAccountModel({
      account: body.account
    });
    return newUserAccountModel.save();
  } catch (error) {
    logger.error(error);
  }
}

async function setPin(account, password) {
  const hashPassword = await Helper.generateHash(password);
  let query = { account };
  let update = { pin: hashPassword };
  const existingUserAccount = await UserAccountModel.findOneAndUpdate(
    query,
    update,
    { new: true }
  );
  logger.info(existingUserAccount);
  return existingUserAccount;
}

async function getPin({ account, password }) {
  logger.info("Validate for account ", account);

  let msg = "Unauthorized";

  const existingUserAccount = await UserAccountModel.findOne({ account });
  if (!existingUserAccount) {
    logger.error(`${msg} Account doesn't exist`);
    return msg;
  }

  let pinResult = existingUserAccount.pin;
  if (pinResult === "Not Touched") {
    logger.info("User Account does not have a Pin");
    logger.info("Create pin ");
    const { pin } = await setPin(account, password);
    pinResult = pin;
  }

  logger.info("User Account found with pin ");

  if (!(await Helper.validPassword(password, pinResult))) {
    logger.error(`${msg} Password Validation Failed`);
    return msg;
  }

  let token = await JWT.jsonwtSign({ account });
  logger.info("Issue JWT ", token);
  return token;
}

async function changePin(account) {
  const token = await JWT.jsonwtSign({ account });
  const pin = "";
  let query = { account };
  let update = { token, pin };
  await UserAccountModel.findOneAndUpdate(query, update, { new: true });
  return Helper.sendEmail(account, "Forgot Password", token); //send email to restart
}

async function redirect() {}

exports.setPin = setPin;
exports.getPin = getPin;
exports.changePin = changePin;
exports.createUserAccount = createUserAccount;
