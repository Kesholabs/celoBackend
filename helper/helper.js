const log4js = require("log4js");
const bcrypt = require("bcrypt");
const logger = log4js.getLogger("HELPER_METHOD");
logger.level = "debug";


// Generic error handler used by all endpoints.
const getErrorMessage = async field => {
  return {
    code: 400,
    success: false,
    message: field + " field is missing or Invalid in the request"
  };
};

// Generic error handler used by all endpoints.
const getErrorUnathorized = async field => {
  return {
    code: 401,
    success: false,
    message: field + " request"
  };
};

// Generic successful handler used by all endpoints.
const getSuccessMessage = async field => {
  return {
    code: 200,
    success: true,
    message: field
  };
};

// Generic Logger
const getLogger = moduleName => {
  const logger = log4js.getLogger(moduleName);
  logger.level = "debug";
  return logger;
};

const generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(12));
};

const validPassword = function (issuedPassword, password) {
  return bcrypt.compareSync(issuedPassword, password);
};

module.exports = {
  getErrorMessage,
  getErrorUnathorized,
  getSuccessMessage,
  getLogger,
  generateHash,
  validPassword
};
